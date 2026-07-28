# ABDS Threat Model v0.6

> OAuth, economic-abuse, attribution, evidence, consent, reconciliation, routing, and Sponsor-risk model.

## Assumptions

- The Provider is authoritative for grant policy, measurement, reservation, and settlement.
- Execution Tokens reference `delegation_id`; mutable economic state is not trusted from the Client.
- Resource User, Beneficiary, Funding Principal, and Economic Authorizer may differ.
- Sponsor funding does not imply content or identity access.
- Client workload and attribution labels are untrusted observability metadata.
- Usage, Consent, Reconciliation, and Ledger Events are append-only.
- Gateway evidence may be honest, incorrect, incomplete, compromised, or malicious.
- Provider signing keys and evidence pipelines can fail or be compromised.
- Applications may generate traffic beyond direct user actions through retries, routing, background work, or agent loops.

## Threat Matrix

| Threat | Attack path | Impact | Required mitigation |
|---|---|---|---|
| Quota laundering | Client aggregates grants and resells access | Provider abuse and trust loss | Client registration, caps, anomaly detection, revocation |
| Consent phishing | Misleading Client requests economic authorization | Unauthorized usage | Verified Client, Provider-controlled consent, Consent Receipt |
| Consent Receipt substitution | Receipt from another grant or policy is presented | Unauthorized ceiling, scope, or payer | Bind receipt to grant, Client, Beneficiary, policy version, and digest |
| Receipt rewrite | Approved terms are modified later | Audit and dispute failure | Immutable versioned receipt and integrity evidence |
| Token replay | Stolen token is reused | Unauthorized consumption | Short expiry, audience and Client binding, unique `jti`, replay controls, sender constraint |
| Weak backend proxy | Unauthenticated application endpoint exposes grant | Rapid quota drain | Session binding, rate limits, Provider caps |
| Workload laundering | Client uses grant for unrelated background work | Hidden cost and consent bypass | Enforceable workload scope and dual Client/Beneficiary attribution |
| User blame shifting | Application-generated retries appear as user traffic | Incorrect accountability | Preserve registered Client and workload attribution |
| Model-tier laundering | Low-cost consent reaches high-cost model | Revenue and policy loss | Provider-side scope; requested/resolved model logging |
| Prompt-injection drain | Input expands agent work | Quota depletion | Run, step, tool, wall-clock, and cumulative limits |
| Recursive agent loop | Agent repeatedly invokes models or tools | Unbounded usage | Circuit breakers and hierarchical budgets |
| Ledger race | Concurrent calls exceed cap | Economic overrun | Atomic reservation or equivalent serializable enforcement |
| Duplicate settlement | Retried operation charges twice | Double charge | Settlement ID and idempotency |
| Reservation replay | Multiple holds are created | False exhaustion | Scoped idempotency and semantic conflict detection |
| Forged gateway evidence | Gateway claims usage not reported by Provider | False charge or misleading audit | Mark gateway evidence provisional; reconcile against Provider records |
| Gateway omission | Gateway hides failed attempts | Under-reporting | Provider request IDs, Provider reports, event completeness checks |
| Fake Provider receipt | Attacker fabricates signed evidence | False authoritative usage | Issuer trust, signature verification, key discovery |
| Signature replay | Valid signed event is reused | Duplicate accounting | Unique event ID, digest, sequence, replay cache |
| Signing-key compromise | Attacker signs false Provider evidence | Systemic fraud | Rotation, revocation, incident handling, key provenance |
| Event reordering | Late or reordered events change interpretation | Wrong settlement or audit | Scoped sequence numbers and predecessor links |
| Event identifier collision | Same ID carries different content | Integrity failure | Digest comparison and conflict rejection |
| Batch-proof omission | Event claimed in signed batch without proof | False evidence | Verify inclusion proof and signed manifest |
| Provider-report duplication | Same Provider record is ingested twice | Duplicate adjustment | Provider event or billing ID deduplication |
| Reconciliation arithmetic abuse | Adjustment exceeds real variance | Double charge | Reproducible arithmetic and invariant validation |
| Late-usage double charge | Late report settles again instead of adjusting | Double charge | Reconciliation Event plus one compensating adjustment |
| Unmatched Provider charge | Invoice has no mapped Usage Event | Unexplained cost | Investigation state; no silent second charge |
| Billing-bucket substitution | Reconciliation changes funding bucket | Wrong payer | Preserve original reservation and funding bucket |
| Silent payer fallback | Funding failure charges another party | Unexpected harm | Hard stop, authorized alternative, or fresh consent |
| Price rewrite | Old usage is repriced | Dispute and audit failure | Immutable price snapshot |
| Sponsor impersonation | Client claims a known Sponsor pays | Consent fraud | Provider-verified Sponsor |
| Sponsor surveillance | Funding used to demand user data | Privacy and coercion | Aggregate reporting and separate data authorization |
| Revocation delay | Calls continue after revocation | Unauthorized usage | Immediate grant-state enforcement |

## Required Security Properties

1. Provider grant, measurement, reservation, and settlement are authoritative.
2. Revoked grants cannot authorize new execution.
3. Consent identifies payer, ceiling, scope, duration, privacy, and exhaustion behavior.
4. Consent Receipt identifiers cannot be reused with different content.
5. Client metadata cannot expand authorization.
6. Apps cannot self-report authoritative Provider usage.
7. Gateway evidence is never silently promoted to Provider-signed evidence.
8. One settlement identifier is accepted at most once.
9. One reservation reaches one terminal finalization.
10. Every settled quantity maps to one grant and funding bucket.
11. Funding failure cannot silently shift cost.
12. Retry, fallback, speculative, background, and agent traffic remains attributable to the Client.
13. Historical records cannot be rewritten to hide cost or change price.
14. Event ordering and identifier reuse are checked.
15. Reconciliation arithmetic is reproducible.
16. Late usage cannot cause duplicate settlement.
17. Sponsor funding does not grant content or identity access.
18. Event access prevents cross-grant enumeration, replay, and tampering.

## Abuse-Control Requirements

Providers SHOULD implement:

- per-Client, per-grant, per-Beneficiary, and per-workload controls;
- model, route, modality, tool, and operation enforcement;
- short-lived tokens and immediate revocation;
- `jti` replay correlation;
- atomic reservation or direct debit;
- idempotent settlement and adjustment;
- anomaly detection for quota and workload laundering;
- immutable event and receipt storage;
- evidence verification and key rotation;
- reconciliation windows and unmatched-record investigation;
- signed delivery and deduplication where webhooks are used;
- structured errors that do not leak confidential balances or risk signals.

## Open Questions

1. Which asymmetric signature and canonicalization profile should ABDS adopt?
2. Should DPoP be mandatory in Standard?
3. How should previous evidence be treated after signing-key compromise?
4. What reconciliation window should apply to each workload class?
5. How should invoice-level aggregate charges be allocated?
6. Which minimum cohort size should Sponsor reporting require?
