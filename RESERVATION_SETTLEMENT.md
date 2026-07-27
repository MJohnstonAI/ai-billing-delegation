# ABDS Reservation and Settlement Profile

> Draft v0.5 profile for bounded execution, streaming, agentic workflows, retries, cancellation, and final accounting.

## 1. Purpose

AI operations can have variable cost. A provider may not know the final resource consumption until after streaming output, multimodal processing, tool calls, retries, or an agentic workflow completes.

ABDS therefore separates authorization from execution accounting:

```text
Authorize -> Estimate -> Reserve -> Execute -> Settle -> Release
```

The Provider remains authoritative at every stage.

## 2. Core Objects

### 2.1 Execution Envelope

The maximum resources an operation may consume under the grant.

The envelope is derived from:

- grant cap,
- remaining grant balance,
- funding-source availability,
- per-request cap,
- model and operation scope,
- Client risk policy,
- agent-step or tool-call limits, and
- Provider policy.

### 2.2 Reservation

A temporary hold against a grant and funding bucket.

Recommended fields:

| Field | Description |
|---|---|
| `reservation_id` | Unique immutable identifier |
| `delegation_id` | Bound grant reference |
| `request_id` | Logical request identifier |
| `client_id` | Bound Client |
| `funding_bucket_ref` | Opaque charged bucket |
| `unit_type` | Provider-defined resource unit |
| `reserved_quantity` | Maximum held quantity |
| `status` | `active`, `settled`, `released`, or `expired` |
| `created_at` | Creation time |
| `expires_at` | Reservation expiry |
| `idempotency_key` | Replay-safe creation key |

### 2.3 Settlement

The final Provider-authoritative debit for consumed resources.

A settlement references:

- one reservation where reservation was required,
- one or more usage events,
- the grant and funding bucket,
- the settled quantity,
- optional monetary amount and pricing snapshot, and
- a unique settlement identifier.

### 2.4 Release

A release returns unused reserved capacity.

A release is a ledger event, not deletion of the reservation.

## 3. Reservation State Machine

```text
                 +-----------+
                 |  active   |
                 +-----------+
                   /    |    \
                  /     |     \
             settle  release  expire
                /       |       \
       +---------+ +---------+ +---------+
       | settled | | released| | expired |
       +---------+ +---------+ +---------+
```

Terminal states are immutable.

A reservation MUST reach at most one terminal state. Repeated terminal requests with the same idempotency key MUST return the original result rather than create a second ledger mutation.

## 4. Reservation Request

Illustrative request:

```json
{
  "delegation_id": "del_abc123",
  "request_id": "req_88",
  "operation": "ai.generate.text",
  "requested_model": "economy-text",
  "maximum": {
    "quantity": 5,
    "unit_type": "provider_ai_unit"
  },
  "execution_limits": {
    "max_output_tokens": 1200,
    "max_tool_calls": 4,
    "max_agent_steps": 8,
    "deadline_ms": 30000
  },
  "idempotency_key": "idem_res_req_88"
}
```

Illustrative response:

```json
{
  "reservation_id": "res_88",
  "delegation_id": "del_abc123",
  "request_id": "req_88",
  "reserved_quantity": 5,
  "unit_type": "provider_ai_unit",
  "status": "active",
  "expires_at": "2026-07-27T09:16:30Z"
}
```

## 5. Provider Evaluation

Before creating a reservation, the Provider MUST:

1. authenticate the Client and validate the Execution Token;
2. resolve `delegation_id`;
3. validate grant, Beneficiary, model, operation, and funding-source status;
4. enforce the per-request cap and any agentic limits;
5. account for already settled usage and active reservations;
6. verify that the request will not cause silent payer substitution;
7. create the reservation atomically; and
8. return a stable `reservation_id`.

A Client estimate is advisory. The Provider MAY lower or reject the requested envelope.

## 6. Execution Rules

During execution:

- the Provider MUST prevent the operation from exceeding its authorized envelope;
- the Provider MUST record each physical model attempt separately;
- retries and fallback routes MUST remain attributable;
- the Provider MAY terminate streaming or agent execution when the envelope is exhausted;
- partial output MAY be returned when policy permits; and
- usage MUST be measured using Provider-authoritative dimensions.

The Client MUST NOT assume that reservation guarantees successful execution. Capacity, safety, policy, or model availability may still cause failure.

## 7. Settlement

Illustrative settlement:

```json
{
  "settlement_id": "set_88",
  "reservation_id": "res_88",
  "delegation_id": "del_abc123",
  "request_id": "req_88",
  "usage_event_ids": ["uev_01JZ8Q8V7Y5K"],
  "settled_quantity": 3,
  "released_quantity": 2,
  "unit_type": "provider_ai_unit",
  "price_snapshot_id": "price_2026_07_standard_text",
  "amount": {
    "value": "0.0048",
    "currency": "USD"
  },
  "outcome": "completed",
  "idempotency_key": "idem_set_req_88",
  "settled_at": "2026-07-27T09:15:34Z"
}
```

Requirements:

- `settled_quantity` MUST be based on Provider-measured usage.
- `settled_quantity` MUST NOT exceed `reserved_quantity` unless the grant explicitly authorized an overrun policy and the user-facing consent disclosed it.
- Unused quantity MUST be released.
- Settlement MUST be idempotent.
- Settlement MUST preserve the pricing snapshot used at execution time.
- Settlement MUST retain links to all billable physical attempts.

## 8. No-Reservation Operations

A Provider MAY debit directly without reservation when:

- the operation has a predictable and small maximum cost,
- the grant has sufficient headroom,
- Provider policy permits direct debit, and
- atomic enforcement is still preserved.

Direct-debit operations MUST still emit usage and ledger events.

## 9. Streaming

For streaming responses, the Provider SHOULD:

1. reserve an upper bound before output begins;
2. meter usage during generation;
3. stop generation before exceeding the envelope;
4. emit actual usage for partial output;
5. settle on normal completion, cancellation, timeout, or Provider failure; and
6. release unused capacity promptly.

A Client disconnect MUST NOT automatically imply zero usage. The Provider settles resources already consumed.

## 10. Agentic Workflows

Agentic operations introduce nested and potentially recursive consumption.

Providers SHOULD support hierarchical budgets:

```text
Grant cap
  -> logical request envelope
    -> agent run envelope
      -> agent step envelope
        -> model attempt or tool-call envelope
```

Recommended controls:

- maximum agent steps,
- maximum tool calls,
- maximum recursion depth,
- maximum wall-clock duration,
- per-step model policy,
- per-step reservation,
- cumulative request budget,
- cancellation propagation, and
- circuit breakers for retry or loop amplification.

A child step MUST NOT reserve beyond the unused parent envelope.

## 11. Retries, Fallback, and Speculative Execution

A logical request may create multiple attempts.

Rules:

- every attempt receives a unique `attempt_id`;
- all attempts share the logical `request_id`;
- retries record `retry_count` and coarse `retry_reason`;
- requested and resolved models remain separate;
- speculative attempts are recorded even when superseded;
- only Provider-policy-defined usage is billable;
- settlement references all billable usage events; and
- duplicate Client retries using the same idempotency key MUST NOT create duplicate logical charges.

Providers SHOULD disclose whether failed, superseded, or speculative attempts can be billable.

## 12. Cancellation and Partial Completion

Cancellation may originate from:

- the Resource User,
- the Client,
- the Provider,
- grant revocation,
- funding exhaustion,
- safety policy,
- timeout, or
- Sponsor program suspension.

The Provider MUST:

- stop future work as soon as practical,
- settle resources already consumed,
- release unused reserved capacity,
- record the cancellation source and outcome, and
- avoid silently switching to another funding source.

## 13. Provider Failure

Provider failures MUST have documented accounting behavior.

At minimum:

- failure before inference SHOULD release the full reservation;
- failure after partial inference MUST record measured usage;
- uncertain settlement MUST enter a recoverable reconciliation state rather than be silently charged twice;
- repeated settlement calls MUST be idempotent; and
- later corrections MUST use compensating adjustment events.

## 14. Expiry

Reservation expiry prevents stale holds from locking a grant indefinitely.

Providers MUST define:

- default and maximum reservation lifetime,
- whether execution may continue after reservation expiry,
- automatic release timing,
- behavior for delayed batch jobs, and
- reconciliation when completion arrives after expiry.

Long-running batch operations SHOULD use renewable reservations or staged reservations rather than one unbounded hold.

## 15. Accounting Invariants

The following invariants are normative:

1. `settled + active_reserved <= authorized_cap`, except for explicitly authorized overage.
2. One reservation has one terminal state.
3. One settlement identifier is posted at most once.
4. One idempotency key resolves to one semantic operation within its scope.
5. Released quantity cannot later be settled without a new reservation.
6. Every billable attempt maps to one funding bucket at settlement time.
7. Funding-source failure cannot silently shift cost.
8. Adjustments reference prior immutable events.
9. Client telemetry cannot alter Provider-measured usage.
10. Aggregate ledger state is reproducible from an append-only transaction log or equivalent auditable mechanism.

## 16. Error Codes

| Code | HTTP | Meaning |
|---|---:|---|
| `abds_reservation_required` | 409 | Operation requires a reservation |
| `abds_reservation_denied` | 429 | Requested envelope cannot be reserved |
| `abds_reservation_expired` | 409 | Reservation is no longer active |
| `abds_reservation_conflict` | 409 | Idempotency key conflicts with a different request |
| `abds_execution_envelope_exhausted` | 429 | Execution reached its authorized limit |
| `abds_settlement_conflict` | 409 | Settlement conflicts with an existing terminal record |
| `abds_reconciliation_pending` | 202 | Final settlement is not yet available |

Errors MUST NOT expose unrelated balances, funding-source identifiers, internal pricing, or risk signals.

## 17. Eventual Consistency and Reconciliation

Providers MAY use distributed ledgers or asynchronously replicated systems, but enforcement MUST provide an equivalent protection against overspend.

A Provider SHOULD distinguish:

- authorization-time balance,
- reserved balance,
- settled balance,
- pending reconciliation, and
- available balance.

User-facing balances may be point-in-time views. Execution-time enforcement remains authoritative.

## 18. Relationship to Usage Attribution

Every physical model attempt SHOULD emit an `abds.ai_call_usage` event as defined in `USAGE_ATTRIBUTION.md`.

Every reservation, settlement, release, denial, expiry, and adjustment SHOULD emit an immutable ledger event.

Machine-readable schemas are provided under `schemas/`.

## 19. Open Questions

1. Should reservation be mandatory for all streaming requests or only above Provider-defined risk thresholds?
2. How should batch operations renew reservations without starving interactive traffic?
3. Should signed settlement receipts be a Standard or Advanced capability?
4. Which failed or speculative attempts should be billable?
5. How should Providers expose pending reconciliation without weakening enforcement?
6. Should agent-step reservations be Provider-native or Client-managed under a single request envelope?
