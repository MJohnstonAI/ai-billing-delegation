# ABDS Roadmap

> Evolution from an open delegation proposal to a testable interoperability profile.

## Stable Core Thesis

```text
Funding Entitlement or Budget
    -> Delegated AI Grant
        -> Short-lived Execution Token
            -> Provider Execution
                -> Usage Event Plane
                -> Economic Ledger Plane
```

Stable rules:

1. Mutable economic state does not belong in bearer-token claims.
2. Provider grant, reservation, settlement, and ledger state remain authoritative.
3. Funding does not imply access to user content or identity.
4. A failed funding source cannot silently shift cost to another party.
5. One physical Provider attempt is attributable separately from the logical user request.
6. Accepted usage and ledger events are append-only; corrections use compensating events.

## Version History

### v0.1 - Initial Proposal

Introduced AI billing delegation and the consumer-app cost problem. The mutable-quota token design was later rejected.

### v0.2 - Four-Object Architecture

Established the Provider-side grant, short-lived execution token, authoritative ledger, usage status, revocation, and removal of live quota from token claims.

### v0.3 - Discovery, Profiles, and Threat Model

Established OAuth terminology alignment, PKCE, Provider discovery, implementation profiles, public `delegation_id`, and a formal threat model.

### v0.4 - Payer-Neutral and Sponsored Delegation

Established Funding Principal, Economic Authorizer, Beneficiary, organization and Sponsor funding, Rich Authorization Requests, Sponsor privacy, and no silent payer substitution.

### v0.5 - Usage Attribution and Settlement

**Status: current draft.**

Established:

- Provider Accounting Plane and Client Observability Plane;
- one immutable usage event per physical model attempt;
- logical request, retry, fallback, route, agent-run, and agent-step correlation;
- requested versus resolved model attribution;
- extensible token, modality, tool, and future-resource dimensions;
- separate immutable ledger events;
- estimate, reserve, execute, settle, release, expiry, refund, and adjustment semantics;
- idempotency and reconciliation invariants;
- JSON Schemas and worked examples;
- updated discovery metadata, profiles, threat model, diagrams, and presentation;
- concise change control in `CHANGELOG.md`.

## Future Milestones

### v0.6 - Reference Simulator and Conformance Draft

Goal: turn the proposal into a runnable, testable developer tool.

Planned:

- mock Authorization Server, Resource Server, grant service, and ledger;
- user-funded and Sponsor-funded flows;
- consent-screen reference;
- usage-event and ledger-event API simulator;
- schema validation and negative test vectors;
- idempotency, retry, fallback, and double-settlement tests;
- Sponsor privacy and no-silent-payer-substitution tests;
- machine-readable conformance report.

### v0.7 - Consent, Governance, and Provider-Review Draft

Planned:

- consent receipt and policy-version profile;
- Provider economics appendix;
- Sponsor governance and privacy appendix;
- formal authorization-details type identifier;
- privacy threat analysis and retention guidance;
- signed usage and settlement receipt evaluation;
- normative versus informative text separation;
- external OAuth, accounting, security, privacy, and Provider-platform review.

### v0.8 - Interoperability Evidence

Planned:

- two independent Provider or gateway prototypes;
- cross-client test vectors;
- documented routing and model-alias behavior;
- reference OpenTelemetry mapping;
- implementation feedback and incompatibility report;
- revised conformance checklist.

### v1.0 - Candidate Standards Discussion

Possible paths include IETF OAuth Working Group discussion, OpenID Foundation community work, a Provider-led consortium, an independent interoperability profile, or an individual Internet-Draft after implementation evidence exists.

ABDS must not claim standards-body status before review and implementation evidence exist.

## Near-Term Priorities

1. Build the ABDS Studio reference simulator.
2. Validate all JSON examples automatically against their schemas.
3. Define consent receipt and material-policy-change semantics.
4. Define a minimum interoperable usage-event core.
5. Decide whether reservation is mandatory by workload class or risk threshold.
6. Obtain review from OAuth, Provider-platform, accounting, security, privacy, and nonprofit-funding experts.
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

> A runnable simulator demonstrates that user-funded and Sponsor-funded grants share one coherent authorization core while usage events, retries, routing, reservations, settlements, and privacy boundaries remain testable and auditable.
