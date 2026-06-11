# ABDS Technical Specification v0.3 (Draft)

## Abstract

This document specifies the AI Billing Delegation Standard (ABDS), an OAuth-aligned delegation profile that lets users authorize bounded third-party consumption of provider-defined AI resource units, enforced by the AI provider through grant records, short-lived execution tokens, usage ledgers, revocation controls, and explicit economic consent.

ABDS does not define a new authentication protocol. It profiles and extends existing OAuth patterns with AI-specific resource-delegation semantics, a provider-side delegated grant model, and provider-authoritative usage accounting.

## 1. Motivation

Consumer AI applications face a structural billing problem:

- AI provider API costs are usually billed to the developer, not the end user.
- No common mechanism exists for a user to authorize bounded AI resource consumption from their own provider account or subscription.
- BYOK (Bring Your Own Key) is not viable for mainstream non-technical consumers.
- Developers must either absorb costs, create internal credit systems, or avoid launching usage-heavy consumer AI features.

This creates a barrier to consumer AI app development that does not exist in comparable ecosystems where users can authorize scoped third-party access to account-linked services.

**Scope clarification:** Under ABDS, the developer does not pay the AI provider inference cost for calls authorized by an active user delegation. The developer remains responsible for application infrastructure, backend proxy operation, storage, orchestration, monitoring, support, abuse prevention, and any model usage not covered by an active user delegation.

## 2. Terminology

| Term | Definition |
|---|---|
| **AI Provider** | Entity offering AI inference via API. In OAuth terms, the provider may operate the Authorization Server and Resource Server. |
| **Authorization Server** | OAuth server that authenticates the user, obtains consent, issues authorization codes, and issues tokens. |
| **Resource Server** | AI API endpoint or gateway that validates execution tokens and enforces provider-side grant and ledger state. |
| **Delegating User** | A user or subscriber who authorizes bounded AI resource delegation to an app. |
| **Consumer Application / Client** | A registered third-party app requesting delegated AI resource access. |
| **User Subscription Entitlement** | The user's underlying provider account, subscription, plan, or resource entitlement. |
| **Delegated AI Grant** | Provider-maintained server-side record authorizing bounded AI resource consumption by a Consumer Application. |
| **Execution Token** | Short-lived OAuth access token or JWT referencing a `delegation_id`, used to authenticate AI API calls. |
| **Usage Ledger** | Provider-authoritative record of usage consumed against a Delegated AI Grant. |
| **Quota Cap** | User-approved or provider-approved ceiling on delegated AI resource consumption. |
| **delegation_id** | Public ABDS reference identifier used in execution tokens, introspection endpoints, logs, and revocation events. |
| **grant_id** | Optional provider-internal identifier for an implementation-specific grant record. |

## 3. Protocol Overview

ABDS follows the OAuth 2.0 Authorization Code Flow with AI-specific extensions and constraints:

- New scope definitions prefixed with `ai.quota.*`
- Authorization Code Flow with PKCE for public clients
- Delegated AI Grant object maintained server-side by the provider
- Short-lived Execution Tokens that reference the grant by `delegation_id`
- Usage Introspection endpoint for provider-authoritative quota state
- Revocation endpoint and connected-apps revocation requirement
- Optional OAuth Token Exchange profile for downstream execution-token issuance
- Optional Resource Indicators to bind tokens to the target AI resource server

### 3.1 Core Object Model

ABDS separates quota delegation into four distinct objects. This separation is mandatory. Implementations that embed live quota state inside bearer tokens are not ABDS-compatible.

```text
User Subscription Entitlement
        ↓ authorizes creation of
Delegated AI Grant  (server-side, provider-maintained)
        ↓ referenced by
Short-lived Execution Token  (contains delegation_id as the public grant reference)
        ↓ consumption recorded in
Provider-side Usage Ledger  (authoritative source of quota truth)
```

The Execution Token identifies the delegation. It does not carry live quota state, quota limits, quota reset timing, or remaining quota information. All quota accounting is performed by the provider against the server-side grant record and ledger. The Usage Introspection endpoint is the authoritative interface for delegated usage state exposed to Consumer Applications.

## 3.2 Delegated AI Grant Object

The provider MUST maintain a server-side grant record for every active delegation. This record is the source of truth for quota enforcement, not the token.

### Grant Record Schema

| Field | Type | Description |
|---|---|---|
| `delegation_id` | string | Stable public ABDS reference included in Execution Tokens |
| `grant_id` | string | Optional provider-internal unique identifier |
| `user_id` | string | Provider-side delegating user identifier |
| `app_client_id` | string | Consumer Application registered client ID |
| `quota_cap` | integer | User-approved or provider-approved maximum delegated resource units |
| `quota_used` | integer | Current consumption, updated by provider ledger |
| `quota_period` | string | `daily`, `weekly`, `monthly`, or provider-defined period |
| `quota_reset` | ISO 8601 | Next quota reset timestamp |
| `model_scope` | array | Permitted models or model families, or null for all eligible subscription models |
| `status` | enum | `active`, `revoked`, `exhausted`, `expired` |
| `created_at` | ISO 8601 | Grant creation timestamp |
| `updated_at` | ISO 8601 | Last ledger update timestamp |

### Grant Lifecycle

```text
created (on user consent) → active → exhausted (quota_used >= quota_cap)
                                   → revoked   (user or provider action)
                                   → expired   (subscription lapsed or grant expiry)
```

Providers MUST transition grant status atomically. Concurrent requests that arrive while a grant is transitioning to `exhausted` MUST be rejected with `abds_quota_exceeded`.

## 4. Authorization Request

The Consumer Application initiates the flow by redirecting the user to the AI Provider's authorization endpoint.

```text
GET https://auth.{provider}.com/oauth/authorize
  ?response_type=code
  &client_id={app_client_id}
  &redirect_uri={app_redirect_uri}
  &scope=ai.quota.delegate ai.quota.read
  &quota_cap=100
  &quota_period=monthly
  &state={csrf_token}
  &code_challenge={pkce_challenge}
  &code_challenge_method=S256
```

### Parameters

| Parameter | Required | Description |
|---|---:|---|
| `scope` | Yes | Must include `ai.quota.delegate` at minimum |
| `quota_cap` | No | Requested cap; user or provider may lower it |
| `quota_period` | No | `daily`, `weekly`, `monthly`, or provider-defined period |
| `model_scope` | No | Comma-separated list of permitted models or model families |
| `state` | Yes | CSRF protection and client state |
| `code_challenge` | Required for public clients | PKCE code challenge |
| `code_challenge_method` | Required for public clients | SHOULD be `S256` |

Public clients MUST use PKCE. Confidential clients SHOULD use PKCE unless the provider has an equivalent or stronger authorization-code injection defense.

## 5. Consent Screen Requirements

The AI Provider MUST display a consent screen showing:

- The verified name of the Consumer Application
- The developer or organization identity where available
- The quota amount being requested
- The quota period
- The models or model families the app may access, if scoped
- A field or control allowing the user or provider to lower the requested cap
- Clear revocation instructions
- A link to the user's Connected Apps management page
- Warnings for unverified or higher-risk apps where applicable

Consent MUST describe the economic effect of approval. It should not be framed as generic account access only.

## 6. Execution Token Claims

The Execution Token MUST include standard OAuth claims and an ABDS `delegation_id` reference. It MUST NOT include live quota state or quota-limit metadata.

Example:

```json
{
  "sub": "user_id",
  "aud": "https://api.provider.example",
  "iss": "https://auth.provider.example",
  "iat": 1700000000,
  "exp": 1700000900,
  "scope": "ai.quota.delegate ai.quota.read",
  "client_id": "consumer_app_client_id",
  "delegation_id": "del_abc123",
  "model_scope": ["model-family-small", "model-family-standard"],
  "abds_version": "0.3",
  "jti": "tok_xyz789"
}
```

**Note:** `quota_used`, `quota_remaining`, `quota_cap`, `quota_period`, and `quota_reset` MUST NOT appear in the Execution Token. Quota state, quota limits, quota periods, and quota reset times are provider-authoritative and accessed via the Usage Introspection Endpoint. Embedding quota metadata in a bearer token creates staleness, replay, and consistency vulnerabilities.

## 7. Execution Token Issuance

Providers MAY issue execution tokens directly after authorization-code exchange.

Providers SHOULD consider OAuth Token Exchange for architectures where an application first receives a standard OAuth access token and later exchanges it for a short-lived AI execution token bound to a specific AI resource server.

Execution tokens SHOULD be short-lived. Providers MAY require sender-constrained tokens, DPoP, mTLS, or equivalent mechanisms for higher-risk, higher-cap, or enterprise delegations.

## 8. API Call Authentication

The Consumer Application authenticates AI API calls using the Execution Token.

```text
POST https://api.{provider}.com/v1/messages
Authorization: Bearer {execution_token}
Content-Type: application/json
```

The provider MUST:

- Validate the Execution Token signature and expiry
- Verify the token audience is valid for the AI Resource Server
- Resolve the `delegation_id` to the server-side Delegated AI Grant
- Verify grant status is `active`
- Check `quota_used < quota_cap` against the Usage Ledger
- Enforce model scope
- Atomically record usage in the ledger
- Return `HTTP 429` when the delegated cap is reached

## 9. Usage Introspection Endpoint

This endpoint is REQUIRED for ABDS implementations. It MUST reflect provider-authoritative ledger state, not token claim values.

Recommended endpoint shape:

```text
GET https://api.{provider}.com/v1/abds/delegations/{delegation_id}/usage
Authorization: Bearer {execution_token}
```

Response:

```json
{
  "delegation_id": "del_abc123",
  "quota_cap": 100,
  "quota_used": 47,
  "quota_remaining": 53,
  "quota_period": "monthly",
  "quota_reset": "2024-12-01T00:00:00Z",
  "status": "active"
}
```

Consumer Applications SHOULD query this endpoint before initiating expensive, streaming, multimodal, or agentic calls. The response represents ledger state at the time of the request and is authoritative for enforcement purposes.

## 10. Revocation

Users MUST be able to revoke delegation at any time via the provider's account settings or Connected Apps interface. Providers MUST expose a revocation mechanism.

OAuth token revocation MAY be used for token revocation:

```text
POST https://auth.{provider}.com/oauth/revoke
  token={execution_token}
  token_type_hint=access_token
```

ABDS implementations MUST also invalidate or transition the underlying Delegated AI Grant when the user revokes the delegation.

On revocation:

- The Grant Record status MUST transition to `revoked` immediately
- All subsequent API calls referencing that `delegation_id` MUST fail
- The provider SHOULD surface revoked grants in the user's Connected Apps page for a provider-defined audit period
- Consumer Applications MUST gracefully handle revocation by presenting a reauthorization prompt rather than failing silently

## 11. Security Considerations

- Quota enforcement MUST be performed server-side by the provider against the Usage Ledger.
- Client-side quota enforcement is explicitly insufficient.
- Providers MUST log quota consumption events against the `delegation_id`.
- Providers MUST enforce `quota_cap` atomically to prevent race-condition overruns.
- Token expiry MUST be enforced independently of quota exhaustion.
- Public clients MUST use PKCE.
- Consumer Applications SHOULD use backend-mediated token handling for delegated quota flows with meaningful economic value.
- Providers MAY require backend proxying, sender-constrained tokens, DPoP, mTLS, PAR, or additional app verification for high-risk delegations.
- Providers SHOULD implement anomaly detection on delegation patterns.
- Consumer Applications MUST implement rate limiting independent of provider enforcement.

## 12. Provider Discovery

ABDS providers SHOULD publish provider capability metadata either as OAuth Authorization Server Metadata extensions or through a registered ABDS-specific metadata document.

See `DISCOVERY.md` for the draft discovery proposal.

## 13. Implementation Profiles

ABDS defines staged implementation profiles to support partial adoption:

- Basic Implementation Profile
- Standard Implementation Profile
- Advanced / Enterprise Implementation Profile

These profiles are not formal conformance badges until a test suite exists.

See `IMPLEMENTATION_PROFILES.md`.

## 14. Error Codes

| Code | HTTP Status | Description |
|---|---:|---|
| `abds_quota_exceeded` | 429 | Delegated quota cap reached |
| `abds_token_revoked` | 401 | User or provider has revoked the delegation |
| `abds_model_not_scoped` | 403 | Requested model is not permitted by `model_scope` |
| `abds_subscription_lapsed` | 402 | User's underlying subscription or entitlement has expired |
| `abds_grant_not_found` | 404 | `delegation_id` references a grant that does not exist or has been purged |
| `abds_grant_exhausted` | 429 | Grant status is exhausted for the current period |
| `abds_token_expired` | 401 | Execution Token has expired |
| `abds_invalid_delegation` | 403 | Delegation exists but cannot be used for the requested resource |

## 15. Versioning

This specification is version 0.3 (Draft). Breaking changes will increment the major version. Additive changes will increment the minor version. Implementers should check the `abds_version` claim in tokens and provider discovery metadata.

### Changelog

**v0.3** — Added OAuth terminology alignment, PKCE requirement for public clients, optional Token Exchange and Resource Indicators guidance, `delegation_id` identifier clarification, revised client-side token handling language, provider discovery reference, implementation profiles reference, and stronger security considerations. Incorporates review input from Claude and Gemini contributions.

**v0.2** — Removed quota metadata from Execution Token claims. Added Core Object Model. Added Delegated Grant Object specification. Added scope clarification for developer responsibilities. Renamed quota endpoint to Usage Introspection and marked REQUIRED. Expanded error code registry. Incorporated feedback from Claude and GPT technical reviews in `AI_CONTRIBUTIONS/`.

**v0.1** — Initial draft.

---

*Feedback and contributions welcome via GitHub Issues and Pull Requests.*
