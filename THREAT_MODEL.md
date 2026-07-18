# ABDS Threat Model

> Draft threat model for AI Billing Delegation Standard.

ABDS introduces a new economic delegation layer. The security model must therefore address both OAuth-style credential risks and AI-specific resource-consumption abuse.

## Threat Model Assumptions

- The AI provider is the authoritative enforcement party.
- The Delegated AI Grant is server-side and provider-maintained.
- The execution token references a `delegation_id`.
- Mutable quota state is not trusted when presented by the client.
- The Resource User, Beneficiary, Funding Principal, and Economic Authorizer may be different parties.
- A Sponsor's economic authorization does not imply authorization to receive user content or identity.
- Consumer applications may be malicious, compromised, negligent, or simply poorly implemented.
- Users may misunderstand economic consent unless the provider UI is explicit.

## Threat Matrix

| Threat | Attack Path | Impact | Required Mitigation | Optional Mitigation | Residual Risk |
|---|---|---|---|---|---|
| Quota laundering | Malicious app obtains delegated quota from many users and resells access | Provider resource abuse; user trust damage | App registration, per-app caps, anomaly detection, revocation | App verification, risk scoring, legal enforcement | Coordinated low-volume abuse may remain hard to detect |
| Consent phishing | Fake or misleading app asks users to approve delegation | Users grant quota to malicious actor | Verified app identity, clear consent screen, connected-app dashboard | Phishing-resistant branding, warnings for unverified apps | Users may still approve malicious apps |
| Token replay | Stolen execution token is replayed from another environment | Unauthorized quota consumption | Short token lifetime, audience restriction, `jti`, provider logging | DPoP or sender-constrained tokens | Bearer-token replay risk remains without sender constraint |
| Compromised third-party app | Legitimate app backend is breached | Delegations abused at scale | Per-client rate limits, anomaly detection, revocation, least-privilege scopes | App verification and incident reporting | Provider may not detect breach immediately |
| Backend proxy abuse | App exposes an unauthenticated or weakly protected AI proxy | Attackers consume delegated quota through app backend | App backend rate limiting, user session binding, provider-side app limits | Provider risk scoring and traffic fingerprinting | App implementation bugs remain likely |
| Bot-created delegations | Automated accounts authorize many delegations | Resource abuse and fake ecosystem demand | Provider anti-abuse controls, account reputation, rate limits | Higher assurance for high caps | Bot detection is imperfect |
| Model-tier laundering | App uses low-tier consent to reach high-cost models | Provider revenue loss, policy bypass | Model-scope enforcement in grant and gateway | Provider-defined model families | Model availability may change over time |
| Prompt-injection quota drain | Malicious content causes app agents to consume excessive quota | User quota depletion, poor trust | Per-request limits, app-level tool controls, provider caps | Reservation / settlement, budget alerts | Agentic systems remain difficult to bound |
| Recursive agent loops | App loops tool calls or model calls until quota is exhausted | Unexpected quota depletion | App-side loop controls, provider-side delegation caps | Reservation / settlement and execution envelopes | Hard to distinguish useful long tasks from runaway loops |
| Revocation delay | User revokes access but provider continues accepting calls | User trust and compliance failure | Immediate grant-status transition and gateway enforcement | Event push to apps | Race windows may exist during distributed propagation |
| Ledger race condition | Concurrent requests overspend delegated cap | Economic overrun | Atomic quota enforcement in provider ledger | Reservation / settlement | Distributed ledger consistency remains complex |
| Subscription-status confusion | User subscription lapses but delegation remains active | Provider revenue leakage | Subscription entitlement check during execution | Cached entitlement with short TTL | Temporary inconsistencies possible |
| Cross-app confusion | User cannot tell which app consumed quota | Trust damage and support burden | Connected-app dashboard and delegation-level usage records | Usage receipts | Users may still misunderstand app behavior |
| Sponsor impersonation | A malicious Client claims that a recognized donor or foundation funds the grant | Consent fraud and reputational harm | Provider-verified Sponsor identity and provider-controlled consent | Verified domains and Sponsor trust tiers | Lookalike names may still confuse users |
| Funding-offer substitution | A Client swaps a valid `funding_offer_id` for a program intended for another Client or audience | Unauthorized access to Sponsor funds | Bind every offer to eligible Clients and Beneficiaries; validate at the Authorization Server | Signed or pushed authorization requests | Compromised Sponsor policy remains possible |
| Eligibility fraud | Bots or ineligible users claim sponsored allocations | Program budget depletion | Per-Beneficiary caps, eligibility controls, rate limits, and fraud detection | Trusted eligibility attestations | False positives may exclude legitimate users |
| Sponsor surveillance | Sponsor uses funding to demand prompts, outputs, identity, or fine-grained behavior | Privacy harm and coercion | Economic authorization must not imply data access; aggregate reporting by default | Privacy thresholds and independent audits | Small cohorts may still permit inference |
| Silent payer fallback | Sponsor funding is exhausted and the Client silently charges a user or developer | Unexpected financial harm and broken consent | Mandatory hard stop or fresh authorization for a new Funding Principal | Funding-source preference controls | Client may misdescribe an external charge |
| Sponsor budget drain | Attackers automate expensive requests across many grants | Rapid depletion of the shared program pool | Total, per-user, and per-request caps; reservation; anomaly detection; circuit breakers | Step-up verification | Coordinated low-volume drain may persist |
| Policy bait-and-switch | Sponsor broadens reporting or changes economic terms after consent | Consent invalidation and user harm | Versioned policy, consent receipt, and renewed consent for material changes | Change notifications | Users may not read notifications |
| Confidential balance leakage | Usage endpoint reveals the Sponsor's remaining pool or other Beneficiaries | Commercial and privacy leakage | Return only grant-specific state to Clients; authorize every lookup | Separate Sponsor admin endpoint | Aggregate data may reveal trends |

## Required Security Properties

ABDS implementations should preserve these properties:

1. The provider remains the source of truth for grant status and usage.
2. Execution tokens cannot authorize usage after the underlying delegation is revoked.
3. User-facing consent clearly communicates economic effect.
4. Apps cannot expand model scope beyond the approved grant.
5. Apps cannot self-report quota usage.
6. Providers can detect and revoke abusive delegation patterns.
7. Users can inspect and revoke active delegations.
8. The Funding Principal shown during consent is the funding source charged for covered usage.
9. Exhaustion or revocation cannot silently shift cost to another party.
10. Sponsor funding does not grant access to prompts, outputs, files, or identity.
11. Client-visible usage state cannot expose unrelated grants or confidential funding-pool balances.

## Public Client Guidance

Public clients must use PKCE.

For consumer web and mobile apps, backend-mediated token handling is strongly recommended when delegated quota can carry meaningful economic value. Providers may require backend proxying, sender-constrained tokens, or additional verification for high-cap, high-risk, or agentic delegations.

## Sender-Constrained Tokens

Sender-constrained tokens such as DPoP are not required for every ABDS use case, but should be available for higher-risk profiles.

Recommended use cases:

- high delegated caps,
- unverified apps,
- agentic workloads,
- enterprise or organizational grants,
- apps with elevated model scopes,
- apps with suspicious traffic patterns.

## Abuse-Control Requirements

At minimum, providers should implement:

- per-app caps,
- per-delegation caps,
- per-user delegation limits,
- model-scope enforcement,
- short-lived execution tokens,
- revocation,
- usage ledger logging,
- anomaly detection,
- structured error responses.

Sponsored Funding implementations should also include:

- verified Sponsor identity,
- funding-offer binding,
- total program and per-Beneficiary caps,
- aggregate Sponsor reporting by default,
- versioned funding and visibility policies,
- hard-stop behavior when funding is unavailable,
- no silent payer substitution, and
- program-level pause and revocation controls.

## Open Questions

1. Should DPoP or equivalent sender constraint be mandatory for Standard profile?
2. Should ABDS require consent receipts?
3. Should providers expose user-readable delegation usage history?
4. Should app verification be mandatory before requesting high delegated caps?
5. Should prompt-injection quota drain be addressed in the core spec or a separate agentic profile?
6. What is the minimum privacy threshold for Sponsor reports covering small cohorts?
7. Which eligibility attestations should be standardized, if any?
8. Should sponsored grants always require a provider-issued consent receipt?
