# ABDS Roadmap

> Intended evolution path for the AI Billing Delegation Standard from draft proposal to provider-review candidate.

ABDS is still a draft. The goal is not to freeze a premature standard, but to separate the stable core from design areas that need review by AI providers, OAuth specialists, API security engineers, consumer AI developers, and standards practitioners.

## Stable Core Thesis

```text
User Subscription Entitlement
        ↓
Delegated AI Grant
        ↓
Short-lived Execution Token
        ↓
Provider-side Usage Ledger
```

The central design principle remains:

> Mutable quota state does not belong in JWT claims. The execution token references the delegation; the provider-side grant and usage ledger remain authoritative.

## Version Roadmap

### v0.2 — Current Architecture Draft

Status: current baseline.

Established:

- Four-object architecture
- Server-side Delegated AI Grant
- Short-lived Execution Token
- Provider-side Usage Ledger
- Usage Introspection Endpoint
- Revocation requirements
- Removal of live quota state from JWT claims

### v0.3 — Provider Discovery, Profiles, and Threat Model

Goal: make ABDS easier for reviewers and implementers to evaluate.

Planned additions:

- Provider discovery metadata
- ABDS implementation profiles
- Formal threat model
- Stronger OAuth terminology alignment
- Clarified `delegation_id` semantics
- Revised public-client and backend-token-handling guidance

### v0.4 — Reservation and Settlement Profile

Goal: handle streaming, multimodal, batch, and agentic workloads.

Planned additions:

- Quota estimation
- Reservation lock
- Execution within a bounded envelope
- Settlement against actual usage
- Release of unused reserved quota
- Cancellation and partial-completion semantics
- Error handling for insufficient delegated quota

### v0.5 — Reference Implementation

Goal: demonstrate practical feasibility.

Possible components:

- Mock ABDS authorization server
- Mock provider-side grant service
- Usage ledger service
- Example consumer app backend
- Example consent screen
- Example introspection endpoint
- Developer test harness

### v0.6 — Provider-Review Draft

Goal: produce a version suitable for serious provider critique.

Planned work:

- Security review checklist
- Provider economics appendix
- Abuse-control appendix
- Consent UX profile
- Implementation profile checklist
- Open questions clearly separated from normative text

### v1.0 — Candidate Standards Submission

Goal: prepare a standards-body candidate or provider-neutral profile.

Possible paths:

- OAuth profile discussion
- OpenID Foundation profile discussion
- IETF individual Internet-Draft
- Provider-led working group
- Independent interoperability profile

## Known Non-Goals Before v1.0

These ideas may be explored later, but should not complicate the core draft:

- Cross-provider quota portability
- Provider-to-provider delegated session routing
- Marketplace revenue sharing
- A universal AI credit currency
- Blockchain or decentralized ledger requirements
- Mandatory pricing model standardization
- Mandated consumer subscription percentage allocation
- Enterprise procurement workflows

## Near-Term Priorities

1. Add provider discovery metadata.
2. Add Basic / Standard / Advanced implementation profiles.
3. Add a formal threat model.
4. Clarify OAuth alignment in `SPEC.md`.
5. Clarify `delegation_id` as the public reference identifier.
6. Keep reservation / settlement as a v0.4 profile rather than forcing it into the core.
7. Invite external review through GitHub Issues.

## Review Milestone

The next meaningful milestone is not adoption by a major AI provider. The next milestone is:

> A credible AI platform, OAuth, API security, or developer-infrastructure reviewer publicly critiques the model.

ABDS should be designed to survive that scrutiny.
