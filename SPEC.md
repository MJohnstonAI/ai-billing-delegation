# ABDS Technical Specification v0.4 (Draft)

## Abstract

This document specifies the AI Billing Delegation Standard (ABDS), an OAuth-aligned profile for bounded, provider-enforced AI resource consumption.

ABDS separates the Resource User, Consumer Application, Funding Principal, Economic Authorizer, and AI Provider. The Funding Principal may be the user, an organization, a sponsor, an AI provider promotion, or the developer. This payer-neutral model allows a donor or membership organization, for example, to fund NatureGuard usage without charging the user or application developer.

ABDS does not define a new authentication protocol or a payment rail. It profiles modern OAuth patterns and adds AI-specific grant, funding, accounting, consent, and revocation semantics.

## 1. Motivation

Consumer AI applications face a structural funding problem:

- AI API costs are normally billed to the developer.
- Developer-funded growth can create immediate and unpredictable liability.
- Bring Your Own Key is unsuitable for ordinary consumers.
- Custom credits, paywalls, and metering systems must be rebuilt by every application.
- A user may have an AI subscription but no safe way to authorize bounded app usage.
- A sponsor, employer, university, or donor may want to fund access but has no interoperable way to do so without becoming the application operator.

ABDS treats funding as a delegated authorization problem. The aim is not free compute; it is an explicit, bounded, auditable decision about whose provider-recognized entitlement or budget funds a particular Client and Beneficiary.

When an active grant is funded by a user or Sponsor, the developer does not pay the provider's inference cost for covered calls. The developer remains responsible for application infrastructure, storage, orchestration, monitoring, support, abuse prevention, and all usage outside the grant.

## 2. Terminology

| Term | Definition |
|---|---|
| **AI Provider** | Entity offering AI inference and operating the relevant Authorization Server, Resource Server, grant service, and Usage Ledger. |
| **Authorization Server (AS)** | OAuth server that authenticates parties, obtains consent, creates grants, and issues credentials. |
| **Resource Server (RS)** | AI API or gateway that validates tokens and enforces grant and ledger state. |
| **Resource User** | Person using the AI-enabled Client. |
| **Beneficiary** | Person or eligible class permitted to consume an allocation. Usually the Resource User. |
| **Consumer Application / Client** | Registered application requesting and using an ABDS grant. |
| **Funding Principal** | Party whose provider-recognized entitlement or budget is charged. |
| **Economic Authorizer** | Party authorized to commit the Funding Principal's resources. |
| **Sponsor** | Funding Principal other than the Resource User or application developer. |
| **Funding Entitlement or Budget** | Provider-recognized source of resource units or monetary budget. |
| **Delegated AI Grant** | Provider-maintained authorization binding a Client, Beneficiary, funding source, limits, scopes, status, and consent. |
| **Execution Token** | Short-lived OAuth access token referencing `delegation_id`. |
| **Usage Ledger** | Provider-authoritative accounting record for reservations, debits, settlements, releases, denials, and resets. |
| **Quota Cap** | Maximum resource consumption permitted by a grant for a period. |
| **delegation_id** | Stable public ABDS grant reference used in tokens, usage views, logs, and revocation events. |
| **funding_source_id** | Opaque provider-side reference to the charged entitlement or budget. It is not a bearer-token claim. |

## 3. Protocol Overview

ABDS uses:

- OAuth 2.0 Authorization Code Flow,
- PKCE for public clients,
- OAuth 2.0 Rich Authorization Requests for structured economic authorization,
- provider-maintained Delegated AI Grants,
- short-lived Execution Tokens referencing `delegation_id`,
- a provider-authoritative Usage Ledger,
- usage-status and revocation interfaces,
- optional OAuth Token Exchange,
- optional OAuth Resource Indicators, and
- risk-based sender-constrained tokens.

OAuth scopes MAY express coarse rights. The structured cap, period, operations, model policy, funding offer, and overage behavior SHOULD be carried in `authorization_details`.

### 3.1 Payer-Neutral Four-Object Model

```text
Funding Entitlement or Budget
        | authorizes and funds
Delegated AI Grant
        | referenced by
Short-lived Execution Token
        | consumption recorded in
Provider-side Usage Ledger
```

This separation is mandatory.

The Execution Token identifies and constrains the delegation. It MUST NOT be the source of truth for live usage, remaining quota, cap, reset time, Sponsor pool balance, or funding-settlement state.

### 3.2 Funding Source Types

Providers SHOULD support one or more of:

| Type | Funding Principal |
|---|---|
| `user_entitlement` | Individual subscriber or account holder |
| `organization_budget` | Employer, university, government, or other organization |
| `sponsor_budget` | Donor, foundation, membership organization, or patronage program |
| `provider_promotion` | AI Provider-funded allowance |
| `developer_account` | Traditional developer-paid usage |

Support for a type MUST be advertised through provider discovery metadata.

ABDS does not require the Provider to reveal the commercial settlement mechanism behind a funding source.

## 4. Delegated AI Grant

The Provider MUST maintain a server-side grant for every active delegation.

### 4.1 Grant Authorization Policy

| Field | Type | Description |
|---|---|---|
| `delegation_id` | string | Stable public ABDS reference |
| `grant_id` | string | Optional provider-internal record identifier |
| `beneficiary_subject` | string | Provider-side user or pseudonymous Beneficiary reference |
| `app_client_id` | string | Bound Client identifier |
| `funding_source_type` | enum | Funding type from Section 3.2 |
| `funding_source_id` | string | Opaque provider-side funding reference |
| `economic_authorizer_type` | enum | `user`, `organization_admin`, `sponsor_policy`, `provider_policy`, or `developer` |
| `sponsorship_program_id` | string | Optional public Sponsored Delegation Profile reference |
| `unit_type` | string | Provider-defined resource-unit identifier |
| `quota_cap` | integer | Maximum units for the grant period |
| `quota_period` | string | `daily`, `weekly`, `monthly`, or provider-defined period |
| `per_request_cap` | integer | Optional maximum for a single execution |
| `model_scope` | array | Permitted model classes or families |
| `operation_scope` | array | Permitted operations |
| `overage_policy` | enum | `prohibited` or explicitly authorized provider-defined behavior |
| `status` | enum | `active`, `paused`, `revoked`, `exhausted`, or `expired` |
| `created_at` | ISO 8601 | Creation time |
| `expires_at` | ISO 8601 | Optional grant expiry |
| `updated_at` | ISO 8601 | Last authorization-policy or lifecycle update |

`quota_used`, `quota_remaining`, reserved units, Sponsor pool balance, and settlement state are ledger values. They MUST NOT be treated as grant-policy fields or token claims.

### 4.2 Lifecycle

```text
created -> active -> paused
                  -> exhausted
                  -> revoked
                  -> expired
```

Lifecycle and ledger transitions MUST be enforced atomically or through a mechanism providing equivalent protection against overspend.

## 5. Authorization Request

### 5.1 Rich Authorization Details

ABDS SHOULD define a registered Rich Authorization Request type. Until a collision-resistant identifier and registration path are selected, this draft uses `abds_ai_delegation` as a placeholder.

Illustrative authorization details:

```json
[
  {
    "type": "abds_ai_delegation",
    "actions": ["ai.execute", "ai.usage.read"],
    "locations": ["https://api.provider.example"],
    "models": ["standard-text"],
    "budget": {
      "max_units": 100,
      "unit_type": "provider_ai_unit",
      "period": "monthly",
      "per_request_max_units": 5,
      "overage": "prohibited"
    },
    "funding_offer_id": "offer_natureguard_public_2026"
  }
]
```

`funding_offer_id` is optional. Its presence requests a funding source already made available to the Client or Beneficiary, such as a Sponsorship Program. The Client MUST NOT be allowed to name an arbitrary provider funding account.

The AS MUST:

- reject unknown or malformed authorization details,
- validate the Client and redirect URI,
- validate the funding offer and Client eligibility,
- ensure the request does not exceed funding or provider policy,
- permit the Resource User or Provider to lower the requested cap,
- present the effective authorization to the user, and
- bind the resulting grant to the Client, Beneficiary, and funding source.

### 5.2 OAuth Request

```text
GET https://auth.provider.example/oauth/authorize
  ?response_type=code
  &client_id={app_client_id}
  &redirect_uri={registered_redirect_uri}
  &state={csrf_value}
  &code_challenge={pkce_challenge}
  &code_challenge_method=S256
  &authorization_details={url_encoded_json}
```

Public clients MUST use PKCE with `S256`. Confidential clients SHOULD use PKCE unless equivalent or stronger authorization-code injection defenses are in place.

Pushed Authorization Requests SHOULD be used for large, sensitive, high-cap, or sponsor-eligibility-bearing requests.

## 6. Authorization and Consent

The Provider MUST display:

- verified Client and developer identity,
- Resource User account or Beneficiary context,
- Funding Principal identity or plain-language funding-source type,
- the statement of who pays for covered usage,
- quota cap, unit type, period, and per-request cap where applicable,
- permitted model classes and operations,
- overage behavior,
- program expiry or renewal behavior,
- what happens when funding is exhausted,
- what the Client can access,
- what a Sponsor can see,
- a revocation path, and
- warnings for unverified or high-risk Clients.

For sponsored grants, consent MUST state that sponsorship alone does not give the Sponsor access to prompts or outputs.

The Provider MUST NOT silently select a personal funding source when a sponsored request fails.

## 7. Execution Token

The token MUST contain standard OAuth information and `delegation_id`. It MUST be short-lived, audience-restricted, and scoped.

Illustrative claims:

```json
{
  "iss": "https://auth.provider.example",
  "sub": "beneficiary_subject",
  "aud": "https://api.provider.example",
  "iat": 1784300000,
  "exp": 1784300900,
  "jti": "tok_xyz789",
  "client_id": "app_natureguard",
  "delegation_id": "del_abc123",
  "scope": "ai.execute ai.usage.read",
  "model_scope": ["standard-text"],
  "abds_version": "0.4"
}
```

The token MUST NOT contain:

- `quota_cap`,
- `quota_used`,
- `quota_remaining`,
- `quota_period`,
- `quota_reset`,
- `funding_source_id`,
- Sponsor pool balance, or
- settlement or payment state.

The Provider MAY omit `model_scope` from the token and resolve it from the grant. When present, it MUST only narrow the provider-side grant.

## 8. Token Issuance

Providers MAY issue an Execution Token during the authorization-code exchange.

Providers SHOULD consider OAuth Token Exchange where the Client first receives a credential representing the durable grant and later requests a short-lived token for a specific Resource Server.

Providers MAY require DPoP, mTLS, or another sender-constraining mechanism for higher-risk Clients, higher caps, organizational or sponsored grants, or agentic workloads.

## 9. API Enforcement

For each request, the Provider MUST:

1. validate token signature, issuer, expiry, audience, Client binding, and scope;
2. resolve `delegation_id`;
3. validate grant and funding-source status;
4. validate the Beneficiary, model, operation, and per-request policy;
5. check grant and funding-source availability against the ledger;
6. reserve or debit usage atomically;
7. execute only within the authorized envelope; and
8. settle actual usage.

The Client MUST implement its own session security, authorization, and rate limiting. Provider enforcement does not make an unauthenticated Client proxy safe.

## 10. Usage Status

The Provider MUST expose the Client's grant-specific usage state without revealing unrelated subscription or Sponsor information.

Illustrative endpoint:

```text
GET https://api.provider.example/v1/abds/delegations/{delegation_id}/usage
Authorization: Bearer {execution_token}
```

Illustrative response:

```json
{
  "delegation_id": "del_abc123",
  "unit_type": "provider_ai_unit",
  "quota_cap": 100,
  "quota_used": 47,
  "quota_remaining": 53,
  "quota_period": "monthly",
  "quota_reset": "2026-08-01T00:00:00Z",
  "status": "active",
  "funding_display": {
    "type": "sponsor_budget",
    "name": "Green Earth Foundation"
  }
}
```

The Provider MUST authenticate and authorize access to this endpoint, bind the caller to the grant, and prevent cross-grant enumeration.

The response is a point-in-time view. Enforcement remains authoritative at execution time.

## 11. Reservation and Settlement

Providers SHOULD support reservation and settlement for streaming, multimodal, batch, or agentic operations with material variable cost:

```text
Estimate -> Reserve -> Execute -> Settle -> Release
```

The Provider MUST define:

- reservation expiry,
- partial completion,
- cancellation,
- retry and idempotency behavior,
- tool-call or step limits,
- settlement after provider failure, and
- release of unused reserved units.

## 12. Revocation and Funding Changes

The Resource User MUST be able to revoke the Client's grant.

The Economic Authorizer MUST be able to reduce or terminate future funding.

The Provider MUST be able to suspend abusive Clients, grants, or funding programs.

After revocation, subsequent calls referencing the grant MUST fail.

The following changes require renewed consent from affected parties:

- a higher cap,
- broader model or operation access,
- paid overage,
- a new Funding Principal,
- broader Sponsor data visibility, or
- a material extension beyond a disclosed program end.

## 13. No Silent Payer Substitution

If the authorized funding source is unavailable, exhausted, expired, or revoked, the Provider and Client MUST NOT silently charge another party.

The request MUST:

- stop,
- use another already-authorized funding source, or
- obtain fresh authorization from the new Funding Principal and Resource User.

This includes prohibiting silent fallback from Sponsor funding to the user's subscription or the developer's API account.

## 14. Privacy

The Client MUST NOT receive:

- the user's complete provider plan,
- total provider usage,
- other app grants,
- payment method,
- unrelated billing state,
- the Sponsor's confidential pool balance, or
- provider risk signals beyond what is required for recovery.

A Sponsor SHOULD receive aggregate program usage by default. Funding does not authorize access to prompts, outputs, conversation history, uploaded files, or user identity.

Broader data access requires separate, purpose-specific authorization and an independent legal basis.

## 15. Security

Providers MUST:

- follow current OAuth security best practice,
- require exact redirect URI matching,
- require PKCE for public clients,
- enforce short token lifetimes,
- validate audience and Client binding,
- keep quota and funding state provider-side,
- atomically enforce caps,
- implement immediate revocation,
- log usage by `delegation_id`,
- prevent cross-grant usage introspection,
- apply per-Client and per-grant rate limits, and
- detect abusive aggregation and quota laundering.

Providers SHOULD use:

- PAR for sensitive or high-value authorization,
- DPoP or mTLS for high-risk grants,
- app verification,
- consent receipts,
- anomaly detection,
- program circuit breakers, and
- privacy-preserving sponsor reports.

See `THREAT_MODEL.md` and `SPONSORED_DELEGATION.md`.

## 16. Provider Discovery

Providers SHOULD advertise:

- supported ABDS versions and profiles,
- endpoints,
- authorization-details type,
- funding-source types,
- supported unit types and periods,
- model and operation scoping,
- reservation support,
- sponsor-program support,
- sender-constrained token support, and
- app verification requirements.

See `DISCOVERY.md`.

## 17. Error Registry

| Code | HTTP | Meaning |
|---|---:|---|
| `abds_invalid_delegation` | 403 | Grant cannot be used for this Client, Beneficiary, audience, or resource |
| `abds_token_expired` | 401 | Execution Token expired |
| `abds_token_revoked` | 401 | Token or underlying grant revoked |
| `abds_model_not_scoped` | 403 | Requested model not permitted |
| `abds_operation_not_scoped` | 403 | Requested operation not permitted |
| `abds_per_request_cap_exceeded` | 429 | Request exceeds its maximum resource envelope |
| `abds_quota_exceeded` | 429 | Per-grant or per-Beneficiary cap exhausted |
| `abds_funding_unavailable` | 403 | Authorized funding cannot cover the request |
| `abds_sponsorship_ended` | 403 | Sponsorship Program ended or was revoked |
| `abds_subscription_lapsed` | 403 | Required user entitlement is no longer active |
| `abds_reservation_required` | 409 | Request requires a reservation |
| `abds_reservation_expired` | 409 | Reservation no longer valid |

Client-facing errors MUST NOT disclose confidential balances, unrelated grants, or internal risk decisions.

## 18. Implementation Profiles

ABDS defines:

- Basic,
- Standard,
- Advanced / Enterprise, and
- Sponsored Funding profiles.

These are implementation maturity profiles, not conformance badges until test vectors and a conformance suite exist.

See `IMPLEMENTATION_PROFILES.md`.

## 19. Versioning

This specification is v0.4 Draft.

### Changelog

**v0.4** - Generalized ABDS to payer-neutral funding; added Funding Principal, Economic Authorizer, Beneficiary, and funding-source types; added sponsored funding; replaced custom economic query parameters with OAuth Rich Authorization Request guidance; separated grant policy from ledger usage; added no-silent-payer-substitution and sponsor-privacy requirements; expanded errors.

**v0.3** - Added OAuth terminology alignment, PKCE, provider discovery, implementation profiles, `delegation_id` clarification, and stronger security considerations.

**v0.2** - Removed mutable quota state from Execution Tokens and introduced the four-object model, provider-side grant, Usage Ledger, and Usage Introspection.

**v0.1** - Initial draft.

## 20. Standards References

- [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
- [RFC 7636 - Proof Key for Code Exchange](https://www.rfc-editor.org/rfc/rfc7636)
- [RFC 8414 - OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414)
- [RFC 8693 - OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693)
- [RFC 8707 - Resource Indicators for OAuth 2.0](https://www.rfc-editor.org/rfc/rfc8707)
- [RFC 9126 - OAuth 2.0 Pushed Authorization Requests](https://www.rfc-editor.org/rfc/rfc9126)
- [RFC 9396 - OAuth 2.0 Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396)
- [RFC 9449 - OAuth 2.0 Demonstrating Proof of Possession](https://www.rfc-editor.org/rfc/rfc9449)
- [RFC 9700 - Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700)

---

Feedback and contributions are welcome through GitHub Issues and Pull Requests.
