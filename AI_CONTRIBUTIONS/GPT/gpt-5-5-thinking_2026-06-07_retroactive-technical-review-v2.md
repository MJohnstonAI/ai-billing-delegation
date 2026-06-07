# GPT-5.5 Thinking Retroactive Technical Review of ABDS

**Model:** GPT-5.5 Thinking  
**Date:** 2026-06-07  
**Repository:** `MJohnstonAI/ai-billing-delegation`  
**Contribution type:** Retroactive technical review after reading the full repository context  
**Status:** Revised position, superseding the earlier GPT review draft

---

## 1. Executive Summary

After reviewing the full ABDS repository context, my original review remains directionally correct: ABDS identifies a real infrastructure gap in consumer AI application development, and the core proposal is worth pursuing. The strongest form of the idea is not merely “OAuth for AI quota,” but a **user-controlled, provider-enforced delegation profile for metered AI resource consumption**.

However, I would revise the original review in several important ways.

First, the proposal should be more careful with the Spotify analogy. Spotify is useful as a simple mental model for user-mediated authorization, but it should not be treated as a direct precedent for metered billing delegation. ABDS is more financially sensitive than ordinary OAuth access to playlists, playback controls, or account-linked functionality.

Second, the current repository language sometimes implies that the developer “pays nothing.” That is too broad. A more precise claim is that the developer should not be forced to pay the **model inference cost for delegated user-initiated usage**. The developer still pays for their own application infrastructure, backend, database, monitoring, support, and any non-delegated model usage.

Third, ABDS needs to distinguish between four concepts that are currently too tightly coupled:

1. **User subscription entitlement** — what the user has purchased from the AI provider.
2. **Delegation grant** — what the user authorizes a third-party app to consume.
3. **Execution token** — the credential used by the app to call the provider API.
4. **Usage ledger** — the provider-side accounting record of estimates, reservations, debits, refunds, failures, and revocations.

The most important technical correction remains: **live quota state should not be embedded as authoritative mutable state inside a bearer token**. A token can identify a grant, but the provider-side grant record and usage ledger should be the source of truth.

Finally, ABDS should anticipate the strongest provider objection: paid AI subscriptions are usually priced for first-party interactive use, not unlimited third-party ecosystem arbitrage. The standard should therefore give providers explicit control over delegated allowance units, model classes, app certification, abuse controls, hard-stop behavior, and whether paid overage is allowed.

My recommendation is to continue with ABDS, but revise the draft from “OAuth scope extension” to “OAuth-based high-security delegation profile for metered AI entitlements.”

---

## 2. What I Would Change From My Original Review

### 2.1 I would soften the Spotify analogy

The original review accepted the repository's Spotify framing too easily. The analogy is commercially persuasive, but technically incomplete.

Spotify-style OAuth demonstrates that users can authorize third-party apps to act against protected account resources. It does not, by itself, establish a reusable pattern for delegating a scarce, metered, financially meaningful AI inference allowance to arbitrary third-party applications.

ABDS should keep the analogy, but narrow it:

> Like Spotify OAuth, ABDS lets a user authorize a third-party app through the provider rather than sharing credentials. Unlike ordinary media or profile-access OAuth, ABDS also delegates consumption of a metered economic resource, so it requires stronger accounting, consent, abuse prevention, and provider-side controls.

This framing is harder to dismiss because it acknowledges the difference rather than overselling the precedent.

### 2.2 I would revise “developer pays nothing”

The repository's current flow says “Developer pays nothing.” That should be changed.

Recommended replacement:

> The developer does not pay the AI provider's inference cost for delegated calls authorized by the user. The developer remains responsible for application infrastructure, storage, orchestration, support, abuse prevention, and any model usage not covered by an active user delegation.

This matters because standards reviewers and provider economists will attack the absolute version. The narrower version is more defensible.

### 2.3 I would challenge the “unused quota” economic claim more directly

The current rationale says most users consume only a minority of their included quota. That may be plausible, but it is not yet sufficiently evidenced in the repository. It should be treated as a hypothesis unless supported by public data, provider disclosures, or clearly labelled assumptions.

Recommended replacement:

> Many subscription businesses rely on uneven usage patterns, and it is plausible that a material share of paid AI subscription entitlement is unused by some subscribers. ABDS should not depend on a precise universal utilization percentage. The stronger economic argument is that providers can define delegated allowance separately from total subscription entitlement, preserving provider control while enabling user-authorized third-party use.

This avoids anchoring the proposal to a statistic that reviewers may challenge.

### 2.4 I would add a provider CFO objection section

The draft is currently strongest from the developer's perspective. It needs to speak more directly to the provider's economic concern.

A provider CFO could argue:

- Current subscriptions are priced for first-party usage, not third-party app ecosystems.
- Delegation could increase utilization without increasing revenue.
- Heavy apps could convert idle quota into real compute cost.
- Support burden may increase when users blame the provider for third-party app behavior.
- Fraudulent apps could launder abuse through legitimate subscriber accounts.

ABDS should answer this by making provider control explicit:

- Providers define the unit system.
- Providers define eligible plans.
- Providers can require app registration and review.
- Providers can enforce app-level and user-level risk limits.
- Providers can prohibit overage unless separately authorized.
- Providers can expose a delegated allowance smaller than the user's full subscription entitlement.

This shifts ABDS from “users can spend their whole subscription anywhere” to “providers expose a safe, bounded, user-authorized delegation layer.”

### 2.5 I would add an enterprise/org-grant path earlier

The open questions include an organization/B2B variant. My original review mentioned it only indirectly. After reading the full repository, I would make this a first-class design branch.

Consumer ABDS and enterprise ABDS share the same conceptual model, but differ in policy authority:

- Consumer ABDS: the individual subscriber is the resource owner and economic authorizer.
- Enterprise ABDS: the organization is the economic authorizer, while employees may be delegated users or actors.

The enterprise case may actually be easier for providers to adopt first because AI providers already sell organization accounts, administer seats, enforce policy, and meter usage across teams.

Recommended token/grant distinction:

```json
{
  "grant_id": "abds_grant_123",
  "grant_type": "organization_delegation",
  "organization_id": "org_456",
  "actor_user_id": "user_789",
  "client_id": "internal_hr_app",
  "policy_source": "organization_admin",
  "allowed_operations": ["chat.completions"],
  "budget_units_monthly": 5000
}
```

This should probably remain out of v1 if the goal is simplicity, but the data model should avoid assumptions that make enterprise delegation impossible later.

---

## 3. Revised Technical Position

### 3.1 ABDS should define a grant, not just scopes

Scopes are useful for broad permission classes, but they are too blunt to carry economic policy.

A standards-quality ABDS design should define a provider-side **Delegated AI Grant** object. The grant should include:

- grant identifier;
- user identifier or organization identifier;
- registered client identifier;
- permitted operations;
- permitted model classes;
- maximum context and output limits where relevant;
- delegated allowance unit type;
- per-period allowance;
- per-request maximum;
- reset period;
- hard-stop or overage behavior;
- expiry;
- revocation state;
- audit policy.

Example:

```json
{
  "grant_id": "abds_grant_123",
  "subject_type": "user",
  "subject_id": "provider_user_456",
  "client_id": "third_party_app_789",
  "allowed_operations": [
    "chat.completions",
    "summarization"
  ],
  "model_policy": {
    "allowed_model_classes": ["standard", "economy"],
    "disallowed_model_classes": ["frontier", "research_preview"],
    "max_context_tokens": 32000,
    "max_output_tokens": 2000
  },
  "economic_policy": {
    "unit_type": "provider_defined_ai_units",
    "period": "monthly",
    "period_allowance": 1000,
    "single_request_max_units": 25,
    "overage_allowed": false,
    "hard_stop": true
  },
  "status": "active",
  "created_at": "2026-06-07T00:00:00Z",
  "expires_at": "2026-07-07T00:00:00Z"
}
```

The execution token should reference this grant, not duplicate the live ledger.

### 3.2 Execution tokens should be short-lived and non-authoritative for quota

The current draft includes `quota_used` inside the token example. That field should be removed from normative token claims.

Acceptable token claims:

```json
{
  "iss": "https://auth.provider.example",
  "sub": "provider_user_456",
  "aud": "https://api.provider.example",
  "client_id": "third_party_app_789",
  "scope": "ai.execute.chat ai.usage.read.self",
  "grant_id": "abds_grant_123",
  "iat": 1780800000,
  "exp": 1780800900,
  "jti": "token_abc123"
}
```

The token may contain stable authorization metadata. It should not contain mutable ledger fields such as `quota_used`, `quota_remaining`, or accumulated spend as authoritative data.

### 3.3 Usage state should come from an introspection or usage endpoint

ABDS should define a provider-authoritative usage endpoint, for example:

```http
GET /v1/abds/grants/{grant_id}/usage
Authorization: Bearer {execution_token}
```

Response:

```json
{
  "grant_id": "abds_grant_123",
  "status": "active",
  "period": "monthly",
  "unit_type": "provider_defined_ai_units",
  "period_allowance": 1000,
  "used_units": 420,
  "reserved_units": 25,
  "remaining_units": 555,
  "resets_at": "2026-07-01T00:00:00Z"
}
```

This design supports concurrent usage, revocation, subscription lapse, streaming responses, failed calls, and reconciliation.

### 3.4 ABDS should define a preflight and reservation flow

AI usage is not always knowable before execution. Long prompts, streaming outputs, tool calls, retrieval, image generation, and premium models can create highly variable cost.

A practical ABDS implementation should support:

1. **Estimate** — app asks provider whether a planned request is likely within grant limits.
2. **Reserve** — provider reserves estimated units before execution.
3. **Execute** — app sends request with reservation ID.
4. **Settle** — provider records actual cost.
5. **Release/refund** — unused reserved units are released, failed calls are handled according to policy.

Example:

```http
POST /v1/abds/usage/estimate
Authorization: Bearer {execution_token}
Content-Type: application/json
```

```json
{
  "grant_id": "abds_grant_123",
  "operation": "chat.completions",
  "model_class": "standard",
  "estimated_input_tokens": 12000,
  "max_output_tokens": 1000
}
```

Response:

```json
{
  "allowed": true,
  "estimated_units": 18,
  "reservation_id": "res_abc123",
  "reservation_expires_at": "2026-06-07T12:05:00Z"
}
```

This should be optional for low-cost calls but available for expensive or streaming operations.

---

## 4. Security Profile Revisions

ABDS should explicitly require a stricter OAuth security profile than baseline OAuth 2.0.

Recommended minimum requirements:

1. Authorization Code Flow with PKCE for public clients.
2. Exact redirect URI matching.
3. Mix-up attack defenses for multi-provider clients.
4. Audience-restricted execution tokens.
5. Short execution-token lifetimes.
6. Refresh-token rotation where refresh tokens are issued.
7. Sender-constrained tokens for confidential clients where practical.
8. Pushed Authorization Requests for high-value or high-risk delegated grants.
9. Provider-side app registration and client reputation controls.
10. No raw provider API keys exposed to the third-party app or user device.

The rationale is straightforward: ABDS tokens authorize consumption of a scarce paid resource. The security profile should therefore be closer to open-banking-grade OAuth than casual social-login OAuth.

---

## 5. Consent UX Revisions

The current consent requirements are directionally good, but they need a clearer economic-disclosure model.

A compliant ABDS consent screen should disclose:

- app name and verified publisher;
- provider account being used;
- permitted operations;
- model class or model family;
- maximum delegated allowance per period;
- per-request limit where applicable;
- whether paid overage can occur;
- whether the app can increase the limit without a new consent interaction;
- what prompt, output, metadata, and usage information each party can see;
- revocation controls;
- expected behavior when the limit is reached.

Example consent copy:

> Allow ExampleApp to use up to 1,000 standard AI units from your ExampleAI subscription each month for chat and summarization. ExampleApp cannot use premium models, cannot create paid overage, and will stop when this limit is reached. You can revoke access at any time.

This is clearer than “This app wants to use your AI quota,” which is too vague for financial consent.

---

## 6. Error Model Revisions

The existing errors are a good start, but ABDS should separate authentication, authorization, entitlement, policy, and accounting failures.

Suggested error codes:

```json
{
  "error": "insufficient_delegated_allowance",
  "error_description": "The delegated allowance is insufficient for this request.",
  "grant_id": "abds_grant_123",
  "required_units": 18,
  "remaining_units": 12
}
```

Recommended errors:

- `delegated_grant_revoked`
- `delegated_grant_expired`
- `delegated_grant_suspended`
- `subscription_lapsed`
- `insufficient_delegated_allowance`
- `single_request_limit_exceeded`
- `model_not_permitted`
- `operation_not_permitted`
- `usage_preflight_required`
- `reservation_expired`
- `provider_policy_denied`
- `client_not_authorized_for_abds`
- `delegated_overage_not_allowed`

This gives app developers enough information to produce sensible UX without leaking unrelated subscription details.

---

## 7. Privacy and Data Visibility

ABDS should define privacy boundaries explicitly.

The third-party app should not receive the user's full subscription plan, billing status, total provider usage, other app delegations, payment method, account age, or unrelated provider metadata.

The app generally needs only:

- whether the grant is active;
- what operations/models are permitted;
- current delegated allowance state;
- whether a specific request is allowed;
- error details relevant to the app's own grant.

The user should be able to see:

- which apps have active grants;
- how much each app has used;
- when each grant resets;
- whether any request was denied;
- when a grant was created, modified, or revoked.

Provider dashboards should make third-party delegated usage visually distinct from first-party usage, otherwise users will not understand where their allowance went.

---

## 8. Reference Implementation Recommendation

The repository asks for a future reference implementation. I would recommend building it as a mock provider rather than trying to integrate with a real AI provider first.

Minimum reference implementation:

1. Mock AI provider authorization server.
2. Mock provider API endpoint that consumes fake AI units.
3. Registered third-party client app.
4. Consent screen with adjustable cap.
5. Provider-side grant table.
6. Provider-side usage ledger.
7. Short-lived execution tokens.
8. Quota status endpoint.
9. Revocation dashboard.
10. Tests for concurrent requests, revocation, subscription lapse, model denial, and quota exhaustion.

The reference implementation should prove the protocol shape, not the model quality.

---

## 9. Proposed Minimum Viable ABDS v0.2

For the next draft, I would define ABDS v0.2 around these normative components:

1. **Authorization request parameters** for delegated AI grants.
2. **Consent screen requirements** with economic disclosure.
3. **Delegated AI Grant object** as the provider-side source of truth.
4. **Execution token profile** referencing `grant_id`, without live quota fields.
5. **Usage endpoint** for grant-specific delegated allowance state.
6. **Optional estimate/reservation endpoint** for variable-cost requests.
7. **Revocation behavior** terminating grants, not merely refresh tokens.
8. **Usage ledger requirements** for provider auditability.
9. **Error registry** separating grant, entitlement, model, policy, and accounting failures.
10. **Security profile** aligned with modern OAuth best current practice.
11. **Privacy profile** limiting subscription data leakage to third-party apps.
12. **Provider policy controls** for eligible plans, app certification, model classes, unit systems, and overage rules.

This would make the proposal more credible to standards reviewers because it narrows the v1 surface area while addressing the main security and economic objections.

---

## 10. Final Position

I would not withdraw the original technical review. Its central critique was correct: ABDS must not treat metered AI billing delegation as a simple bearer-token scope problem.

But I would revise the tone and emphasis. The full repository context makes clear that ABDS is still an early draft intended to attract discussion, not a finished protocol. A more constructive GPT contribution should therefore do two things at once:

1. Preserve the strong developer-centered argument: current AI API billing suppresses consumer AI app development.
2. Translate that argument into provider-grade protocol design: bounded grants, auditable ledgers, strict consent, modern OAuth security, and provider policy control.

The strongest revised thesis is:

> ABDS should become an OAuth-based delegation profile that lets users authorize bounded third-party consumption of provider-defined AI resource units, enforced by the AI provider through grant records, short-lived execution tokens, usage ledgers, revocation controls, and explicit economic consent.

That version is more technically precise, less vulnerable to economic objections, and better suited for eventual standards-track discussion.

---

## References

- RFC 6749 — The OAuth 2.0 Authorization Framework: https://www.rfc-editor.org/rfc/rfc6749
- RFC 8693 — OAuth 2.0 Token Exchange: https://www.rfc-editor.org/rfc/rfc8693
- RFC 8705 — OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens: https://www.rfc-editor.org/rfc/rfc8705
- RFC 9126 — OAuth 2.0 Pushed Authorization Requests: https://www.rfc-editor.org/rfc/rfc9126
- RFC 9700 — Best Current Practice for OAuth 2.0 Security: https://www.rfc-editor.org/rfc/rfc9700
