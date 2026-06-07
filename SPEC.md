# ABDS Technical Specification v0.1 (Draft)

## Abstract

This document specifies the AI Billing Delegation Standard (ABDS), an extension to OAuth 2.0 that enables end users to authorize third-party applications to consume AI inference quota from the user's existing subscription with an AI provider. ABDS requires no new authentication infrastructure — it extends the proven OAuth 2.0 Authorization Code Flow with AI-specific scope and token claim definitions.

## 1. Motivation

Consumer AI applications face a structural billing problem with no current solution:

- AI provider API costs are billed to the developer, not the end user
- No mechanism exists for a user to authorize quota consumption from their own subscription
- BYOK (Bring Your Own Key) is not viable for non-technical consumers
- Developers must either absorb all costs or implement custom credit/paywall systems

This creates a structural barrier to consumer AI app development that does not exist in comparable ecosystems (music streaming, mapping, cloud storage) where OAuth-based quota delegation is standard.

## 2. Terminology

| Term | Definition |
|------|------------|
| **AI Provider** | An entity offering AI inference via API (e.g. Anthropic, OpenAI, Google) |
| **Delegating User** | A subscriber who authorizes quota delegation to an app |
| **Consumer Application** | A registered third-party app requesting delegation |
| **Delegation Token** | A scoped OAuth bearer token authorizing quota consumption |
| **Quota** | The inference capacity included in a user's subscription plan |
| **Quota Cap** | A user-defined ceiling on how much quota an app may consume |

## 3. Protocol Overview

ABDS follows the OAuth 2.0 Authorization Code Flow (RFC 6749) with the following extensions:

- New scope definitions prefixed with `ai.quota.*`
- Extended JWT claims for quota metadata
- A quota reporting endpoint requirement for providers
- A revocation endpoint requirement for providers

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

## 6. Delegation Token Claims

The delegation token JWT MUST include:

```json
{
  "sub": "user_id",
  "aud": "consumer_app_client_id",
  "iss": "https://auth.provider.com",
  "iat": 1700000000,
  "exp": 1702592000,
  "ai_provider": "anthropic",
  "quota_cap": 100,
  "quota_used": 0,
  "quota_period": "monthly",
  "quota_reset": "2024-12-01T00:00:00Z",
  "model_scope": ["claude-3-haiku", "claude-3-sonnet"],
  "delegation_id": "del_abc123"
}
```

## 7. API Call Authentication

The Consumer Application authenticates API calls using the delegation token as a Bearer token:

```
POST https://api.{provider}.com/v1/messages
Authorization: Bearer {delegation_token}
Content-Type: application/json
```

The provider MUST:
- Validate the delegation token
- Check quota_cap has not been exceeded
- Decrement quota_used on the user's subscription
- Return `HTTP 429` with `X-ABDS-Quota-Exceeded: true` when cap is reached

## 8. Quota Reporting Endpoint

Providers MUST expose:

```
GET https://api.{provider}.com/v1/quota
Authorization: Bearer {delegation_token}
```

Response:

```json
{
  "quota_cap": 100,
  "quota_used": 47,
  "quota_remaining": 53,
  "quota_period": "monthly",
  "quota_reset": "2024-12-01T00:00:00Z"
}
```

## 9. Revocation

Users MUST be able to revoke delegation at any time via the provider's account settings. Providers MUST expose a revocation endpoint:

```
POST https://auth.{provider}.com/oauth/revoke
  token={delegation_token}
  token_type_hint=access_token
```

Consumer Applications MUST gracefully handle revocation by presenting the user with a re-authorization prompt rather than failing silently.

## 10. Security Considerations

- Delegation tokens MUST NOT be stored client-side in mobile applications
- All quota cap adjustments MUST be user-initiated on the provider's consent screen
- Providers MUST log all quota consumption events against the delegation_id
- Providers MUST enforce quota_cap server-side — client-side enforcement is insufficient
- Token expiry MUST be enforced independently of quota exhaustion

## 11. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `abds_quota_exceeded` | 429 | User's delegated quota cap reached |
| `abds_token_revoked` | 401 | User has revoked delegation |
| `abds_model_not_scoped` | 403 | Requested model not in model_scope |
| `abds_subscription_lapsed` | 402 | User's subscription has expired |

## 12. Versioning

This specification is version 0.1 (Draft). Breaking changes will increment the major version. Additive changes will increment the minor version. Implementers should check the `abds_version` claim in tokens.

---

*Feedback and contributions welcome via [GitHub Issues](../../issues) and [Pull Requests](../../pulls).*
