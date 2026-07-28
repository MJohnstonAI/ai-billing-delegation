# ABDS Roadmap

> Evolution from an open delegation proposal to a testable interoperability profile.

## Stable Core Thesis

```text
Funding Entitlement or Budget
    -> Consent Receipt
        -> Delegated AI Grant
            -> Short-lived Execution Token
                -> Provider Execution
                    |-> Usage Event Plane
                    |-> Economic Ledger Plane
                -> Evidence and Reconciliation
```

Stable rules:

1. Mutable economic state does not belong in bearer-token claims.
2. Provider grant, reservation, measurement, settlement, and ledger state remain authoritative.
3. Funding does not imply access to user content or identity.
4. A failed funding source cannot silently shift cost.
5. One physical Provider attempt is attributable separately from the logical request.
6. High-volume traffic remains attributable to both Beneficiary and Client.
7. Accepted events and receipts are append-only.
8. Gateway observations are not Provider-authoritative until reconciled.
9. Corrections use compensating events rather than historical rewrite.

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

**Status: current draft.**

Established:

- standalone Usage Event interoperability guide;
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

## Future Milestones

### v0.7 — ABDS Studio Reference Simulator

Goal: turn the proposal into a runnable and reviewable developer tool.

Planned:

- mock Authorization Server and Resource Server;
- Sponsor, user, Client, and Provider consoles;
- Consent Receipt issuance;
- grant and short-lived token lifecycle;
- run-level reservation;
- Usage and Ledger Event timelines;
- gateway-attested and Provider-signed evidence;
- reconciliation and adjustment demonstration;
- revocation, exhaustion, retry, fallback, and replay tests;
- NatureGuard reference scenario;
- machine-readable conformance report.

### v0.8 — Provider Adapter and Interoperability Evidence

Planned:

- gateway adapter for an existing AI API;
- Provider-reported usage reconciliation;
- two independent prototype implementations;
- cross-client test vectors;
- documented router and model-alias behavior;
- reference OpenTelemetry mapping;
- incompatibility report;
- revised conformance checklist.

### v0.9 — Governance and External Review

Planned:

- Provider economics appendix;
- Sponsor governance and privacy appendix;
- formal authorization-details identifier strategy;
- production signature and key-discovery profile;
- normative versus informative separation;
- external OAuth, accounting, security, privacy, and Provider-platform review;
- multi-maintainer governance proposal.

### v1.0 — Candidate Standards Discussion

Possible paths include IETF OAuth Working Group discussion, OpenID Foundation community work, a Provider-led consortium, an independent interoperability profile, or an individual Internet-Draft after implementation evidence exists.

ABDS must not claim standards-body status or Provider adoption before those facts exist.

## Near-Term Priorities

1. Obtain review of the v0.6 evidence hierarchy and Consent Receipt core.
2. Select a production asymmetric signature and canonicalization profile.
3. Build ABDS Studio as a mock provider-native implementation.
4. Add one real gateway adapter without claiming provider-native adoption.
5. Define invoice-level aggregate reconciliation.
6. Obtain Provider, OAuth, accounting, security, privacy, and nonprofit-funding review.
7. Replace placeholder identifiers with collision-resistant or registered identifiers.

## Known Non-Goals Before v1.0

- universal AI currency;
- cross-provider transfer of resource units;
- mandatory Provider pricing;
- blockchain settlement;
- mandated subscription allocation percentages;
- Sponsor access to user content;
- marketplace revenue sharing;
- complete enterprise procurement workflows.

## Next Review Milestone

> A runnable ABDS Studio demonstrates a Consent Receipt, bounded grant, short-lived token, run-level reservation, several physical attempts, gateway and Provider evidence, append-only reconciliation, one idempotent settlement, revocation, and no silent payer substitution.
