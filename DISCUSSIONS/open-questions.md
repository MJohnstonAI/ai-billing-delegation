# Open Design Questions

This document tracks unresolved questions in ABDS v0.5. Questions already resolved by the current specification are removed or reframed.

## Q1: Refresh and Durable Grant Credentials

Should Providers issue refresh tokens, use OAuth Token Exchange from a durable grant credential, or require periodic reauthorization? How should token refresh interact with grant expiry, consent changes, and entitlement lapse?

## Q2: Multi-Model Bundles and Dynamic Aliases

How should `model_scope` represent changing bundles, aliases, model revisions, and Provider routers without granting unexpectedly broader access?

## Q3: Minimum Interoperable Usage Event

Which v0.5 Usage Event fields are mandatory across Providers, and which remain Provider-defined extensions?

## Q4: Billability of Failed and Speculative Attempts

Which failed-before-inference, failed-after-partial-inference, superseded, speculative, safety, and fallback attempts may be billed, and how must that policy be disclosed?

## Q5: Reservation Thresholds

Should reservation be mandatory for every streaming request, only above a cost/risk threshold, or only for specific modalities and agentic workloads?

## Q6: Reconciliation Time Bounds

How long may a settlement remain pending after Provider failure, delayed batch completion, or cross-region uncertainty? What user-facing status is required?

## Q7: Signed Usage and Settlement Receipts

Should signed receipts be part of Standard or Advanced? Which key-discovery, rotation, replay, and retention profile should be used?

## Q8: Client Attribution Echo Policy

Which workspace, feature, workflow, agent, experiment, trace, or span references should a Provider echo? Should pairwise pseudonymization be required?

## Q9: Sponsor Reporting and Privacy Thresholds

What minimum cohort sizes, noise, suppression, or aggregation rules prevent Sponsor reports from becoming user surveillance?

## Q10: Eligibility Attestation

Should Sponsor eligibility be verified by the Provider, Sponsor, Client, or a privacy-preserving external credential? How is fraud controlled without centralizing sensitive data?

## Q11: Multiple Authorized Funding Sources

Should one logical request ever split across funding buckets, or should each settlement always resolve to one source? v0.5 currently favors one funding bucket per settlement.

## Q12: Competitive Neutrality

Should ABDS include non-discrimination guidance so delegated calls are not intentionally degraded relative to direct API calls, or is this outside a technical standard?

## Q13: Authorization Details Identifier

What collision-resistant identifier and registration path should replace the `abds_ai_delegation` placeholder?

## Q14: Cross-Provider Routing

How should a Client or broker route among separately authorized Provider grants without implying cross-provider transferability of units?

## Q15: OpenTelemetry Mapping

When emerging Generative AI semantic conventions stabilize, should ABDS register a formal mapping for request, attempt, route, model, tokens, latency, and outcome?

## Q16: Accounting Retention and Privacy Erasure

How should Providers reconcile immutable economic records with privacy-law erasure, minimization, and retention requirements?

## Q17: Provider Economics

What pricing, fraud, support, cannibalization, and subscription-allocation constraints would make Providers accept or reject ABDS?
