# ABDS Roadmap

> Evolution from an open delegation proposal to a testable interoperability profile.

## Stable Core Thesis

```text
Provider Account
    -> Eligible Funding Entitlement
        -> Economic Consent
            -> Consent Receipt
                -> Delegated AI Grant
                    -> Short-lived Execution Token
                        -> Provider Execution
                            |-> Usage Event Plane
                            |-> Economic Ledger Plane
                        -> Evidence and Reconciliation
```

Stable rules:

1. Application Authentication does not imply Economic Authorization.
2. Entitlement eligibility and selection remain Provider-authoritative.
3. Mutable economic state does not belong in bearer-token claims.
4. Provider grant, reservation, measurement, settlement, and ledger state remain authoritative.
5. Funding does not imply access to user content or identity.
6. A failed funding source cannot silently shift cost to another payer or entitlement.
7. One physical Provider attempt is attributable separately from the logical request where the applicable profile requires attempt-level accounting.
8. High-volume traffic remains attributable to both Beneficiary and Client.
9. Accepted events and receipts are append-only.
10. Gateway observations are not Provider-authoritative until reconciled.
11. Corrections use compensating events rather than historical rewrite.
12. Provider capability discovery does not expose user-specific balance or entitlement data.

## Version History

### v0.1 — Initial Proposal

Introduced AI billing delegation and the consumer-app cost problem. The mutable-quota token design was later rejected.

### v0.2 — Four-Object Architecture

Established the Provider-side grant, short-lived Execution Token, authoritative ledger, usage status, revocation, and removal of live quota from token claims.

### v0.3 — Discovery, Profiles, and Threat Model

Established OAuth terminology, PKCE, Provider discovery, implementation profiles, public `delegation_id`, and a formal threat model.

### v0.4 — Payer-Neutral and Sponsored Delegation

Established Funding Principal, Economic Authorizer, Beneficiary, Sponsor funding, Rich Authorization Requests, Sponsor privacy, and no silent payer substitution.

### v0.5 — Usage Attribution and Settlement

Established:

- one immutable Usage Event per physical attempt;
- requested and resolved model separation;
- request, retry, fallback, route, run, and step correlation;
- separate immutable Ledger Events;
- estimate, reserve, execute, settle, release, expiry, and adjustment;
- idempotency and append-only correction;
- JSON Schemas, examples, validation, diagrams, and presentation.

### v0.6 — Evidence, Consent, and Reconciliation

Established:

- standalone Usage Event interoperability guidance;
- scoped sequence ordering;
- `provider_signed`, `provider_reported`, and `gateway_attested` evidence classes;
- separate estimated, gateway-observed, Provider-reported, and Provider-final measurements;
- formal immutable Consent Receipts;
- model, operation, workload, payer, ceiling, duration, privacy, and revocation binding;
- append-only Reconciliation Events;
- late-usage and variance arithmetic;
- compensating adjustment requirements;
- unique token `jti` and replay controls;
- dual Beneficiary and Client attribution;
- v0.6 JSON Schemas;
- positive and negative test fixtures;
- extended automated validation.

### v0.7 — Provider Adoption & Entitlement Binding

**Status: current draft.**

Established:

- explicit separation of Application Authentication from ABDS Economic Authorization;
- Provider Account and Eligible Funding Entitlement concepts;
- Provider-authoritative Entitlement Resolution;
- `entitlement_type` as a separate dimension from `funding_source_type`;
- illustrative entitlement categories including prepaid credit, pay-as-you-go, subscription allowance, delegated subscription add-on, organization pool, Sponsor pool, promotional credit, and developer balance;
- discovery metadata for entitlement capabilities;
- a lightweight Provider Adoption Profile for experimental implementation;
- adoption maturity labels from conceptual through Provider-native;
- a normative rule prohibiting Clients from manufacturing, substituting, upgrading, or silently selecting Provider entitlements;
- a prospective source-available licensing framework for v0.7-and-later material;
- commercial-use, provenance, and project-name/endorsement policies.

v0.7 deliberately does **not** build the previously planned ABDS Studio. The Studio is moved to v0.8 so that the current release remains a small, reviewable standards clarification rather than reopening a large implementation project.

## Future Milestones

### v0.8 — ABDS Studio Reference Simulator

Goal: turn the proposal into a runnable and reviewable developer tool if project resources justify renewed implementation work.

Planned:

- mock Authorization Server and Resource Server;
- user, Client, Sponsor, and Provider views;
- Entitlement Resolution demonstration;
- Consent Receipt issuance;
- grant and short-lived token lifecycle;
- run-level reservation;
- Usage and Ledger Event timelines;
- gateway-attested and Provider-signed evidence;
- reconciliation and adjustment demonstration;
- revocation, exhaustion, retry, fallback, and replay tests;
- a consumer-app reference scenario;
- machine-readable conformance report.

### v0.9 — Provider Adapter and Interoperability Evidence

Planned:

- gateway adapter for an existing AI API without claiming Provider-native adoption;
- Provider-reported usage reconciliation;
- two independent prototype implementations;
- cross-client test vectors;
- documented router and model-alias behavior;
- reference OpenTelemetry mapping;
- incompatibility report;
- revised conformance checklist.

### v0.10 — Governance and External Review

Planned:

- Provider economics appendix;
- Sponsor governance and privacy appendix;
- formal authorization-details identifier strategy;
- production signature and key-discovery profile;
- normative versus informative separation;
- external OAuth, accounting, security, privacy, and Provider-platform review;
- contributor provenance / CLA decision;
- multi-maintainer governance proposal;
- commercial licensing and certification governance review.

### v1.0 — Candidate Standards Discussion

Possible paths include IETF OAuth Working Group discussion, OpenID Foundation community work, a Provider-led consortium, an independent interoperability profile, or an individual Internet-Draft after implementation evidence exists.

ABDS must not claim standards-body status or Provider adoption before those facts exist.

## Near-Term Priorities

ABDS is currently suitable for low-maintenance stewardship. If work resumes, prioritize:

1. obtain Provider feedback on Entitlement Resolution and the Provider Adoption Profile;
2. validate whether entitlement categories are sufficiently provider-neutral;
3. select a production asymmetric signature and canonicalization profile;
4. build only the smallest useful ABDS Studio simulation;
5. add one real gateway adapter without claiming provider-native adoption;
6. define invoice-level aggregate reconciliation;
7. obtain OAuth, accounting, security, privacy, Provider-platform, and commercial-model review;
8. replace placeholder identifiers with collision-resistant or registered identifiers where standards work becomes realistic.

## Known Non-Goals Before v1.0

- universal AI currency;
- forced use of existing consumer subscriptions;
- cross-provider transfer of resource units;
- mandatory Provider pricing;
- blockchain settlement;
- mandated subscription allocation percentages;
- Sponsor access to user content;
- mandatory marketplace revenue sharing;
- complete enterprise procurement workflows;
- claims that a named Provider has adopted ABDS without Provider evidence.

## Next Review Milestone

> A credible next milestone is not another large specification expansion. It is evidence from at least one Provider or router that the v0.7 Entitlement Resolution boundary and Provider Adoption Profile are technically and commercially worth piloting.

If that evidence exists, v0.8 should demonstrate a bounded consent-to-entitlement-to-grant flow before broader implementation work resumes.