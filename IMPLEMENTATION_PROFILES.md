# ABDS Implementation Profiles v0.5

> Draft maturity profiles for staged ABDS adoption.

These profiles are not conformance badges. Do not claim “ABDS compliant” until a formal checklist and test suite exist.

## Profile Summary

| Profile | Purpose |
|---|---|
| Basic | Minimal safe delegated AI resource consumption |
| Standard | Production consumer support with attributable usage events |
| Advanced / Enterprise | High-assurance, high-quota, routed, streaming, batch, or agentic workloads |
| Sponsored Funding | Third-party funding with separate Sponsor and Beneficiary roles |

## Basic Implementation Profile

Required:

- OAuth Authorization Code Flow;
- PKCE for public clients;
- structured economic authorization using the ABDS Rich Authorization Request type or documented transitional equivalent;
- Provider consent showing funding terms;
- Provider-side Delegated AI Grant;
- short-lived Execution Token containing `delegation_id`;
- no mutable quota or settlement state in token claims;
- Provider-side Usage Ledger;
- usage-status endpoint;
- immediate user revocation;
- basic discovery metadata;
- structured quota, revocation, expiry, funding, and scope errors;
- explicit funding-source type;
- no silent payer substitution;
- Provider-measured billable usage;
- stable logical request identifier for support and audit correlation.

Recommended:

- backend-mediated token handling for consumer apps;
- app registration before economic scopes are granted;
- per-Client rate limiting;
- connected-apps dashboard;
- immutable Provider audit record for each settled logical request.

## Standard Implementation Profile

Required:

- everything in Basic;
- Rich Authorization Request validation;
- registered app identity on consent screens;
- model and operation scope enforcement;
- audience-restricted tokens and replay correlation through `jti`;
- refresh-token rotation where refresh tokens are issued;
- per-delegation rate limits and anomaly detection;
- one immutable Usage Event for each billable physical model attempt;
- unique `usage_event_id`, logical `request_id`, and physical `attempt_id`;
- separate `requested_model` and `resolved_model` fields where routing or aliases exist;
- visible retry and fallback attribution;
- extensible usage dimensions with published meanings and units;
- separate immutable Ledger Events for economic state transitions;
- idempotent settlement or direct debit;
- grant-specific usage/event retrieval or equivalent Provider support tooling;
- ABDS v0.5 discovery metadata;
- graceful reauthorization after revocation or expiry.

Recommended:

- privacy-minimized workspace, feature, workflow, agent-run, and agent-step correlation;
- OpenTelemetry trace and span correlation;
- sender-constrained tokens for elevated risk;
- consent receipts;
- signed usage or settlement receipts;
- cost and quota alerts.

## Advanced / Enterprise Implementation Profile

Required:

- everything in Standard;
- risk-based sender-constrained tokens such as DPoP or mTLS;
- reservation and settlement for variable-cost streaming, multimodal, batch, routed, or agentic operations;
- atomic active-reservation plus settled-balance enforcement;
- partial completion, cancellation, timeout, and Provider-failure accounting;
- pending reconciliation state;
- hierarchical request, agent-run, agent-step, and tool-call budgets where applicable;
- retry, fallback, speculative, and failover attempt attribution;
- one terminal reservation state;
- idempotent reservation, settlement, release, and adjustment operations;
- append-only correction through compensating events;
- historical pricing snapshots when monetary amounts are exposed;
- organization-level delegated grants where applicable;
- administrative revocation and audit export;
- app verification tiers and fraud-risk scoring;
- Provider investigation tooling.

Recommended:

- Pushed Authorization Requests;
- fine-grained model, route, modality, and tool controls;
- signed webhooks with replay protection;
- program and grant circuit breakers;
- privacy-preserving aggregate analytics;
- automated schema and invariant validation.

## Sponsored Funding Profile

Required:

- everything in Standard;
- registered and verified Sponsor identity;
- Provider-recognized funding offer;
- Client-bound offer and Beneficiary eligibility enforcement;
- total program, per-Beneficiary, and per-request caps;
- consent showing payer, duration, limits, exhaustion behavior, and Sponsor visibility;
- grant binding to Client, Beneficiary, and funding source;
- aggregate Sponsor reporting by default;
- program pause, exhaustion, end, and revocation states;
- no prompt, output, file, conversation, or identity access implied by funding;
- no fallback to user or developer funding without fresh authorization;
- versioned funding and visibility policy;
- renewed consent for material expansion;
- every settled event mapped to one Sponsor funding bucket;
- Sponsor reports that exclude Client observability metadata unless independently authorized and privacy-safe.

Recommended:

- Pushed Authorization Requests for eligibility-bearing requests;
- consent receipts;
- minimum cohort thresholds;
- program-level circuit breakers;
- independent Sponsor and Client verification;
- reservation for high-variance workloads;
- signed aggregate reports.

## Capability Matrix

| Capability | Basic | Standard | Advanced | Sponsored |
|---|---:|---:|---:|---:|
| Provider-side grant and ledger | Required | Required | Required | Required |
| One event per billable physical attempt | Recommended | Required | Required | Required |
| Requested/resolved model separation | Optional | Required when applicable | Required | Required when applicable |
| Retry/fallback attribution | Optional | Required | Required | Required |
| Reservation and settlement | Optional | Risk-based | Required for variable cost | Risk-based / high variance |
| Partial settlement and reconciliation | Optional | Optional | Required | Risk-based |
| Client workflow/agent attribution | Optional | Recommended | Required where used | Privacy-constrained |
| Signed event delivery | Optional | Recommended | Recommended | Recommended |
| Sponsor privacy controls | N/A | N/A | As applicable | Required |

## Non-Compliance Language

Prefer:

```text
Implements the ABDS Basic Implementation Profile
Implements the ABDS Standard Implementation Profile
Implements the ABDS Advanced / Enterprise Implementation Profile
```

Do not use formal compliance language until conformance tests exist.

## Open Questions

1. Should reservation be mandatory in Standard for all streaming calls?
2. Which Usage Event fields form the minimum interoperability core?
3. Should signed receipts be Standard or Advanced?
4. Which failed and speculative attempts may be billable?
5. Should Sponsor funding remain a standalone profile or a capability layered onto Standard?
