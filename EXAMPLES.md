# ABDS v0.5 Examples and Test Vectors

This document indexes the current provider-neutral examples. Machine-readable files under `examples/` are intended for schema validation and future conformance tests.

All domains, identifiers, models, tokens, units, amounts, and funding offers are fictional. They are not evidence that any AI Provider implements ABDS.

## 1. Usage Event With Retry and Fallback

File: [`examples/usage-event-agent-fallback.json`](examples/usage-event-agent-fallback.json)

Demonstrates:

- one physical attempt under a logical request;
- `requested_model` versus `resolved_model`;
- fallback routing and retry reason;
- token and tool-call dimensions;
- Sponsor funding-bucket attribution;
- pricing snapshot;
- opaque workspace, feature, workflow, agent-run, and agent-step references;
- trace and span correlation.

Validate against:

```text
schemas/abds-usage-event-v0.5.schema.json
```

## 2. Reservation, Settlement, and Release Sequence

File: [`examples/reservation-settlement-sequence.json`](examples/reservation-settlement-sequence.json)

Demonstrates:

1. a five-unit reservation;
2. a three-unit settlement linked to the Usage Event;
3. release of the unused two units;
4. stable request, reservation, settlement, and idempotency identifiers;
5. one consistent Sponsor funding bucket and price snapshot.

Each array member validates against:

```text
schemas/abds-ledger-event-v0.5.schema.json
```

## 3. Logical Request With Several Physical Attempts

```text
req_88
  att_88_1 - primary model timeout after partial inference
  att_88_2 - retry or fallback attempt
  att_88_3 - final successful route
```

Every billable physical attempt produces a separate Usage Event. One idempotent settlement may reference all billable events associated with the logical request and reservation.

## 4. Direct Debit Without Reservation

A predictable low-cost operation may be directly debited when Provider policy permits it. It still requires:

- Provider-measured usage;
- a Usage Event;
- a Ledger Event;
- one funding bucket;
- idempotent economic processing;
- no silent payer substitution.

## 5. Adjustment Instead of Historical Rewrite

When a Provider corrects a charge, the original event remains unchanged. A new `adjustment_posted` Ledger Event references the prior event, reason, actor, and positive or negative quantity.

## 6. Negative Test Cases for Future Conformance Suite

Implementations should reject or flag:

- missing `delegation_id`, `request_id`, or `attempt_id`;
- duplicate settlement identifiers;
- one reservation reaching two terminal states;
- settlement against a different funding bucket from the reservation;
- `settled_quantity` exceeding the authorized envelope without overage consent;
- Client attribution containing prompt text, secrets, emails, or customer names;
- a fallback model outside the approved model scope;
- a second payer selected after funding exhaustion without authorization;
- an adjustment that does not reference an earlier ledger event;
- event retrieval across another grant.

## 7. Validation Requirements

A repository validation script should perform JSON Schema Draft 2020-12 validation and then enforce cross-event invariants that JSON Schema alone cannot express, including terminal-state uniqueness, settlement idempotency, funding-bucket consistency, and reservation arithmetic.
