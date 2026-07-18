# ABDS Roadmap

> Evolution path from an open payer-neutral delegation proposal to a testable interoperability profile.

## Stable Core Thesis

```text
Funding Entitlement or Budget
        |
Delegated AI Grant
        |
Short-lived Execution Token
        |
Provider-side Usage Ledger
```

The Funding Principal may be the user, an organization, a Sponsor, the AI Provider, or the developer.

The central design rules are:

1. Mutable economic state does not belong in bearer-token claims.
2. The Provider's grant and ledger remain authoritative.
3. Funding does not imply access to user content.
4. A failed funding source cannot silently shift cost to another party.

## Version History and Roadmap

### v0.2 - Four-Object Architecture

Established:

- server-side Delegated AI Grant,
- short-lived Execution Token,
- provider-side Usage Ledger,
- usage-status interface,
- revocation, and
- removal of live quota from token claims.

### v0.3 - Discovery, Profiles, and Threat Model

Established:

- provider discovery,
- implementation profiles,
- formal threat model,
- OAuth terminology alignment,
- public `delegation_id`, and
- stronger Client security guidance.

### v0.4 - Payer-Neutral and Sponsored Delegation

Status: current draft.

Established:

- Funding Principal, Economic Authorizer, Resource User, and Beneficiary separation,
- user, organization, Sponsor, provider-promotion, and developer funding-source types,
- Sponsored Delegation Profile,
- NatureGuard Sponsor scenario,
- Rich Authorization Request alignment,
- separation of grant authorization policy from ledger state,
- Sponsor privacy defaults,
- no-silent-payer-substitution rule, and
- Build Week presentation strategy.

### v0.5 - Reservation and Settlement

Goal: handle variable-cost execution.

Planned:

- estimate,
- reservation,
- bounded execution,
- settlement,
- release and refund,
- cancellation and partial completion,
- idempotency,
- agent-step budgets, and
- sponsor-pool settlement behavior.

### v0.6 - Reference Simulator and Conformance Draft

Goal: turn the proposal into a testable developer tool.

Planned:

- mock Authorization Server and Resource Server,
- user and Sponsor program flows,
- grant and ledger service,
- consent-screen reference,
- token and discovery test vectors,
- error and revocation test cases,
- Sponsor privacy tests,
- no-silent-payer-substitution tests, and
- machine-readable conformance report.

### v0.7 - Provider-Review Draft

Goal: produce a draft suitable for serious Provider and OAuth critique.

Planned:

- external security review,
- consent receipt profile,
- Provider economics appendix,
- Sponsor governance and privacy appendix,
- formal authorization-details type,
- privacy threat analysis,
- conformance checklist, and
- normative versus informative text separation.

### v1.0 - Candidate Standards Discussion

Possible paths:

- IETF OAuth Working Group discussion,
- OpenID Foundation community or working-group discussion,
- provider-led consortium,
- independent interoperability profile, or
- individual Internet-Draft after sufficient implementation experience.

ABDS should not claim standards-body status before review and implementation evidence exist.

## Near-Term Priorities

1. Build a small mock provider and ABDS Studio simulator.
2. Demonstrate the NatureGuard sponsored-funding lifecycle.
3. Produce authorization-details schemas and test vectors.
4. Define consent receipt and policy-version semantics.
5. Define reservation and settlement.
6. Obtain review from OAuth, Provider-platform, security, privacy, and nonprofit funding experts.
7. Replace illustrative endpoint and type placeholders with registered or collision-resistant identifiers.

## Known Non-Goals Before v1.0

- universal AI currency,
- cross-provider transfer of resource units,
- mandatory Provider pricing,
- blockchain settlement,
- mandated subscription allocation percentages,
- Sponsor access to user content,
- marketplace revenue sharing, and
- complete enterprise procurement workflows.

## Review Milestone

The next meaningful milestone is:

> A runnable simulator survives public critique from an OAuth or AI Provider platform engineer and demonstrates that user-funded and Sponsor-funded flows share one coherent core model.
