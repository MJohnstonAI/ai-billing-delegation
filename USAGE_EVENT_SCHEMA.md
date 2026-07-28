# ABDS Usage Event Schema v0.6

> Concise interoperability guide for immutable usage evidence. The broader attribution rationale remains in `USAGE_ATTRIBUTION.md`.

## 1. Scope

A Usage Event describes one physical AI execution attempt. A logical request can produce several Usage Events because of retries, fallbacks, speculative calls, safety calls, tool calls, or route failover.

v0.6 adds three concepts to the v0.5 event model:

1. scoped event ordering;
2. explicit usage-evidence provenance; and
3. reconciliation state.

Usage Events remain technical records. Economic mutations remain Ledger Events.

## 2. Stable identifiers

Implementations MUST use stable identifiers instead of embedding full user, workspace, application, or Sponsor objects in every event.

Minimum correlation fields:

| Field | Purpose |
|---|---|
| `usage_event_id` | Unique immutable event identifier |
| `delegation_id` | Provider grant reference |
| `client_id` | Registered Client bound by the grant or credential |
| `beneficiary_ref` | Pairwise or opaque Beneficiary reference |
| `consent_receipt_id` | Receipt governing the execution |
| `request_id` | Logical Client request |
| `run_id` | Optional run-level or agent-run identifier |
| `attempt_id` | One physical execution attempt |
| `parent_attempt_id` | Retry, fallback, or nested-attempt parent |
| `reservation_id` | Run- or request-level reservation |
| `settlement_id` | Final economic settlement where exposed |
| `trace_id` / `span_id` | Optional distributed-tracing correlation |

The Provider MUST treat `client_id`, `delegation_id`, and credential-bound identity as authoritative. Client-supplied feature, workflow, workload, workspace, and agent labels are untrusted observability metadata.

## 3. Event ordering

Wall-clock timestamps alone do not establish order in a distributed system.

Each event MUST include:

```text
sequence_scope
sequence_number
```

`sequence_scope` is one of:

```text
reservation
run
request
attempt
```

`sequence_number` MUST be unique and monotonically increasing within the identified scope. `previous_event_id` SHOULD be included when the immediately preceding event is known.

ABDS does not require one global sequence across a Provider.

Relevant timestamps:

| Field | Meaning |
|---|---|
| `occurred_at` | When the represented execution occurred |
| `observed_at` | When a gateway or component observed the result |
| `provider_reported_at` | When Provider evidence became available |
| `received_at` | When the event store accepted the event |

Late arrival does not permit rewriting an earlier event.

## 4. Usage provenance

Implementations MUST distinguish the origin of a usage quantity:

```text
estimated
gateway_observed
provider_reported
provider_final
```

These values may coexist in `usage_measurements`. They MUST NOT be silently collapsed into one number.

- **Estimated** usage supports reservation and admission control.
- **Gateway-observed** usage records what an intermediary observed.
- **Provider-reported** usage records a Provider API response, usage export, or billing record.
- **Provider-final** usage is the quantity the Provider considers final for settlement or reconciliation.

Final economic settlement SHOULD use Provider-final evidence where available.

## 5. Evidence classes

The `evidence.class` field is one of:

| Class | Meaning | Authority |
|---|---|---|
| `provider_signed` | Provider evidence with cryptographic integrity | Authoritative provider-native target |
| `provider_reported` | Provider API, usage export, or billing record without an ABDS signature | Provider evidence requiring authenticated provenance |
| `gateway_attested` | Gateway observation or estimate | Provisional unless reconciled |

A gateway-attested event MUST NOT be represented as Provider-signed or Provider-final merely because the gateway called the Provider.

Provider-signed evidence SHOULD include:

```text
issuer
provider_request_id
provider_event_id
key_id
signature_format
payload_digest
signature
signed_at
```

Production signatures SHOULD use an asymmetric, rotation-capable signing profile. Test fixtures MAY use a local test-only algorithm.

## 6. Evidence status

`evidence.status` is one of:

```text
provisional
reported
reconciled
variance_detected
disputed
adjusted
final
```

Status describes the evidence state, not a mutable rewrite of the original event. A later state is represented by another event or a Reconciliation Event.

## 7. Reconciliation state

`reconciliation.status` is one of:

```text
not_required
pending
matched
variance_detected
adjusted
disputed
final
```

A late or corrected Provider quantity MUST create an append-only Reconciliation Event. Any monetary or resource correction MUST use a compensating Ledger Event.

## 8. Ordering and idempotency rules

1. `usage_event_id` MUST be globally unique within the issuing system.
2. One physical attempt MUST NOT produce duplicate accepted Usage Events with the same semantic identity.
3. At-least-once delivery is permitted; consumers MUST deduplicate.
4. Event sequence numbers MUST be unique within their scope.
5. A repeated event with the same identifier and same digest is idempotent.
6. A repeated identifier with different content is a conflict.
7. Settlement identifiers and idempotency keys remain governed by `RESERVATION_SETTLEMENT.md`.
8. A Reconciliation Event MUST reference the original Usage Event.
9. Corrections MUST NOT overwrite the original event.

## 9. Pricing snapshots and reservation state

A Usage Event MAY expose:

```text
estimated_quantity
reserved_quantity
settled_quantity
released_quantity
price_snapshot_id
amount
currency
```

The event MUST preserve the pricing snapshot applied at settlement time when a monetary amount is exposed.

Reservation state remains an economic Ledger concern. A Usage Event may reference `reservation_id`, but it cannot create, settle, release, or expire the reservation.

## 10. Privacy

Usage Events MUST NOT require prompts, outputs, files, raw identity, workspace names, customer names, payment credentials, or unrelated account balances.

Opaque references SHOULD be pairwise where correlation outside the intended trust boundary would create privacy risk.

## 11. Machine-readable schema

The v0.6 schema is:

```text
schemas/abds-usage-event-v0.6.schema.json
```

v0.5 remains available for implementations that do not yet support evidence provenance or reconciliation metadata.
