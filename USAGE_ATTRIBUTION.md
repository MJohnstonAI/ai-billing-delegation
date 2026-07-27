# ABDS Usage Attribution and Accounting Events

> Draft v0.5 profile for tracing provider-enforced AI consumption from a funding grant to the product behavior that caused it.

## 1. Purpose

The AI Billing Delegation Standard (ABDS) needs more than a grant balance. Providers and application teams must be able to answer, without guessing from an invoice:

- which Delegated AI Grant funded a call,
- which application and Beneficiary caused it,
- which logical request, workflow, agent run, and agent step produced it,
- which provider route and model actually executed,
- which resource dimensions were consumed,
- whether the call was retried, routed, cached, partially completed, or cancelled,
- which reservation and settlement entries accounted for it, and
- which party was charged.

This document defines an append-only usage-event model and a privacy-preserving cost-attribution model.

## 2. Two-Plane Design

ABDS separates two related but different data planes.

### 2.1 Provider Accounting Plane

The Provider Accounting Plane is authoritative for enforcement and settlement. It contains only the data required to:

- bind usage to a `delegation_id`,
- enforce grant and funding limits,
- reserve and settle resource units,
- prevent double settlement,
- support audit, dispute, and revocation workflows, and
- produce grant-specific usage views.

The Provider MUST NOT rely on Client-supplied product labels for authorization or billing enforcement.

### 2.2 Client Observability Plane

The Client Observability Plane explains product behavior. It may contain opaque references for:

- workspace,
- feature,
- workflow,
- agent run,
- agent step,
- experiment, and
- trace or span.

These references are optional and are not trusted for provider enforcement. They exist so the Client can correlate provider-authoritative usage with its own telemetry.

A Provider MUST NOT require human-readable feature names, workspace names, prompts, outputs, or internal business identifiers when opaque correlation references are sufficient.

## 3. Attribution Hierarchy

A recommended hierarchy is:

```text
Funding Source
  -> Delegated AI Grant
    -> Client
      -> Beneficiary or Workspace
        -> Logical Request
          -> Workflow / Feature
            -> Agent Run
              -> Agent Step
                -> Physical Model Attempt
```

One logical request MAY produce several physical model attempts because of:

- retries,
- fallback routing,
- speculative execution,
- ensemble execution,
- safety or moderation calls,
- tool-selection calls,
- cache misses, or
- provider failover.

Each billable physical attempt MUST be attributable separately. A successful logical request MUST NOT hide the cost of failed or superseded attempts.

## 4. Event Types

ABDS v0.5 defines two event families.

### 4.1 AI Call Usage Event

One immutable event is emitted for each physical AI model attempt that reaches a Provider execution path.

Recommended event name:

```text
abds.ai_call_usage
```

### 4.2 Ledger Event

Ledger events record economic state transitions independently of model telemetry.

Recommended event names:

```text
abds.reservation.created
abds.reservation.released
abds.reservation.expired
abds.settlement.posted
abds.adjustment.posted
abds.execution.denied
```

A model attempt and its ledger mutations are correlated by `request_id`, `attempt_id`, `reservation_id`, and `usage_event_id`.

## 5. AI Call Usage Event Schema

### 5.1 Required Core Fields

| Field | Type | Description |
|---|---|---|
| `schema_version` | string | ABDS usage schema version, for example `0.5` |
| `usage_event_id` | string | Globally unique immutable event identifier |
| `occurred_at` | ISO 8601 | Provider-recorded event time |
| `delegation_id` | string | Public ABDS grant reference |
| `client_id` | string | Registered Consumer Application identifier |
| `request_id` | string | Logical request identifier |
| `attempt_id` | string | Physical execution-attempt identifier |
| `operation` | string | Provider-defined operation class |
| `provider` | string | Provider that executed or brokered the attempt |
| `resolved_model` | string | Actual model or model class used |
| `outcome` | enum | Outcome from Section 5.5 |
| `usage_dimensions` | array | Resource quantities from Section 5.6 |
| `billing` | object | Billing attribution from Section 5.7 |

### 5.2 Grant and Funding References

| Field | Required | Description |
|---|---:|---|
| `delegation_id` | Yes | Public grant reference |
| `funding_source_type` | Yes | `user_entitlement`, `organization_budget`, `sponsor_budget`, `provider_promotion`, or `developer_account` |
| `funding_bucket_ref` | Yes | Opaque Provider reference to the charged bucket |
| `beneficiary_ref` | Provider policy | Pairwise-pseudonymous Beneficiary reference |
| `sponsorship_program_id` | When applicable | Public program reference |

`funding_bucket_ref` MUST NOT be a bearer credential and SHOULD NOT reveal account, payment, or Sponsor-pool identifiers.

### 5.3 Request and Attempt Correlation

| Field | Required | Description |
|---|---:|---|
| `request_id` | Yes | Stable identifier for the logical Client request |
| `attempt_id` | Yes | Identifier for one physical attempt |
| `parent_attempt_id` | No | Parent attempt for subcalls or agent steps |
| `reservation_id` | When reserved | Reservation that bounded this attempt |
| `idempotency_key` | Recommended | Replay-safe request key |
| `trace_id` | No | Trace correlation identifier |
| `span_id` | No | Span correlation identifier |
| `causation_id` | No | Event or request that caused this attempt |
| `correlation_id` | No | Broader workflow correlation identifier |

The Provider MUST treat `attempt_id` and settlement identifiers as idempotency boundaries. Replayed requests MUST NOT produce duplicate billable settlement.

### 5.4 Model Routing and Compatibility

| Field | Required | Description |
|---|---:|---|
| `requested_model` | No | Model or alias requested by the Client |
| `resolved_model` | Yes | Actual model selected by the Provider or router |
| `model_revision` | No | Immutable revision or snapshot where available |
| `route_provider` | No | Upstream Provider when a broker or gateway routes the call |
| `routing_reason` | No | Coarse reason such as `primary`, `fallback`, `policy`, or `capacity` |
| `retry_count` | Recommended | Zero-based retry count for the logical request |
| `retry_reason` | No | Coarse failure or policy reason |
| `response_shape` | No | Compatibility profile such as `openai_chat_completions` |

Requested and resolved model identifiers MUST be separate. A model alias can change over time, and a router can execute a different model from the one named by the Client.

### 5.5 Outcome Taxonomy

Allowed initial values:

```text
completed
completed_partial
cancelled
failed_before_inference
failed_after_partial_inference
timed_out
denied
superseded
```

`failed_before_inference` SHOULD normally have zero billable model usage, although Provider-defined non-model charges may still exist. `failed_after_partial_inference` and `completed_partial` MUST report actual consumed dimensions.

### 5.6 Extensible Usage Dimensions

AI usage is not limited to text tokens. The event uses an extensible array:

```json
"usage_dimensions": [
  {"type": "input_tokens", "quantity": 1250, "unit": "token"},
  {"type": "output_tokens", "quantity": 310, "unit": "token"},
  {"type": "cached_input_tokens", "quantity": 800, "unit": "token"},
  {"type": "reasoning_tokens", "quantity": 95, "unit": "token"},
  {"type": "image_input", "quantity": 1, "unit": "image"},
  {"type": "tool_calls", "quantity": 2, "unit": "call"}
]
```

Providers MAY define additional dimensions for audio, video, embeddings, storage, search, computer use, batch work, or future modalities.

A Provider MUST publish the meaning and unit of every billable dimension it exposes.

### 5.7 Billing Attribution

The `billing` object separates resource accounting from money:

```json
"billing": {
  "unit_type": "provider_ai_unit",
  "reserved_quantity": 5,
  "settled_quantity": 3,
  "funding_source_type": "sponsor_budget",
  "funding_bucket_ref": "bucket_pairwise_7f2",
  "price_snapshot_id": "price_2026_07_standard_text",
  "amount": {
    "value": "0.0048",
    "currency": "USD"
  }
}
```

Requirements:

- `settled_quantity` is Provider-authoritative.
- Monetary `amount` is OPTIONAL because ABDS is not a payment rail and some grants use non-monetary resource units.
- If `amount` is present, the Provider MUST include a currency and immutable pricing reference.
- Historical events MUST NOT be repriced when current prices change.
- Internal upstream cost and the amount charged to the Funding Principal are different concepts and MUST NOT be conflated.

### 5.8 Optional Client Attribution

```json
"client_attribution": {
  "workspace_ref": "ws_pseudo_42",
  "feature_ref": "feature_7",
  "workflow_ref": "workflow_19",
  "agent_run_ref": "run_abc",
  "agent_step_ref": "step_04",
  "experiment_ref": "exp_b"
}
```

Rules:

- Values SHOULD be opaque and pairwise where practical.
- Values MUST NOT contain email addresses, prompt text, filenames, customer names, or secrets.
- The Provider MUST treat these fields as untrusted metadata.
- The Client SHOULD retain the human-readable mapping locally.
- Sponsor reporting MUST NOT expose these fields unless separately authorized and privacy-safe.

## 6. Illustrative Event

```json
{
  "schema_version": "0.5",
  "usage_event_id": "uev_01JZ8Q8V7Y5K",
  "occurred_at": "2026-07-27T09:15:32.184Z",
  "delegation_id": "del_abc123",
  "client_id": "app_natureguard",
  "beneficiary_ref": "ben_pairwise_91",
  "request_id": "req_88",
  "attempt_id": "att_88_2",
  "parent_attempt_id": "att_88_1",
  "reservation_id": "res_88",
  "idempotency_key": "idem_6f91",
  "operation": "ai.generate.text",
  "provider": "provider.example",
  "requested_model": "economy-text",
  "resolved_model": "economy-text-2026-07-15",
  "routing_reason": "fallback",
  "retry_count": 1,
  "retry_reason": "upstream_timeout",
  "outcome": "completed",
  "latency_ms": 1840,
  "usage_dimensions": [
    {"type": "input_tokens", "quantity": 1250, "unit": "token"},
    {"type": "output_tokens", "quantity": 310, "unit": "token"}
  ],
  "billing": {
    "unit_type": "provider_ai_unit",
    "reserved_quantity": 5,
    "settled_quantity": 3,
    "funding_source_type": "sponsor_budget",
    "funding_bucket_ref": "bucket_pairwise_7f2",
    "price_snapshot_id": "price_2026_07_standard_text",
    "amount": {"value": "0.0048", "currency": "USD"}
  },
  "client_attribution": {
    "workspace_ref": "ws_pseudo_42",
    "feature_ref": "feature_report_draft",
    "workflow_ref": "workflow_incident_triage",
    "agent_run_ref": "run_abc",
    "agent_step_ref": "step_04"
  }
}
```

## 7. Append-Only and Correction Semantics

Usage and ledger events MUST be immutable after acceptance.

Corrections MUST use a compensating `abds.adjustment.posted` event that:

- references the original event,
- states the adjustment reason,
- records positive or negative quantity changes,
- identifies the actor or automated policy that issued it, and
- preserves the original event for audit.

Deleting or rewriting historical billable events breaks reconciliation and is not permitted except where law requires erasure. Providers SHOULD use cryptographic deletion or separated identity mappings where privacy law requires subject erasure while accounting records must be retained.

## 8. Accounting Invariants

An implementation MUST preserve these invariants:

1. Every settled billable quantity maps to exactly one `delegation_id` and funding bucket at settlement time.
2. A settlement identifier can be accepted at most once.
3. A reservation reaches one terminal state: settled, released, or expired.
4. Total active reservations plus settled usage cannot exceed the authorized envelope unless an explicit overage policy was authorized.
5. Failed retries and fallback attempts are recorded rather than hidden inside the final successful request.
6. A funding-source failure cannot silently move an event to another payer.
7. Ledger balance is derived from immutable events or an equivalent auditable transaction log.
8. Monetary amounts, when present, retain the pricing snapshot used at settlement time.
9. Client attribution metadata cannot change the billed quantity or funding source.
10. Sponsor reports cannot reveal Client metadata beyond the reporting policy authorized for the program.

## 9. Event Retrieval and Delivery

Providers SHOULD support at least one of:

- paginated grant-specific event retrieval,
- signed webhook delivery,
- asynchronous export, or
- provider console download.

At-least-once delivery is acceptable. Consumers MUST deduplicate using `usage_event_id`.

Webhooks SHOULD include replay protection, signature verification, delivery identifiers, and a bounded retry policy. Event retrieval MUST prevent cross-grant enumeration.

## 10. OpenTelemetry Compatibility

ABDS accounting events are not a replacement for distributed tracing.

Implementations SHOULD make it possible to correlate ABDS events with OpenTelemetry traces and emerging Generative AI semantic conventions through `trace_id`, `span_id`, provider/model attributes, token usage, and operation duration.

OpenTelemetry mapping is informative rather than normative because Generative AI semantic conventions continue to evolve. Prompt and response content MUST remain opt-in and is not required by ABDS.

## 11. Privacy and Retention

Providers and Clients MUST apply data minimization.

ABDS usage events MUST NOT require:

- prompt or output content,
- raw user identity,
- workspace names,
- filenames,
- customer names,
- payment-card data,
- unrelated Provider-account usage, or
- Sponsor-confidential pool balances.

Retention periods SHOULD distinguish:

- security and fraud evidence,
- accounting and dispute records,
- product telemetry, and
- optional debugging content.

These categories SHOULD NOT automatically share the same retention period.

## 12. Relationship to Reservation and Settlement

See `RESERVATION_SETTLEMENT.md` for the ledger state machine, idempotency rules, partial completion, cancellation, and settlement invariants.

Machine-readable examples are provided under `schemas/` and `examples/`.

## 13. Open Questions

1. Which event fields belong in a future required interoperability core?
2. Should Providers expose monetary amounts or only resource units?
3. Should signed usage receipts be a Standard or Advanced capability?
4. Which Client attribution fields should be echoed by Providers?
5. How should privacy-preserving aggregation work for small Sponsor cohorts?
6. Should Transaction Tokens be used inside a Provider trust domain to propagate delegation context across internal services?
7. Should ABDS register an OpenTelemetry mapping after the relevant Generative AI conventions stabilize?
