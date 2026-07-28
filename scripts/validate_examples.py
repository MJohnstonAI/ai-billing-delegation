#!/usr/bin/env python3
"""Validate ABDS v0.5 and v0.6 schemas, examples, and cross-event invariants."""

from __future__ import annotations

import base64
import copy
import hashlib
import hmac
import json
import math
import sys
from pathlib import Path
from typing import Any, Callable

try:
    from jsonschema import Draft202012Validator, FormatChecker
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: install jsonschema with `python -m pip install jsonschema`."
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
SCHEMAS = ROOT / "schemas"
EXAMPLES = ROOT / "examples"
INVALID = ROOT / "tests" / "invalid"

V05_USAGE_SCHEMA = SCHEMAS / "abds-usage-event-v0.5.schema.json"
V05_LEDGER_SCHEMA = SCHEMAS / "abds-ledger-event-v0.5.schema.json"
V05_USAGE_EXAMPLE = EXAMPLES / "usage-event-agent-fallback.json"
V05_LEDGER_EXAMPLE = EXAMPLES / "reservation-settlement-sequence.json"

V06_USAGE_SCHEMA = SCHEMAS / "abds-usage-event-v0.6.schema.json"
V06_CONSENT_SCHEMA = SCHEMAS / "abds-consent-receipt-v0.6.schema.json"
V06_RECON_SCHEMA = SCHEMAS / "abds-reconciliation-event-v0.6.schema.json"
V06_GATEWAY = EXAMPLES / "gateway-attested-usage-event.json"
V06_PROVIDER = EXAMPLES / "provider-signed-usage-event.json"
V06_CONSENT = EXAMPLES / "sponsor-consent-receipt.json"
V06_RECON = EXAMPLES / "late-usage-reconciliation.json"

TEST_HMAC_SECRET = b"abds-v0.6-test-secret"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_schema(instance: Any, schema: dict[str, Any], label: str) -> None:
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(instance), key=lambda error: list(error.path))
    if errors:
        details = "\n".join(
            f"- {label} at {'/'.join(map(str, error.path)) or '<root>'}: {error.message}"
            for error in errors
        )
        raise AssertionError(f"JSON Schema validation failed:\n{details}")


def validate_v05_cross_event_invariants(
    usage_event: dict[str, Any], ledger_events: list[dict[str, Any]]
) -> None:
    if not ledger_events:
        raise AssertionError("v0.5 ledger sequence must contain at least one event.")

    delegation_ids = {event["delegation_id"] for event in ledger_events}
    request_ids = {event["request_id"] for event in ledger_events}
    funding_buckets = {event["funding_bucket_ref"] for event in ledger_events}
    unit_types = {event["unit_type"] for event in ledger_events}

    if delegation_ids != {usage_event["delegation_id"]}:
        raise AssertionError("v0.5 usage and ledger events must share one delegation_id.")
    if request_ids != {usage_event["request_id"]}:
        raise AssertionError("v0.5 usage and ledger events must share one request_id.")
    if funding_buckets != {usage_event["billing"]["funding_bucket_ref"]}:
        raise AssertionError("v0.5 reservation and settlement must use one funding bucket.")
    if unit_types != {usage_event["billing"]["unit_type"]}:
        raise AssertionError("v0.5 usage and ledger events must use one unit_type.")

    event_ids = [event["ledger_event_id"] for event in ledger_events]
    if len(event_ids) != len(set(event_ids)):
        raise AssertionError("v0.5 ledger_event_id values must be unique.")

    settlement_ids = [
        event["settlement_id"]
        for event in ledger_events
        if event.get("event_type") == "settlement_posted"
    ]
    if len(settlement_ids) != len(set(settlement_ids)):
        raise AssertionError("v0.5 settlement_id values must be unique.")

    reservations = [
        event for event in ledger_events if event["event_type"] == "reservation_created"
    ]
    if len(reservations) != 1:
        raise AssertionError("v0.5 worked sequence must create exactly one reservation.")

    reservation = reservations[0]
    reservation_id = reservation["reservation_id"]
    related = [event for event in ledger_events if event.get("reservation_id") == reservation_id]
    finalizers = [
        event
        for event in related
        if event["event_type"]
        in {"settlement_posted", "reservation_released", "reservation_expired"}
    ]
    if len(finalizers) != 1:
        raise AssertionError("A reservation must have exactly one terminal finalization.")

    finalizer = finalizers[0]
    reserved_quantity = float(reservation["quantity"])
    if finalizer["event_type"] == "settlement_posted":
        settled_quantity = float(finalizer["quantity"])
        released_quantity = float(finalizer.get("released_quantity", 0))
        if not math.isclose(settled_quantity + released_quantity, reserved_quantity):
            raise AssertionError("v0.5 settlement must account for the full reservation.")
        if not math.isclose(
            settled_quantity, float(usage_event["billing"]["settled_quantity"])
        ):
            raise AssertionError("v0.5 usage and settlement quantities must match.")
        if usage_event["usage_event_id"] not in set(finalizer.get("usage_event_ids", [])):
            raise AssertionError("v0.5 settlement must reference the Usage Event.")


def canonical_provider_payload(event: dict[str, Any]) -> bytes:
    payload = copy.deepcopy(event)
    evidence = payload.get("evidence", {})
    evidence.pop("payload_digest", None)
    evidence.pop("signature", None)
    return json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")


def verify_provider_signature(event: dict[str, Any]) -> None:
    evidence = event["evidence"]
    if evidence["class"] != "provider_signed":
        return
    if evidence["signature_format"] != "JWS-HS256-test-only":
        return

    payload = canonical_provider_payload(event)
    expected_digest = "sha256:" + hashlib.sha256(payload).hexdigest()
    if not hmac.compare_digest(expected_digest, evidence["payload_digest"]):
        raise AssertionError("Provider evidence payload digest does not match.")

    expected_signature = base64.urlsafe_b64encode(
        hmac.new(TEST_HMAC_SECRET, payload, hashlib.sha256).digest()
    ).rstrip(b"=").decode("ascii")
    if not hmac.compare_digest(expected_signature, evidence["signature"]):
        raise AssertionError("Provider evidence test signature does not match.")


def verify_consent_digest(receipt: dict[str, Any]) -> None:
    payload = copy.deepcopy(receipt)
    payload["integrity"] = {}
    canonical = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    expected = "sha256:" + hashlib.sha256(canonical).hexdigest()
    if not hmac.compare_digest(expected, receipt["integrity"]["receipt_digest"]):
        raise AssertionError("Consent Receipt digest does not match.")


def validate_consent_binding(receipt: dict[str, Any], usage_event: dict[str, Any]) -> None:
    for field in ("delegation_id", "client_id", "beneficiary_ref", "consent_receipt_id"):
        receipt_field = "consent_receipt_id" if field == "consent_receipt_id" else field
        if receipt[receipt_field] != usage_event[field]:
            raise AssertionError(f"Consent Receipt is not bound to usage field {field}.")
    if receipt["funding_source_type"] != usage_event["billing"]["funding_source_type"]:
        raise AssertionError("Consent Receipt funding source does not match usage.")
    allowed_workloads = set(receipt.get("workload_scope", []))
    event_workload = usage_event.get("client_attribution", {}).get("workload_ref")
    if allowed_workloads and event_workload not in allowed_workloads:
        raise AssertionError("Usage workload is outside the Consent Receipt scope.")


def validate_ordering(events: list[dict[str, Any]]) -> None:
    event_ids = [event["usage_event_id"] for event in events]
    if len(event_ids) != len(set(event_ids)):
        raise AssertionError("usage_event_id values must be unique.")

    scopes: dict[tuple[str, str], list[dict[str, Any]]] = {}
    for event in events:
        scope_type = event["sequence_scope"]
        if scope_type == "reservation":
            scope_id = event.get("reservation_id")
        elif scope_type == "run":
            scope_id = event.get("run_id")
        elif scope_type == "request":
            scope_id = event.get("request_id")
        else:
            scope_id = event.get("attempt_id")
        if not scope_id:
            raise AssertionError(f"Missing identifier for sequence scope {scope_type}.")
        scopes.setdefault((scope_type, scope_id), []).append(event)

    for key, scoped_events in scopes.items():
        ordered = sorted(scoped_events, key=lambda event: event["sequence_number"])
        sequence_numbers = [event["sequence_number"] for event in ordered]
        if len(sequence_numbers) != len(set(sequence_numbers)):
            raise AssertionError(f"Duplicate sequence number within scope {key}.")
        for previous, current in zip(ordered, ordered[1:]):
            if current.get("previous_event_id") != previous["usage_event_id"]:
                raise AssertionError(
                    f"previous_event_id does not link adjacent events in scope {key}."
                )


def validate_reconciliation(
    reconciliation: dict[str, Any], source_event: dict[str, Any] | None = None
) -> None:
    expected = (
        float(reconciliation["provider_final_quantity"])
        - float(reconciliation["original_quantity"])
    )
    if not math.isclose(float(reconciliation["adjustment_quantity"]), expected):
        raise AssertionError("Reconciliation adjustment arithmetic is invalid.")

    if math.isclose(expected, 0):
        if reconciliation["action"] != "no_change":
            raise AssertionError("Zero variance must use no_change.")
    elif reconciliation["action"] not in {"adjustment_required", "dispute_opened"}:
        raise AssertionError("Non-zero variance requires an adjustment or dispute.")

    if source_event is not None:
        for field in ("delegation_id", "client_id", "request_id"):
            if reconciliation[field] != source_event[field]:
                raise AssertionError(f"Reconciliation does not match source {field}.")
        if reconciliation["source_usage_event_id"] != source_event["usage_event_id"]:
            raise AssertionError("Reconciliation does not reference the source Usage Event.")
        if reconciliation["funding_bucket_ref"] != source_event["billing"]["funding_bucket_ref"]:
            raise AssertionError("Reconciliation changed the funding bucket.")
        if reconciliation["unit_type"] != source_event["billing"]["unit_type"]:
            raise AssertionError("Reconciliation changed the unit type.")


def validate_duplicate_settlement_fixture(fixture: dict[str, Any]) -> None:
    settlements = fixture["settlements"]
    settlement_ids = [item["settlement_id"] for item in settlements]
    if len(settlement_ids) != len(set(settlement_ids)):
        raise AssertionError("Duplicate settlement identifier detected.")


def assert_rejected(label: str, function: Callable[[], None]) -> None:
    try:
        function()
    except AssertionError:
        return
    raise AssertionError(f"Invalid fixture was not rejected: {label}")


def main() -> int:
    v05_usage_schema = load_json(V05_USAGE_SCHEMA)
    v05_ledger_schema = load_json(V05_LEDGER_SCHEMA)
    v05_usage = load_json(V05_USAGE_EXAMPLE)
    v05_ledger = load_json(V05_LEDGER_EXAMPLE)
    validate_schema(v05_usage, v05_usage_schema, V05_USAGE_EXAMPLE.name)
    if not isinstance(v05_ledger, list):
        raise AssertionError("v0.5 ledger example must be an array.")
    for index, event in enumerate(v05_ledger):
        validate_schema(event, v05_ledger_schema, f"{V05_LEDGER_EXAMPLE.name}[{index}]")
    validate_v05_cross_event_invariants(v05_usage, v05_ledger)

    usage_schema = load_json(V06_USAGE_SCHEMA)
    consent_schema = load_json(V06_CONSENT_SCHEMA)
    recon_schema = load_json(V06_RECON_SCHEMA)
    gateway_event = load_json(V06_GATEWAY)
    provider_event = load_json(V06_PROVIDER)
    consent = load_json(V06_CONSENT)
    reconciliation = load_json(V06_RECON)

    validate_schema(gateway_event, usage_schema, V06_GATEWAY.name)
    validate_schema(provider_event, usage_schema, V06_PROVIDER.name)
    validate_schema(consent, consent_schema, V06_CONSENT.name)
    validate_schema(reconciliation, recon_schema, V06_RECON.name)

    verify_provider_signature(provider_event)
    verify_consent_digest(consent)
    validate_consent_binding(consent, gateway_event)
    validate_consent_binding(consent, provider_event)
    validate_ordering([gateway_event, provider_event])
    validate_reconciliation(reconciliation, gateway_event)

    assert_rejected(
        "replayed-event.json",
        lambda: validate_ordering(load_json(INVALID / "replayed-event.json")),
    )
    assert_rejected(
        "duplicate-settlement.json",
        lambda: validate_duplicate_settlement_fixture(
            load_json(INVALID / "duplicate-settlement.json")
        ),
    )
    bad_binding = load_json(INVALID / "unbound-consent-receipt.json")
    assert_rejected(
        "unbound-consent-receipt.json",
        lambda: validate_consent_binding(
            bad_binding["consent_receipt"], bad_binding["usage_event"]
        ),
    )
    assert_rejected(
        "event-order-conflict.json",
        lambda: validate_ordering(load_json(INVALID / "event-order-conflict.json")),
    )
    assert_rejected(
        "signature-mismatch.json",
        lambda: verify_provider_signature(load_json(INVALID / "signature-mismatch.json")),
    )
    assert_rejected(
        "late-usage-double-charge.json",
        lambda: validate_reconciliation(
            load_json(INVALID / "late-usage-double-charge.json")
        ),
    )

    print(
        "ABDS v0.5 and v0.6 schemas, examples, evidence, consent, "
        "ordering, reconciliation, and negative fixtures are valid."
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, json.JSONDecodeError, OSError) as exc:
        print(f"Validation failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
