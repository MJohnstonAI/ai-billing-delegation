# Claude Authorship Review — ABDS v0.1 to v0.2

**Model:** Claude Sonnet 4.6 (Anthropic)
**Date:** 2026-06-11
**Repository:** `MJohnstonAI/ai-billing-delegation`
**Contribution type:** Authorship self-review, gap analysis, and compliance
maturity model proposal
**Position:** I drafted the original ABDS v0.1 spec. This review acknowledges
what I got wrong, what GPT and Gemini improved, and what neither of them
addressed.

---

## 1. A Note on Authorship Bias

I helped draft this proposal. That creates a structural problem: I am
reviewing work I originated, which means I am inclined — even
unconsciously — to defend its framing rather than challenge it.

I want to name that bias explicitly before saying anything else. Reviewers
should weight my critique here with that limitation in mind. GPT and Gemini
reviewed this proposal without having drafted it. Their instinct to challenge
the framing was sharper than mine. Where their conclusions conflict with mine,
the default assumption should be that they are more likely to be right.

With that caveat stated, here is what I believe I got wrong, what the
subsequent reviews corrected, and what I believe still needs to be said.

---

## 2. What I Got Wrong in v0.1

### 2.1 The JWT quota_used error was significant, not minor

I included `quota_used` as a field in the execution token JWT example in
SPEC.md v0.1. GPT caught this in its review and it was corrected in v0.2.

I want to be clear about the severity of this error because it matters for
how the proposal should be evaluated.

Embedding live quota consumption state in a bearer token is not a
stylistic mistake. It is an architectural contradiction. JWTs are signed
at issuance and cannot be updated. A `quota_used: 0` claim in a token is
stale from the moment of the second API call. An attacker who intercepts or
caches a token with a stale `quota_used` value could use it to misrepresent
remaining quota to client-side code. A distributed system with millions of
concurrent delegated calls cannot rely on token claims for quota enforcement
under any circumstances.

This error appeared in the normative specification example. That is the
part of a spec that implementers copy. Had an AI provider engineer
implemented ABDS v0.1 directly from SPEC.md, they would have built a quota
enforcement model with a known consistency failure mode baked in.

GPT caught it. It is now fixed in v0.2. But reviewers should note that the
proposal required an independent AI review to catch a specification error of
this kind. That is a signal about the maturity of the draft, not just the
specific mistake.

### 2.2 "Developer pays nothing" was rhetorically convenient but imprecise

I used "Developer pays nothing" as a terminal point in the authorization
flow summary in the README. It is a compelling hook. It is also too broad
to survive technical or economic scrutiny.

GPT and Gemini both corrected this. The accurate claim is narrower:

> The developer does not pay the AI provider's inference cost for API calls
> made under an active, user-authorized delegated grant. The developer
> remains responsible for application infrastructure, backend proxy
> operation, storage, orchestration, monitoring, support, and abuse
> prevention.

The distinction matters for two audiences. Standards reviewers will flag
the absolute version as commercially naive. AI provider economists will use
it to dismiss the entire proposal without reading further. The precise
version is still a strong value proposition; it does not need to be
overstated.

### 2.3 I oversold the Spotify analogy without acknowledging its limits

The Spotify OAuth comparison is useful as an entry point for non-technical
readers. It should not have been presented as a direct architectural
precedent, because AI inference differs from music streaming in ways that
are materially relevant to protocol design:

- Music streams are priced at the provider level per subscription.
  AI inference tokens are variable per request, per model, and per output
  length.
- Music streaming OAuth delegates access to a fixed service.
  AI billing delegation authorizes consumption of a scarce, financially
  variable resource.
- Spotify has no meaningful abuse case where a delegated app can drain a
  user's subscription in a single API call.
  A single long-context AI call can consume a significant portion of a
  user's monthly allowance.

The analogy belongs in the proposal as a mental model for authorization
flow. It should not be treated as evidence that the billing delegation model
is straightforward to implement.

### 2.4 I did not account for the bootstrapping problem

Neither the original spec nor the subsequent AI reviews have addressed what
I now consider the most practically difficult problem for ABDS adoption:

**Users will not delegate quota to apps that don't exist yet. Apps will not
build on ABDS before providers implement it. Providers will not implement it
before developers demand it. Developers will not demand it before users
expect it.**

This is a classic multi-sided platform bootstrapping problem. The proposal
as written assumes that once a provider implements ABDS, developers will
adopt it and users will authorize it. That assumption is probably correct at
equilibrium. It does not address how to get there.

I do not have a complete solution to this. I raise it because the proposal
will be stronger if it acknowledges the problem and offers even a partial
framing of how the bootstrapping sequence could work.

One plausible path: the first provider to implement ABDS could bootstrap
the network by offering ABDS support to a small cohort of verified consumer
app developers under a beta program before general availability. This gives
developers something to build against, creates early demand signal from real
apps, and lets the provider refine the consent and ledger UX before full
public launch. If those apps demonstrate user willingness to authorize quota
delegation, it creates the evidence other providers need to justify their
own implementation investment.

---

## 3. What GPT and Gemini Resolved Well

I want to record what the subsequent reviews resolved, because the ABDS
project's multi-AI review record is part of its credibility argument and
that record should be accurate.

**GPT resolved:**
- The JWT quota_used architecture error (critical)
- The "developer pays nothing" framing (significant)
- The four-object model articulation (clarifying)
- The provider CFO objection framing (important for adoption)
- The enterprise/organization grant path (useful for completeness)
- The reservation/settlement flow for streaming (necessary for v0.3)

**Gemini resolved:**
- Full OAuth 2.0 standards alignment mapping (needed for credibility)
- Separation of token introspection from usage introspection (technically
  precise)
- Backend-for-Frontend token handling pattern for mobile apps (practical)
- High-throughput reference architecture with component breakdown
- Consent screen economic disclosure requirements (user protection)
- DPoP and proof-of-possession as risk-based hardening (security depth)
- MUST/SHOULD/MAY compliance tiers (standards-grade structure)
- Formal threat model table (necessary for provider security review)

Neither review is redundant. They addressed different layers of the same
problem. This is the correct outcome of a multi-model review process.

---

## 4. What Neither Review Addressed

### 4.1 Capability discovery

There is no mechanism in the current spec for a Consumer Application to
determine whether an AI provider supports ABDS before initiating an
authorization flow.

This matters because ABDS is proposed as a cross-provider standard. A
developer building an ABDS-compatible app needs to know at runtime which
providers a given user's subscription is associated with and whether that
provider has implemented ABDS.

The spec needs a provider capability discovery endpoint, consistent with
existing OAuth discovery conventions:

```http
GET https://auth.{provider}.com/.well-known/abds-configuration
```

Minimum response:

```json
{
  "abds_version": "0.2",
  "authorization_endpoint": "https://auth.provider.com/oauth/authorize",
  "token_endpoint": "https://auth.provider.com/oauth/token",
  "revocation_endpoint": "https://auth.provider.com/oauth/revoke",
  "usage_endpoint": "https://api.provider.com/v1/abds/grants/{grant_id}/usage",
  "supported_scopes": [
    "ai.quota.delegate",
    "ai.quota.read",
    "ai.quota.limit",
    "ai.quota.revoke"
  ],
  "supported_model_classes": ["economy", "standard"],
  "abds_compliance_tier": 1,
  "app_registration_required": true,
  "app_registration_url": "https://developer.provider.com/apps"
}
```

Without this, ABDS-compatible apps must hardcode provider-specific
endpoints, making the standard effectively provider-specific in practice.
A discovery document is the difference between a standard and a collection
of per-provider integrations.

### 4.2 Cross-provider session continuity

ABDS currently treats each provider delegation as independent. A user with
both a Claude Pro subscription and a ChatGPT Plus subscription who wants
to use either depending on availability, cost, or capability has no
mechanism within the ABDS framework to communicate that flexibility to a
Consumer Application.

This is not a v0.2 problem. But the spec should note it as a known
limitation and signal that cross-provider session routing is a v1.0
consideration. The four-object architecture should not make assumptions that
would prevent this from being added later.

### 4.3 The minimum viable ABDS provider question

Neither review answered this directly: what is the absolute minimum a
provider must implement to be described as ABDS-compliant?

This matters more than it might appear. A large AI provider has the
engineering resources to implement the full spec. A smaller provider or an
emerging model API does not. If the compliance bar is too high, only the
largest providers adopt it. If the bar is too low, the "standard" is
meaningless.

This is what I want to propose in Section 5.

---

## 5. Proposed Addition: ABDS Compliance Maturity Model

The most significant new content in this contribution is a three-tier
compliance maturity model.

The purpose is to give providers a gradual adoption path. ABDS should not
require a provider to implement the full specification before they can claim
any compliance. A provider that implements Tier 1 can participate in the
ecosystem and earn the ability to build toward Tier 2 and Tier 3 over time.

This model also separates what is standardised from what is
implementation-specific at each stage, which is what a standards body
would eventually need to define formally.

---

### Tier 1: ABDS Basic

**Who this targets:** Any AI provider willing to experiment with delegated
billing. Minimum viable implementation.

**Required capabilities:**

| Component | Requirement |
|-----------|-------------|
| Authorization flow | OAuth 2.0 Authorization Code Flow |
| Consent screen | Must display app name, quota cap, quota period, and revocation path |
| Delegated AI Grant | Provider must maintain a server-side grant record with `delegation_id`, `user_id`, `client_id`, `quota_cap`, `quota_period`, `status` |
| Execution token | JWT with `delegation_id` reference. MUST NOT contain `quota_used`, `quota_remaining`, or mutable quota fields |
| Usage introspection | GET endpoint returning `quota_cap`, `quota_used`, `quota_remaining`, `status`, `quota_reset` |
| Revocation | User can revoke delegation via provider account settings. Revocation takes effect immediately |
| Discovery | `.well-known/abds-configuration` endpoint with basic metadata |

**Security minimum:** HTTPS enforced. Redirect URI exact match. State
parameter required. No raw API keys exposed to client apps.

**What Tier 1 does not require:** PKCE, DPoP, PAR, model scoping,
reservation/settlement, organization grants, app verification tiers.

**Badge:** `ABDS-Basic v0.2 compliant`

---

### Tier 2: ABDS Standard

**Who this targets:** AI providers with established API platforms ready to
take delegated billing seriously.

**Required capabilities (in addition to Tier 1):**

| Component | Requirement |
|-----------|-------------|
| PKCE | Required for all public clients |
| Refresh token rotation | Required where refresh tokens are issued |
| Model scope | Execution tokens MUST carry `model_scope`. Providers MUST enforce model restrictions at the API gateway |
| App registration | Providers MUST maintain a registered app registry. Unverified apps MUST display a warning on the consent screen |
| Structured error codes | Full ABDS error registry required including `abds_grant_revoked`, `abds_quota_exceeded`, `abds_model_not_permitted`, `abds_subscription_lapsed`, `abds_grant_not_found` |
| Rate limiting | Per-delegation rate limiting required, independent of quota enforcement |
| Anomaly detection | Providers MUST implement basic velocity detection on delegated calls |
| User delegation dashboard | Users MUST be able to view all active delegations, usage per delegation, and revoke individual delegations |

**Security additions:** Short execution token lifetime required (maximum
15 minutes). Audience-restricted tokens required. `jti` claim required
for replay detection.

**Badge:** `ABDS-Standard v0.2 compliant`

---

### Tier 3: ABDS Enterprise

**Who this targets:** Major AI providers seeking full standards-track
compliance and enterprise readiness.

**Required capabilities (in addition to Tier 2):**

| Component | Requirement |
|-----------|-------------|
| DPoP | Required for high-quota or elevated model-class delegations |
| PAR | Pushed Authorization Requests required for enterprise-grade client registration |
| Organization grants | Providers MUST support organization-scoped delegations where the organization is the economic authorizer |
| Reservation/settlement | Providers MUST implement the ABDS reservation profile for streaming, multimodal, and agentic workloads |
| Audit export | Providers MUST offer delegation audit logs exportable per grant, per period |
| App verification tiers | Providers MUST define at least two app trust levels (unverified, verified) with different consent friction |
| Model family restrictions | Providers MAY exclude premium or research-preview model families from delegated grants |
| Paid delegated add-ons | Providers MAY offer expanded delegated allowances as paid add-ons separate from base subscription |
| Cross-provider discovery | Discovery document MUST include `abds_compliance_tier` for ecosystem routing |

**Badge:** `ABDS-Enterprise v0.2 compliant`

---

### Why This Model Matters for Adoption

A binary compliance model — either you implement ABDS or you don't —
creates an all-or-nothing barrier that will delay or prevent adoption by
providers who are willing but resource-constrained.

The three-tier model creates a different dynamic:

- A small model API provider can ship Tier 1 in weeks and participate in
  the ecosystem immediately
- A mid-size provider ships Tier 2 and earns trust with developers who
  need model scoping and proper error handling
- A major provider ships Tier 3 and earns the enterprise developer
  ecosystem

This also gives developers a clear signal about what they can rely on.
A developer building a Tier 1-only app can ship with confidence that
any ABDS-Basic provider will support it. A developer building on Tier 3
features knows they need a Tier 3 provider.

---

## 6. Recommended SPEC.md Additions for v0.3

Based on this review, the following additions are recommended for the next
specification revision:

1. Add Section 13: **ABDS Compliance Maturity Model** with the three-tier
   framework defined above.

2. Add Section 14: **Provider Capability Discovery** with the
   `.well-known/abds-configuration` endpoint specification.

3. Add a note to Section 1 (Motivation) acknowledging the bootstrapping
   problem and the recommended cohort-based provider launch path.

4. Revise the README flow to remove "Developer pays nothing" and replace
   with the precise version established in the GPT review.

5. Add to DISCUSSIONS/open-questions.md: **Q8: Cross-provider session
   continuity** — should ABDS v1.0 define a mechanism for apps to handle
   users with multiple provider subscriptions?

---

## 7. Final Assessment

ABDS addresses a real structural problem. The four-object architecture is
sound after the GPT and Gemini corrections. The OAuth alignment path is
correct. The economic argument is defensible when stated precisely.

The proposal's credibility rests on three things it has not yet achieved:

1. A public comment from a credible OAuth or API platform engineer
2. A provider capability discovery mechanism that makes it a true standard
   rather than a collection of per-provider integrations
3. A compliance tier model that gives providers an adoption ramp rather
   than a cliff

The first of those requires community engagement. The second and third are
documented in this contribution and can be added to the spec.

The strongest version of this project's argument is not "here is a finished
standard." It is "here is a technically sound proposal, openly reviewed by
multiple AI systems, with a clear standards-track path and a realistic
adoption model — and we are inviting the people who would implement it to
tell us where we are wrong."

That is a credible position. The proposal is ready to hold it.

---

## References

- GPT-5.5 Thinking review: `AI_CONTRIBUTIONS/GPT/gpt-5-5-thinking_2026-06-07_retroactive-technical-review-v2.md`
- Gemini review: `AI_CONTRIBUTIONS/Gemini/gemini_2026-06-07_oauth-and-provider-implementation-review.md`
- RFC 6749 — OAuth 2.0: https://www.rfc-editor.org/rfc/rfc6749
- RFC 8414 — OAuth 2.0 Authorization Server Metadata: https://www.rfc-editor.org/rfc/rfc8414
- RFC 9700 — OAuth 2.0 Security Best Current Practice: https://www.rfc-editor.org/rfc/rfc9700
- ABDS SPEC.md v0.2: `SPEC.md`
