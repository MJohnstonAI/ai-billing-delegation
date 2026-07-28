# ABDS Implementation Profiles v0.6

> Draft maturity profiles for staged adoption.

These profiles are not formal certification. Do not claim standards compliance or Provider endorsement merely by using these labels.

## Profile Summary

| Profile | Purpose |
|---|---|
| Basic | Minimal safe delegated AI resource consumption |
| Standard | Production consumer support with Consent Receipts and attributable Usage Events |
| Advanced / Enterprise | High-assurance, high-quota, routed, streaming, batch, or agentic workloads |
| Sponsored Funding | Third-party funding with separate Sponsor and Beneficiary roles |

## Basic Implementation Profile

Required:

- OAuth Authorization Code Flow;
- PKCE for public Clients;
- Provider-controlled economic consent;
- Provider-side Delegated AI Grant;
- short-lived Execution Token containing `delegation_id`, `client_id`, and unique `jti`;
- no mutable quota, price, reservation, or settlement state in token claims;
- Provider-side accounting;
- usage-status endpoint;
- immediate revocation;
- basic discovery metadata;
- explicit funding-source type;
- no silent payer substitution;
- Provider-measured billable usage;
- stable logical `request_id`;
- one immutable Provider audit record per settled logical request.

Recommended:

- backend-mediated token handling;
- Client registration;
- per-Client rate limits;
- connected-app dashboard;
- sender constraint for higher-value grants.

## Standard Implementation Profile

Required:

- everything in Basic;
- Rich Authorization Request validation;
- registered Client identity on consent screens;
- immutable Consent Receipt conforming to v0.6;
- model and operation scope enforcement;
- workload scope enforcement where the Provider exposes it;
- audience-restricted tokens and replay detection through `jti`;
- per-delegation rate limits and anomaly detection;
- one immutable Usage Event per billable physical attempt;
- unique `usage_event_id`, `request_id`, and `attempt_id`;
- scoped event sequence number;
- separate requested and resolved model where routing or aliases exist;
- visible retry and fallback attribution;
- published usage dimensions and units;
- explicit evidence class;
- separate immutable Ledger Events;
- idempotent settlement or direct debit;
- grant-specific usage and event retrieval;
- v0.6 discovery metadata;
- graceful reauthorization after revocation or expiry.

Evidence requirement:

- direct Provider implementations SHOULD emit `provider_reported` or `provider_signed` evidence;
- transitional gateways MAY emit `gateway_attested` evidence but MUST mark it provisional and reconcile it where Provider records are available.

Recommended:

- privacy-minimized workload, workflow, feature, workspace, run, and step correlation;
- OpenTelemetry trace and span correlation;
- Provider-signed Consent Receipts;
- cost and quota alerts;
- signed webhook delivery.

## Advanced / Enterprise Implementation Profile

Required:

- everything in Standard;
- risk-based sender-constrained tokens such as DPoP or mTLS;
- reservation and settlement for variable-cost operations;
- atomic active-reservation plus settled-balance enforcement;
- partial completion, cancellation, timeout, and Provider-failure accounting;
- Provider-signed events, signed settlement receipts, or equivalent high-assurance evidence;
- reconciliation of gateway, router, delayed, or invoice-level Provider records;
- hierarchical request, run, step, and tool budgets where applicable;
- retry, fallback, speculative, and failover attribution;
- one terminal reservation finalization;
- idempotent reservation, settlement, release, reconciliation, and adjustment;
- append-only correction;
- historical pricing snapshots when monetary amounts are exposed;
- administrative revocation and audit export;
- signing-key rotation and verification failure handling;
- Provider investigation tooling.

Recommended:

- Pushed Authorization Requests;
- fine-grained model, route, modality, workload, and tool controls;
- batch signatures or verifiable inclusion proofs for high-volume events;
- program and grant circuit breakers;
- privacy-preserving aggregate analytics;
- automated schema, signature, and invariant validation.

## Sponsored Funding Profile

Required:

- everything in Standard;
- registered and verified Sponsor identity;
- Provider-recognized funding offer;
- Client-bound offer and Beneficiary eligibility enforcement;
- total program, per-Beneficiary, and per-request caps;
- Consent Receipt showing payer, duration, limits, exhaustion behavior, workload scope, and Sponsor visibility;
- grant binding to Client, Beneficiary, and funding source;
- aggregate Sponsor reporting by default;
- program pause, exhaustion, end, and revocation states;
- no content or identity access implied by funding;
- no fallback to user or developer funding without authorization;
- versioned funding and visibility policy;
- renewed consent for material expansion;
- every settled event mapped to one Sponsor funding bucket;
- Sponsor reports excluding Client observability metadata unless independently authorized and privacy-safe;
- dual attribution to Beneficiary and registered Client.

Recommended:

- Pushed Authorization Requests for eligibility-bearing requests;
- minimum cohort thresholds;
- program-level circuit breakers;
- independent Sponsor and Client verification;
- reservation for high-variance workloads;
- signed aggregate reports.

## Capability Matrix

| Capability | Basic | Standard | Advanced | Sponsored |
|---|---:|---:|---:|---:|
| Provider-side grant and ledger | Required | Required | Required | Required |
| Unique token `jti` and replay correlation | Required | Required | Required | Required |
| Consent Receipt | Recommended | Required | Required | Required |
| One event per physical attempt | Recommended | Required | Required | Required |
| Requested/resolved model separation | Optional | Required when applicable | Required | Required when applicable |
| Scoped event ordering | Optional | Required | Required | Required |
| Explicit evidence class | Optional | Required | Required | Required |
| Provider-signed evidence | Optional | Recommended | Required or equivalent | Recommended |
| Gateway reconciliation | Optional | Required when gateway evidence is used | Required | Required when gateway evidence is used |
| Reservation and settlement | Optional | Risk-based | Required for variable cost | Risk-based |
| Client workload attribution | Optional | Recommended | Required where used | Privacy-constrained |
| Sponsor privacy controls | N/A | N/A | As applicable | Required |

## Conformance Language

Prefer:

```text
Implements the ABDS Basic Implementation Profile
Implements the ABDS Standard Implementation Profile
Implements the ABDS Advanced / Enterprise Implementation Profile
```

Do not use “certified,” “official,” “approved,” or Provider adoption language until a formal program and evidence exist.

## Open Questions

1. Should Provider-signed evidence be required in Standard?
2. Which signature and canonicalization profile should be mandatory?
3. Which Consent Receipt fields form the minimum core?
4. When must Standard reserve streaming work?
5. How should batch and invoice reconciliation operate?
