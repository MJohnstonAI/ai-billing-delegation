# ABDS Implementation Profiles

> Draft implementation profiles for staged ABDS adoption.

These profiles are not conformance badges. They are implementation maturity levels intended to help providers, app developers, and reviewers reason about partial adoption.

Do not use the wording “ABDS compliant” until ABDS has a formal conformance checklist or reference test suite.

## Profile Summary

| Profile | Purpose |
|---|---|
| Basic | Minimal safe delegated AI resource consumption |
| Standard | Production-grade consumer app support |
| Advanced / Enterprise | High-assurance, high-quota, organizational, or agentic workloads |
| Sponsored Funding | Third-party funding with separate Sponsor and Beneficiary roles |

## Basic Implementation Profile

The Basic profile establishes the minimum useful ABDS implementation.

Required:

- OAuth Authorization Code Flow
- PKCE for public clients
- Structured economic authorization using the ABDS Rich Authorization Request type, or a documented transitional equivalent
- Provider consent screen showing economic delegation terms
- Server-side Delegated AI Grant
- Short-lived execution token containing `delegation_id`
- No live quota state or quota-limit metadata in execution-token claims
- Provider-side Usage Ledger
- Usage Introspection Endpoint
- Immediate user revocation
- Basic ABDS discovery metadata
- Structured error responses for quota exhaustion, revocation, expiration, and model-scope rejection
- Explicit funding-source type
- No silent payer substitution

Recommended:

- Backend-mediated token handling for consumer web apps
- App registration before ABDS scopes are granted
- Per-client rate limiting
- User-facing connected-apps dashboard

## Standard Implementation Profile

The Standard profile is suitable for production consumer AI applications.

Required:

- Everything in Basic
- Rich Authorization Request validation
- Registered app dashboard
- App identity display on consent screens
- Model-scope enforcement
- Audience-restricted execution tokens
- `jti` claim for replay detection and event correlation
- Refresh-token rotation where refresh tokens are issued
- User connected-apps dashboard
- Per-delegation rate limits
- Provider-side anomaly detection
- Usage audit events visible to the user or provider support team
- ABDS error registry support
- Graceful reauthorization flow after revocation or expiry

Recommended:

- Sender-constrained tokens for higher-risk apps
- Risk scoring for new or unverified apps
- Provider review for high delegated caps
- Consent receipts or downloadable grant summaries

## Advanced / Enterprise Implementation Profile

The Advanced / Enterprise profile is intended for high-quota, high-risk, organizational, or agentic workloads.

Required:

- Everything in Standard
- Risk-based sender-constrained tokens such as DPoP or equivalent mechanisms
- Reservation / settlement support for streaming, multimodal, batch, or agentic workloads
- Organization-level delegated grants where applicable
- Administrative revocation
- Audit export
- App verification tiers
- Abuse and fraud risk scoring
- Provider support tooling for delegation investigations

Recommended:

- Pushed Authorization Requests for high-assurance integrations
- Fine-grained model family and tool-use controls
- Delegation approval workflows
- Spending or quota alerts
- Separate policies for consumer and enterprise entitlements

## Sponsored Funding Profile

The Sponsored Funding profile applies when the Funding Principal differs from the Resource User and application developer.

Required:

- Everything in Standard
- Registered and verified Sponsor identity
- Provider-recognized Sponsorship Program or funding offer
- Client-bound funding offers
- Beneficiary eligibility enforcement
- Total program, per-Beneficiary, and per-request caps
- Consent showing who pays, program duration, limits, and Sponsor data visibility
- Grant binding to Client, Beneficiary, and funding source
- Aggregate Sponsor reporting by default
- Program pause, exhaustion, end, and revocation states
- No prompt or output access implied by funding
- No silent fallback to user or developer funding
- Versioned funding and data-visibility policy
- Renewed consent for material cap, access, payer, duration, or reporting expansions

Recommended:

- Pushed Authorization Requests for eligibility-bearing or higher-value requests
- Consent receipts
- Privacy thresholds for small-cohort Sponsor reports
- Program-level circuit breakers
- Sender-constrained tokens
- Reservation and settlement for high-variance workloads
- Independent Sponsor and Client verification tiers

See `SPONSORED_DELEGATION.md`.

## Why Profiles Matter

ABDS adoption is unlikely to happen all at once. Profiles allow providers to implement a limited but safe subset first, then add more advanced capabilities as real use cases emerge.

Profiles also help reviewers distinguish between:

- the core delegation model,
- production hardening,
- enterprise controls,
- future agentic workload requirements.

## Non-Compliance Language

Until a test suite exists, avoid:

```text
ABDS-Basic compliant
ABDS-Standard compliant
ABDS-Enterprise compliant
```

Prefer:

```text
Implements the ABDS Basic Implementation Profile
Implements the ABDS Standard Implementation Profile
Implements the ABDS Advanced / Enterprise Implementation Profile
```

## Open Questions

1. Should PKCE be mandatory for confidential clients as well as public clients?
2. Should sender-constrained tokens be required in Standard or only Advanced?
3. Should reservation / settlement be part of Advanced only, or a separate profile?
4. Should provider app verification be required for all delegated quota scopes?
5. Should ABDS define a formal conformance test suite before v1.0?
6. Should Sponsored Funding be a standalone profile or a capability layered onto Standard?
7. Which Sponsor policy changes require renewed user consent?
