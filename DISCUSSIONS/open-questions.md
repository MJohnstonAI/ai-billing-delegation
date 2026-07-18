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

---

## Q7: Sponsored Funding Eligibility

**Question:** Who should attest that a Beneficiary is eligible for a Sponsor program?

**Options considered:**
- A: The AI Provider verifies eligibility.
- B: The Sponsor attests eligibility.
- C: A trusted external verifier issues a privacy-preserving credential.
- D: The Client attests eligibility subject to audit and fraud controls.

**Open:** Different programs may require different trust models. The standard should avoid forcing sensitive eligibility data into OAuth requests.

---

## Q8: Sponsor Reporting and Privacy

**Question:** What is the minimum useful Sponsor report that does not become user surveillance?

**Current lean:** Aggregate units, active Beneficiary counts, grant lifecycle totals, and model or operation categories. No prompts, outputs, files, conversation history, or identity by default.

**Open:** Should ABDS define minimum cohort sizes or privacy thresholds?

---

## Q9: Multiple Funding Sources

**Question:** Can one grant draw from several Funding Principals?

**Options considered:**
- A: One grant always resolves to one funding source at execution time.
- B: A grant contains an ordered list of already-authorized sources.
- C: The Provider can split one execution across sources.

**Current lean:** Option A for the first implementation. It produces the clearest consent, accounting, error, and revocation semantics.

---

## Q10: Sponsorship Policy Changes

**Question:** Which program changes require renewed consent?

**Current lean:** Higher caps, broader models or operations, paid overage, a new Funding Principal, broader Sponsor data visibility, and material duration extensions require renewed consent. Reductions require notification when they affect expected service.

---

## Q11: Authorization Details Identifier

**Question:** What collision-resistant identifier and registration path should ABDS use for its Rich Authorization Request type?

**Open:** The current `abds_ai_delegation` value is explicitly a draft placeholder.

---

## Q12: Cross-Provider Continuity

**Question:** Should ABDS define a future mechanism for a Client to handle several separately authorized Provider and funding-source grants?

**Open:** Cross-provider portability of units is out of scope, but Client routing among independent grants may be useful.
