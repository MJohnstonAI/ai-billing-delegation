# ABDS Threat Model v0.5

> OAuth, economic-abuse, attribution, settlement, routing, and Sponsor-risk model.

## Assumptions

- The Provider is authoritative for grant policy, measured usage, reservations, and settlement.
- Execution Tokens reference `delegation_id`; mutable economic state is not trusted from the Client.
- The Resource User, Beneficiary, Funding Principal, and Economic Authorizer may differ.
- Sponsor funding does not imply content or identity access.
- Client attribution labels are untrusted observability metadata.
- Usage and Ledger Events are append-only after acceptance.
- Consumer applications may be malicious, compromised, negligent, or poorly implemented.

## Threat Matrix

| Threat | Attack path | Impact | Required mitigation | Residual risk |
|---|---|---|---|---|
| Quota laundering | App aggregates many grants and resells access | Provider abuse and trust loss | App registration, per-app and per-grant caps, anomaly detection, revocation | Coordinated low-volume abuse |
| Consent phishing | Misleading app requests economic authorization | Unauthorized quota use | Verified identity, explicit payer/cap display, connected-app dashboard | Users may still approve deceptive apps |
| Token replay | Stolen token is replayed elsewhere | Unauthorized consumption | Short lifetime, audience restriction, `jti`, logging; sender constraint for risk | Bearer replay without DPoP/mTLS |
| Weak backend proxy | Unauthenticated endpoint exposes delegated usage | Rapid quota drain | Client session binding, rate limits, Provider app caps | Client defects remain possible |
| Model-tier laundering | Low-cost consent reaches high-cost model | Revenue loss and policy bypass | Provider-side model/route enforcement; requested/resolved model logging | Model aliases can evolve |
| Prompt-injection drain | Malicious input expands agent work | Quota depletion | Request envelopes, tool and step caps, reservation, circuit breakers | Useful long tasks can resemble abuse |
| Recursive agent loop | Agent repeatedly calls tools/models | Unbounded usage | Recursion, step, wall-clock, and cumulative budget limits | Novel loops may evade heuristics |
| Ledger race | Concurrent calls exceed cap | Economic overrun | Atomic reservation/debit or equivalent serializable enforcement | Distributed consistency complexity |
| Duplicate settlement | Retries post the same settlement twice | Double charge | Unique settlement identifier and idempotency key | Cross-region failover errors |
| Reservation replay | Replayed request creates multiple holds | Denial of service and false exhaustion | Scoped idempotency and semantic conflict detection | Malicious unique keys still consume capacity |
| Stale reservation | Hold never terminates | Locked user or Sponsor budget | Expiry, automatic release, reconciliation | Long batch work complicates expiry |
| Forged attribution | Client falsifies feature/workspace/agent labels | Misleading analytics or chargeback disputes | Treat labels as untrusted; Provider billing independent of labels | Internal Client mapping can still be dishonest |
| Cross-workspace charging | App associates one workspace's call with another | Incorrect internal allocation and privacy harm | Pairwise opaque refs, session/workspace authorization, audit correlation | Client remains responsible for its own tenancy model |
| Billing-bucket substitution | Usage is settled against another authorized bucket | Wrong payer charged | Bind reservation to funding bucket; immutable settlement link; fresh authorization for change | Provider implementation defects |
| Silent payer fallback | Sponsor or user funding fails and another payer is charged | Unexpected financial harm | Hard stop or another already-authorized source; explicit fresh consent | Client may misdescribe external charges |
| Retry-cost laundering | App reports only final success and hides failed attempts | Misleading cost analysis | One Usage Event per physical attempt; settlement links all billable events | Provider billability rules may remain complex |
| Model-route opacity | Router silently changes model/provider | Cost and compatibility surprises | Requested/resolved model separation, route Provider and reason | Providers may expose only coarse routing data |
| Price rewrite | Historical usage is recalculated at new prices | Disputes and audit failure | Immutable pricing snapshot at settlement | Contract adjustments may require separate events |
| Event tampering | Usage webhook modified or replayed | False accounting or duplicate processing | Signed delivery, timestamp, delivery ID, replay window, deduplication | Endpoint compromise |
| Event omission | Provider or intermediary drops failed attempts | Under-reporting and reconciliation failure | Provider-authoritative event completeness checks and settlement references | Outage recovery may delay events |
| Adjustment abuse | Privileged actor rewrites economic history | Fraud and audit destruction | No rewrite; compensating adjustment with actor and reason | Insider collusion |
| Sponsor impersonation | App claims a reputable Sponsor funds usage | Consent fraud | Provider-verified Sponsor and Provider-controlled consent | Lookalike naming |
| Funding-offer substitution | Offer intended for another Client is used | Sponsor budget theft | Bind offer to Client and Beneficiary; validate at AS | Compromised Sponsor policy |
| Eligibility fraud | Bots claim Sponsor benefits | Program depletion | Eligibility controls, per-Beneficiary caps, fraud scoring | False positives |
| Sponsor surveillance | Funding used to demand detailed user behavior | Privacy and coercion | Aggregate reporting, independent data authorization, cohort thresholds | Small-cohort inference |
| Confidential balance leakage | Grant endpoint exposes Sponsor pool or other grants | Commercial/privacy harm | Grant-specific authorization and response minimization | Aggregate trends can leak information |
| Revocation delay | Calls continue after revocation | Unauthorized usage | Immediate grant state enforcement; distributed invalidation | Small propagation windows |
| Reconciliation ambiguity | Provider failure leaves charge uncertain | Double charge or lost revenue | Explicit pending state, idempotent recovery, compensating corrections | Long-lived disputes |

## Required Security Properties

1. Provider grant, measured usage, reservation, and settlement state are authoritative.
2. Revoked grants cannot authorize new execution.
3. Consent clearly identifies payer, cap, scope, duration, and exhaustion behavior.
4. Client metadata cannot expand grant or model scope.
5. Apps cannot self-report authoritative usage.
6. One settlement identifier is accepted at most once.
7. One reservation reaches one terminal state.
8. Every settled quantity maps to one grant and funding bucket.
9. Funding failure cannot silently shift cost.
10. Retry and fallback attempts remain attributable.
11. Historical events cannot be rewritten to hide cost or change price.
12. Sponsor funding does not grant content or identity access.
13. Client-visible usage cannot expose unrelated balances or grants.
14. Event retrieval and delivery prevent cross-grant access, replay, and tampering.

## Abuse-Control Requirements

Providers should implement:

- per-app, per-grant, per-user, and per-workspace risk controls;
- model, route, modality, tool, and operation scope enforcement;
- short-lived tokens and immediate revocation;
- atomic reservation or direct debit;
- idempotent economic operations;
- anomaly detection for quota laundering and retry amplification;
- immutable Usage and Ledger Events;
- event delivery signing and deduplication where webhooks are used;
- structured errors that do not leak confidential balances or risk signals.

Sponsored Funding also requires verified Sponsor identity, offer binding, total and per-Beneficiary caps, aggregate reporting, versioned policy, hard-stop behavior, and program pause/revocation controls.

## Open Questions

1. Should DPoP be mandatory in Standard?
2. Which event-delivery signing profile should ABDS adopt?
3. What minimum cohort size should Sponsor reporting require?
4. Should Providers expose billability policy for failed and speculative attempts?
5. Which retention periods are required for accounting, disputes, security, and telemetry?
6. Should signed settlement receipts be required for higher-value grants?
