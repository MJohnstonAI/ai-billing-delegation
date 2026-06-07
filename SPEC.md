# ABDS Technical Specification v0.2 (Draft)

## Abstract

This document specifies the AI Billing Delegation Standard (ABDS), an OAuth-based delegation profile that lets users authorize bounded third-party consumption of provider-defined AI resource units, enforced by the AI provider through grant records, short-lived execution tokens, usage ledgers, revocation controls, and explicit economic consent.

ABDS requires no new authentication infrastructure — it extends the proven OAuth 2.0 Authorization Code Flow with AI-specific scope definitions, a delegated grant object model, and provider-side usage ledger requirements.

## 1. Motivation

Consumer AI applications face a structural billing problem with no current solution:

- AI provider API costs are billed to the developer, not the end user
- No mechanism exists for a user to authorize quota consumption from their own subscription
- BYOK (Bring Your Own Key) is not viable for non-technical consumers
- Developers must either absorb all costs or implement custom credit/paywall systems

This creates a structural barrier to consumer AI app development that does not exist in comparable ecosystems (music streaming, mapping, cloud storage) where OAuth-based quota delegation is standard.

**Scope clarification:** Under ABDS, the developer does not pay the AI provider's inference cost for calls authorized by an active user delegation. The developer remains responsible for application infrastructure, backend proxy operation, storage, orchestration, monitoring, support, abuse prevention, and any model usage not covered by an active user delegation.

## 2. Terminology

| Term | Definition |
|------|------------|
| **AI Provider** | An entity offering AI inference via API (e.g. Anthropic, OpenAI, Google) |
| **Delegating User** | A subscriber who authorizes quota delegation to an app |
| **Consumer Application** | A registered third-party app requesting delegation |
| **Delegated Grant** | A server-side record maintained by the provider authorizing bounded quota consumption |
| **Execution Token** | A short-lived JWT referencing a Delegated Grant, used to authenticate individual API calls |
| **Quota** | The inference capacity included in a user's subscription plan |
| **Quota Cap** | A user-defined ceiling on how much quota an app may consume |
| **Usage Ledger** | The provider-authoritative record of quota consumed against a Delegated Grant |

## 3. Protocol Overview

ABDS follows the OAuth 2.0 Authorization Code Flow (RFC 6749) with the following extensions:

- New scope definitions prefixed with `ai.quota.*`
- A Delegated Grant object maintained server-side by the provider
- Short-lived Execution Tokens that reference the grant by `delegation_id`
- A mandatory Usage Introspection endpoint for quota state
- A revocation endpoint requirement for providers

### Core Object Model

ABDS separates quota delegation into four distinct objects. This separation is mandatory — implementations that embed live quota state inside bearer tokens are non-compliant.

```
User Subscription Entitlement
        ↓ authorizes creation of
Delegated AI Grant  (server-side, provider-maintained)
        ↓ referenced by
Short-lived Execution Token  (JWT, contains delegation_id only)
        ↓ consumption recorded in
Provider-side Usage Ledger  (authoritative source of quota truth)
```

The Execution Token identifies the grant. It does not carry live quota state. All quota accounting is performed by the provider against the server-side grant record and ledger. The `/v1/quota` introspection endpoint is the only authoritative source of quota consumption data.

## 3b. Delegated Grant Object

The provider MUST maintain a server-side grant record for every active delegation. This record is the source of truth for quota enforcement — not the token.

### Grant Record Schema

| Field | Type | Description |
|-------|------|-------------|
| `grant_id` | string | Provider-assigned unique identifier |
| `delegation_id` | string | Stable reference included in Execution Tokens |
| `user_id` | string | The delegating user's identifier |
| `app_client_id` | string | The Consumer Application's registered client ID |
| `quota_cap` | integer | User-approved maximum quota units |
| `quota_used` | integer | Current consumption — updated by provider ledger |
| `quota_period` | string | `daily`, `weekly`, or `monthly` |
| `quota_reset` | ISO 8601 | Next quota reset timestamp |
| `model_scope` | array | Permitted models, or null for all subscription models |
| `status` | enum | `active`, `revoked`, `exhausted`, `expired` |
| `created_at` | ISO 8601 | Grant creation timestamp |
| `updated_at` | ISO 8601 | Last ledger update timestamp |

### Grant Lifecycle

```
created (on user consent) → active → exhausted (quota_used >= quota_cap)
                                   → revoked   (user or provider action)
                                   → expired   (subscription lapsed)
```

Providers MUST transition grant status atomically. Concurrent requests that arrive while a grant is transitioning to `exhausted` MUST be rejected with `abds_quota_exceeded`.

## 4. Authorization Request

The Consumer Application initiates the flow by redirecting the user to the AI Provider's authorization endpoint:

```
GET https://auth.{provider}.com/oauth/authorize
  ?response_type=code
  &client_id={app_client_id}
  &redirect_uri={app_redirect_uri}
  &scope=ai.quota.delegate ai.quota.read
  &quota_cap=100
  &quota_period=monthly
  &state={csrf_token}
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `scope` | Yes | Must include `ai.quota.delegate` at minimum |
| `quota_cap` | No | Requested cap (user may override on consent screen) |
| `quota_period` | No | `daily`, `weekly`, or `monthly` (default: `monthly`) |
| `model_scope` | No | Comma-separated list of permitted models |

## 5. Consent Screen Requirements

The AI Provider MUST display a consent screen showing:

- The name and logo of the Consumer Application
- The quota amount being requested
- The quota period
- The models the app may access (if scoped)
- A field allowing the user to adjust the cap downward
- Clear revocation instructions
- A link to the user's Connected Apps management page

## 6. Execution Token Claims

The Execution Token JWT MUST include:

```json
{
  "sub": "user_id",
  "aud": "consumer_app_client_id",
  "iss": "https://auth.provider.com",
  "iat": 1700000000,
  "exp": 1702592000,
  "ai_provider": "anthropic",
  "delegation_id": "del_abc123",
  "quota_cap": 100,
  "quota_period": "monthly",
  "quota_reset": "2024-12-01T00:00:00Z",
  "model_scope": ["claude-3-haiku", "claude-3-sonnet"]
}
```

**Note:** `quota_used` MUST NOT appear in the Execution Token. Live quota state is provider-authoritative and accessed via the Usage Introspection Endpoint (Section 8). Embedding mutable quota state in a bearer token creates staleness, replay, and consistency vulnerabilities.

## 7. API Call Authentication

The Consumer Application authenticates API calls using the Execution Token as a Bearer token:

```
POST https://api.{provider}.com/v1/messages
Authorization: Bearer {execution_token}
Content-Type: application/json
```

The provider MUST:
- Validate the Execution Token signature and expiry
- Resolve the `delegation_id` to the server-side Grant Record
- Verify grant status is `active`
- Check `quota_used < quota_cap` against the Usage Ledger (not token claims)
- Atomically increment `quota_used` in the ledger before fulfilling the request
- Return `HTTP 429` with `X-ABDS-Quota-Exceeded: true` when cap is reached

## 8. Usage Introspection Endpoint

**This endpoint is REQUIRED for all ABDS-compliant providers.** It MUST reflect provider-authoritative ledger state, not token claim values.

```
GET https://api.{provider}.com/v1/quota
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

Consumer Applications SHOULD query this endpoint before initiating expensive or streaming calls to confirm quota availability. The response represents ledger state at the time of the request and is authoritative for enforcement purposes.

## 9. Revocation

Users MUST be able to revoke delegation at any time via the provider's account settings. Providers MUST expose a revocation endpoint:

```
POST https://auth.{provider}.com/oauth/revoke
  token={execution_token}
  token_type_hint=access_token
```

On revocation:
- The Grant Record status MUST transition to `revoked` immediately
- All subsequent API calls referencing that `delegation_id` MUST return `abds_token_revoked`
- The provider MUST surface revoked grants in the user's Connected Apps page for 90 days

Consumer Applications MUST gracefully handle revocation by presenting the user with a re-authorization prompt rather than failing silently.

## 10. Security Considerations

- Execution Tokens MUST NOT be stored or used client-side in mobile applications
- All API calls MUST be proxied through the Consumer Application's backend server
- Quota enforcement MUST be performed server-side by the provider against the Usage Ledger
- Client-side quota enforcement is explicitly insufficient and non-compliant
- Providers MUST log all quota consumption events against the `delegation_id`
- Providers MUST enforce `quota_cap` atomically to prevent race condition overruns
- Token expiry MUST be enforced independently of quota exhaustion
- Providers SHOULD implement anomaly detection on delegation patterns (e.g. a single `delegation_id` receiving thousands of requests/minute)
- Consumer Applications MUST implement backend rate limiting independent of provider enforcement

## 11. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `abds_quota_exceeded` | 429 | User's delegated quota cap reached |
| `abds_token_revoked` | 401 | User has revoked delegation |
| `abds_model_not_scoped` | 403 | Requested model not in model_scope |
| `abds_subscription_lapsed` | 402 | User's subscription has expired |
| `abds_grant_not_found` | 404 | delegation_id references a grant that does not exist or has been purged |
| `abds_grant_exhausted` | 429 | Grant status is exhausted (quota_cap permanently reached for period) |
| `abds_token_expired` | 401 | Execution Token has expired — re-authenticate to obtain a new token |

## 12. Versioning

This specification is version 0.2 (Draft). Breaking changes will increment the major version. Additive changes will increment the minor version. Implementers should check the `abds_version` claim in tokens.

### Changelog

**v0.2** — Removed `quota_used` from Execution Token claims. Added Core Object Model (Section 3). Added Delegated Grant Object specification (Section 3b). Added scope clarification for developer responsibilities (Section 1). Renamed quota endpoint to Usage Introspection and marked REQUIRED (Section 8). Expanded error code registry (Section 11). Incorporates feedback from GPT-o3 technical review (AI_CONTRIBUTIONS/GPT/).

**v0.1** — Initial draft.

---

*Feedback and contributions welcome via [GitHub Issues](../../issues) and [Pull Requests](../../pulls).*
