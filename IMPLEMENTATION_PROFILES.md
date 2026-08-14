# ABDS Implementation Profiles v0.7

> Draft maturity profiles for staged adoption.

These profiles are not formal certification. Do not claim standards compliance, NeuroSync endorsement, or Provider adoption merely by using these labels.

## Profile Summary

| Profile | Purpose |
|---|---|
| Provider Adoption | Minimal experimental Provider-side implementation to test the ABDS economic-delegation thesis |
| Basic | Minimal safe delegated AI resource consumption |
| Standard | Production consumer support with Consent Receipts and attributable Usage Events |
| Advanced / Enterprise | High-assurance, high-quota, routed, streaming, batch, or agentic workloads |
| Sponsored Funding | Third-party funding with separate Sponsor and Beneficiary roles |

## Provider Adoption Profile

The Provider Adoption Profile is new in v0.7.

Its purpose is to let an AI Provider, router, or platform evaluate ABDS without first implementing the complete Standard or Advanced accounting/evidence stack.

Required:

- OAuth Authorization Code Flow or equivalent secure browser-based authorization;
- PKCE with `S256` for public Clients;
- registered Client identity;
- explicit separation between Application Authentication and ABDS Economic Authorization;
- Provider-authenticated Provider Account context;
- Provider-authoritative Entitlement Resolution;
- explicit bounded economic consent;
- Provider-side Delegated AI Grant;
- short-lived scoped execution credential containing or resolving `client_id` and `delegation_id`;
- no mutable quota, balance, price, reservation, or settlement state trusted from bearer-token claims;
- Provider-side measurement and cap enforcement;
- a grant-specific usage-status mechanism;
- user or Economic Authorizer revocation;
- no silent payer or entitlement substitution; and
- truthful experimental-status language.

Recommended:

- immutable Consent Receipt;
- unique token `jti` and replay controls;
- Provider discovery metadata including entitlement capabilities;
- per-Client and per-grant rate limits;
- connected-app management;
- app verification for elevated limits;
- audit events sufficient to reconstruct the grant's economic effect; and
- a clear user-visible explanation of which entitlement category funds the app.

The Provider Adoption Profile MAY omit the full v0.6 Usage Event, reconciliation, reservation, Provider-signature, and advanced evidence machinery during an early experiment if the Provider can still enforce the bounded grant and reconstruct the economic effect accurately.

Omitting those features means the implementation does not yet satisfy the Standard or Advanced profile.

## Basic Implementation Profile

Required:

- OAuth Authorization Code Flow;
- PKCE for public Clients;
- Provider-controlled economic consent;
- separate Application Authentication and Economic Authorization;
- Provider-authoritative Entitlement Resolution where a user, organization, Sponsor, promotion, or developer balance may fund execution;
- Provider-side Delegated AI Grant;
- short-lived Execution Token containing `delegation_id`, `client_id`, and unique `jti`;
- no mutable quota, price, reservation, entitlement balance, or settlement state in token claims;
- Provider-side accounting;
- usage-status endpoint;
- immediate revocation;
- basic discovery metadata;
- explicit funding-source type;
- explicit entitlement type where materially distinct;
- no silent payer or entitlement substitution;
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
- immutable Consent Receipt conforming to v0.6 requirements plus v0.7 entitlement binding where applicable;
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
- v0.7 discovery metadata;
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
- Provider-authoritative Sponsor-pool Entitlement Resolution;
- Client-bound offer and Beneficiary eligibility enforcement;
- total program, per-Beneficiary, and per-request caps;
- Consent Receipt showing payer, entitlement category where relevant, duration, limits, exhaustion behavior, workload scope, and Sponsor visibility;
- grant binding to Client, Beneficiary, and funding source;
- aggregate Sponsor reporting by default;
- program pause, exhaustion, end, and revocation states;
- no content or identity access implied by funding;
- no fallback to user, developer, or another Sponsor entitlement without authorization;
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

| Capability | Provider Adoption | Basic | Standard | Advanced | Sponsored |
|---|---:|---:|---:|---:|---:|
| Separate identity/economic authorization | Required | Required | Required | Required | Required |
| Provider Entitlement Resolution | Required | Required where applicable | Required where applicable | Required | Required |
| Provider-side grant and accounting | Required | Required | Required | Required | Required |
| Unique token `jti` and replay correlation | Recommended | Required | Required | Required | Required |
| Consent Receipt | Recommended | Recommended | Required | Required | Required |
| One event per physical attempt | Optional | Recommended | Required | Required | Required |
| Requested/resolved model separation | Optional | Optional | Required when applicable | Required | Required when applicable |
| Scoped event ordering | Optional | Optional | Required | Required | Required |
| Explicit evidence class | Optional | Optional | Required | Required | Required |
| Provider-signed evidence | Optional | Optional | Recommended | Required or equivalent | Recommended |
| Gateway reconciliation | Optional | Optional | Required when gateway evidence is used | Required | Required when gateway evidence is used |
| Reservation and settlement | Optional | Optional | Risk-based | Required for variable cost | Risk-based |
| Client workload attribution | Optional | Optional | Recommended | Required where used | Privacy-constrained |
| Sponsor privacy controls | N/A | N/A | N/A | As applicable | Required |

## Adoption Status Language

Implementation-profile labels describe technical scope. Provider-adoption labels describe relationship maturity. They are different dimensions.

ABDS v0.7 uses these informative adoption states:

```text
conceptual
simulated
gateway_compatible
provider_evaluated
provider_pilot
provider_native
```

Do not assign a named Provider `provider_evaluated`, `provider_pilot`, or `provider_native` status without evidence from that Provider.

## Conformance Language

Prefer accurate statements such as:

```text
Experimental implementation of the ABDS Provider Adoption Profile
Implements the ABDS Basic Implementation Profile
Implements the ABDS Standard Implementation Profile
Implements the ABDS Advanced / Enterprise Implementation Profile
```

Do not use “certified,” “official,” “approved,” “endorsed,” or Provider-adoption language until a formal program or Provider evidence exists.

Passing repository tests alone does not confer certification.

## Open Questions

1. Is the Provider Adoption Profile small enough to make a realistic first Provider pilot possible?
2. Which entitlement categories are actually useful across Providers without constraining their business models?
3. Should Provider-signed evidence be required in Standard?
4. Which signature and canonicalization profile should be mandatory?
5. Which Consent Receipt fields form the minimum core?
6. When must Standard reserve streaming work?
7. How should batch and invoice reconciliation operate?