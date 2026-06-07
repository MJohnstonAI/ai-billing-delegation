# Open Design Questions

This document tracks unresolved design questions in the ABDS proposal. Comment via GitHub Issues linking to the relevant question number.

---

## Q1: Token Refresh Strategy

**Question:** Delegation tokens will expire. What is the correct refresh flow?

**Options considered:**
- A: Standard OAuth refresh token flow (refresh token issued alongside delegation token)
- B: Re-authorization required on expiry (more secure, worse UX)
- C: Silent refresh via refresh token, with user notification if subscription has lapsed

**Current lean:** Option A with a 90-day refresh token lifetime, matching typical OAuth patterns.

**Open:** How does refresh interact with quota reset periods?

---

## Q2: Multi-Model Subscription Bundles

**Question:** Some users subscribe to bundles (e.g. "access to all Claude models"). How does model_scope interact with bundle subscriptions?

**Options considered:**
- A: Bundle subscribers can delegate access to any model in their bundle
- B: model_scope must be explicitly set; no wildcard delegation
- C: Provider exposes a `/v1/subscription/models` endpoint; app queries it during auth

**Open:** No consensus yet. Input needed from developers building multi-model apps.

---

## Q3: B2B Variant

**Question:** Should ABDS cover the case where an organization delegates quota to employee-facing internal apps?

**Context:** A company with an enterprise Claude contract wants employees to use an internal HR chatbot without each employee needing individual API keys.

**Options considered:**
- A: Out of scope for v1.0, addressed in a separate ABDS-Enterprise extension
- B: Add an `organization_id` claim to the token; organizations can delegate org quota

**Open:** Is this a different enough use case to warrant separate treatment?

---

## Q4: Quota Accounting for Streaming Responses

**Question:** Streaming API responses consume tokens progressively. How is quota decremented for streaming calls?

**Options considered:**
- A: Deduct estimated tokens at request time; reconcile on completion
- B: Deduct tokens as they are generated (requires real-time quota checks)
- C: Deduct on completion only; risk of quota being exceeded mid-stream

**Open:** Option A is pragmatic but requires an estimation model. Input from AI provider engineers needed.

---

## Q5: Handling Subscription Lapse Mid-Delegation

**Question:** A user's subscription lapses while an app holds a valid delegation token. What is the correct behaviour?

**Options considered:**
- A: Delegation token immediately invalidated; next API call returns `abds_subscription_lapsed`
- B: Grace period matching the provider's subscription grace period
- C: Delegation token remains valid until its own expiry; provider absorbs the cost

**Current lean:** Option A — subscription validity is a prerequisite for delegation validity.

---

## Q6: Competitive Neutrality

**Question:** Should ABDS specify that AI providers must not discriminate against ABDS-delegated calls (e.g. by throttling delegated calls relative to direct API calls)?

**Context:** A provider could implement ABDS but make delegated calls second-class citizens to protect API revenue.

**Open:** Needs a non-discrimination clause in the spec or governance model.
