# Open Design Questions

This document tracks unresolved questions in ABDS v0.6. Accepted decisions belong in `DISCUSSIONS/decisions.md`.

## Q1: Production Signature Profile

Which asymmetric signature format, canonicalization method, algorithm set, and key-discovery mechanism should ABDS require for Provider-signed evidence and Consent Receipts?

## Q2: Standard Versus Advanced Evidence

Should Provider-signed evidence be required for the Standard profile, or should Standard permit authenticated Provider-reported evidence while Advanced requires signatures?

## Q3: Batch Evidence

How should signed batch manifests, Merkle roots, and event inclusion proofs be represented and verified?

## Q4: Invoice-Level Reconciliation

How should a Provider invoice or aggregate billing export be allocated back to logical requests and physical attempts without inventing unsupported precision?

## Q5: Reconciliation Window

What normal evidence-arrival window should apply to interactive, streaming, batch, routed, and agentic workloads?

## Q6: Billability of Failed and Speculative Attempts

Which failed-before-inference, failed-after-partial-inference, superseded, speculative, safety, retry, and fallback attempts may be charged, and how must that policy be disclosed?

## Q7: Minimum Consent Receipt

Which receipt fields are mandatory across all Providers, and which remain profile-specific extensions?

## Q8: Workload Enforcement

Which workload scopes can a Provider enforce from registered policy rather than trusting Client-supplied labels?

## Q9: Token Refresh and Durable Grants

Should Providers use refresh tokens, Token Exchange from a durable grant credential, or periodic reauthorization? How does refresh interact with receipt expiry and policy changes?

## Q10: Signing-Key Compromise

How should verifiers treat previously accepted evidence after a Provider signing key is compromised or revoked?

## Q11: Privacy-Preserving Sponsor Reporting

Should ABDS define cohort thresholds, differential privacy guidance, or only a general aggregate-reporting principle?

## Q12: Formal Identifier Registration

What collision-resistant identifiers and registration paths should ABDS use for authorization details, schema media types, and well-known metadata?
