#!/usr/bin/env python3
"""Validate ABDS v0.5 examples against JSON Schemas and core invariants."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

try:
    from jsonschema import Draft202012Validator, FormatChecker
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: install jsonschema with `python -m pip install jsonschema`."
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
USAGE_SCHEMA = ROOT / "schemas" / "abds-usage-event-v0.5.schema.json"
LEDGER_SCHEMA = ROOT / "schemas" / "abds-ledger-event-v0.5.schema.json"
USAGE_EXAMPLE = ROOT / "examples" / "usage-event-agent-fallback.json"
LEDGER_EXAMPLE = ROOT / "examples" / "reservation-settlement-sequence.json"


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


def validate_cross_event_invariants(
    usage_event: dict[str, Any], ledger_events: list[dict[str, Any]]
) -> None:
    if not ledger_events:
        raise AssertionError("Ledger sequence must contain at least one event.")

    delegation_ids = {event["delegation_id"] for event in ledger_events}
    request_ids = {event["request_id"] for event in ledger_events}
    funding_buckets = {event["funding_bucket_ref"] for event in ledger_events}
    unit_types = {event["unit_type"] for event in ledger_events}

    if delegation_ids != {usage_event["delegation_id"]}:
        raise AssertionError("Usage and ledger events must share one delegation_id.")
    if request_ids != {usage_event["request_id"]}:
        raise AssertionError("Usage and ledger events must share one logical request_id.")
    if funding_buckets != {usage_event["billing"]["funding_bucket_ref"]}:
        raise AssertionError("Reservation and settlement must use the usage event funding bucket.")
    if unit_types != {usage_event["billing"]["unit_type"]}:
        raise AssertionError("Usage and ledger events must use one unit_type.")

    event_ids = [event["ledger_event_id"] for event in ledger_events]
    if len(event_ids) != len(set(event_ids)):
        raise AssertionError("ledger_event_id values must be unique.")

    settlement_ids = [
        event["settlement_id"]
        for event in ledger_events
        if event.get("event_type") == "settlement_posted"
    ]
    if len(settlement_ids) != len(set(settlement_ids)):
        raise AssertionError("settlement_id values must be unique.")

    reservations = [
        event for event in ledger_events if event["event_type"] == "reservation_created"
    ]
    if len(reservations) != 1:
        raise AssertionError("Worked sequence must create exactly one reservation.")

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
        if settled_quantity + released_quantity != reserved_quantity:
            raise AssertionError(
                "Worked settlement must account for the full reservation as settled plus released."
            )
        if settled_quantity != float(usage_event["billing"]["settled_quantity"]):
            raise AssertionError("Usage billing settled_quantity must match ledger settlement.")
        if usage_event["usage_event_id"] not in set(finalizer.get("usage_event_ids", [])):
            raise AssertionError("Settlement must reference the worked Usage Event.")
    elif float(finalizer["quantity"]) != reserved_quantity:
        raise AssertionError("A full release or expiry must account for the reservation quantity.")


def main() -> int:
    usage_schema = load_json(USAGE_SCHEMA)
    ledger_schema = load_json(LEDGER_SCHEMA)
    usage_event = load_json(USAGE_EXAMPLE)
    ledger_events = load_json(LEDGER_EXAMPLE)

    validate_schema(usage_event, usage_schema, USAGE_EXAMPLE.name)
    if not isinstance(ledger_events, list):
        raise AssertionError("Ledger example must be a JSON array.")
    for index, event in enumerate(ledger_events):
        validate_schema(event, ledger_schema, f"{LEDGER_EXAMPLE.name}[{index}]")

    validate_cross_event_invariants(usage_event, ledger_events)
    print("ABDS v0.5 schemas, examples, and cross-event invariants are valid.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, json.JSONDecodeError, OSError) as exc:
        print(f"Validation failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
