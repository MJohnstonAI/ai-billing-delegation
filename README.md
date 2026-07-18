# AI Billing Delegation Standard (ABDS)

> A payer-neutral OAuth profile for bounded, provider-enforced AI resource funding.

![Status: Draft Proposal](https://img.shields.io/badge/status-draft%20proposal-yellow)
![Spec: v0.4](https://img.shields.io/badge/spec-v0.4-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

## Executive Summary

Consumer AI apps usually force one of three parties to pay:

1. the developer absorbs unpredictable inference costs,
2. the user pays through a subscription, credits, or Bring Your Own Key, or
3. the app builds its own billing and metering system.

ABDS proposes a fourth option:

> A user, employer, sponsor, donor, provider promotion, or developer can fund a bounded AI grant while the AI provider enforces consent, limits, usage, and revocation.

For example, a conservation foundation could fund NatureGuard for the public. NatureGuard's users would not pay for covered AI calls. The NatureGuard developer would not pay those inference costs. The foundation would fund a provider-recognized budget, while the provider would enforce per-user and total limits. The foundation would see only the reporting authorized by the program - not user prompts or AI responses by default.

ABDS separates the person using an application from the party funding it. That is the project's central v0.4 improvement.

## The Problem

Current AI API billing works well when a business owns the application and can recover inference costs from customers. It is less suitable for consumer, civic, educational, nonprofit, and experimental applications.

- **Developer-side exposure:** successful adoption can create immediate API liability.
- **BYOK friction:** ordinary users should not have to obtain, protect, and understand API keys.
- **Credit-system duplication:** every app rebuilds balances, limits, top-ups, and abuse controls.
- **Credential risk:** developer keys and weak proxy endpoints are attractive abuse targets.
- **Access inequality:** useful AI experiences may be unavailable to users who cannot pay.
- **Missing sponsorship rail:** donors and organizations can fund an app, but cannot safely fund bounded AI usage for its users through a portable protocol.

ABDS treats this as an infrastructure and authorization problem.

## Payer-Neutral Four-Object Architecture

```text
Funding Entitlement or Budget
        |
Delegated AI Grant
        |
Short-lived Execution Token
        |
Provider-side Usage Ledger
```

### 1. Funding Entitlement or Budget

A provider-recognized source of AI resource units or budget. It may belong to:

- a user,
- an organization,
- a sponsor,
- the AI provider, or
- the developer.

### 2. Delegated AI Grant

A provider-maintained record binding a Client, Beneficiary, funding source, cap, period, model and operation policy, status, and consent.

### 3. Short-lived Execution Token

A scoped credential referencing the grant through `delegation_id`.

The token does not contain live quota, Sponsor balance, or settlement state.

### 4. Provider-side Usage Ledger

The authoritative record for reservations, debits, settlement, releases, denials, resets, and audit.

## Two Core Funding Flows

### User-funded

```text
User authorizes an app
        |
Provider creates a grant against the user's eligible entitlement
        |
App uses a short-lived execution token
        |
Provider enforces the grant and records usage
```

### Sponsor-funded

```text
Sponsor creates a bounded funding program
        |
User sees who pays, the cap, privacy terms, and end date
        |
Provider creates a grant bound to app + user + sponsor program
        |
App uses a short-lived execution token
        |
Provider debits the sponsor ledger
```

If sponsor funding ends, ABDS prohibits silently charging the user or developer. The request must stop, use another already-authorized source, or obtain fresh consent.

## Critical Design Principles

### Mutable economic state does not belong in JWT claims

Execution Tokens identify and constrain calls. They are not the source of truth for:

- quota used or remaining,
- grant or Sponsor cap,
- reset time,
- Sponsor pool balance, or
- payment and settlement state.

### Funding does not imply data access

A Sponsor does not gain access to prompts, outputs, files, conversations, or user identity merely because it funds usage.

### The payer must never change silently

Exhausted or revoked Sponsor funding cannot fall back to the user's subscription or the developer's account without new authorization.

### Structured economic consent needs more than scopes

ABDS v0.4 uses OAuth 2.0 Rich Authorization Requests as the standards-aligned basis for cap, period, model, operation, funding offer, and overage semantics.

## OAuth Alignment

| ABDS function | Standards-aligned pattern |
|---|---|
| User authorization | Authorization Code Flow with PKCE |
| Structured economic policy | OAuth 2.0 Rich Authorization Requests |
| Sensitive or large authorization request | Pushed Authorization Requests |
| Short-lived execution-token issuance | OAuth 2.0 Token Exchange |
| Target AI API binding | OAuth 2.0 Resource Indicators |
| Sender constraint | DPoP or mTLS for higher-risk grants |
| Revocation | Token revocation plus provider grant management |
| Provider capability discovery | Authorization Server Metadata extensions or ABDS metadata |

ABDS defines the missing AI-specific layer: the funding-aware grant, economic consent, provider-authoritative ledger, and payer-safe lifecycle.

## NatureGuard Example

Green Earth Foundation funds a public NatureGuard program:

- 10,000 total standard AI units,
- 100 units per user per month,
- NatureGuard as the only eligible Client,
- economy text and vision models,
- no paid overage,
- aggregate sponsor reporting only, and
- an explicit program end date.

The provider displays the effective terms, creates a grant after user approval, and debits the foundation's program ledger. The user can inspect and revoke access. The foundation can fund impact without operating NatureGuard or seeing users' content.

See [SPONSORED_DELEGATION.md](SPONSORED_DELEGATION.md).

## What ABDS Is Not

ABDS is not:

- free or unlimited compute,
- a way to bypass provider billing,
- a money-transfer or payment-settlement standard,
- a client-side quota counter,
- a BYOK wrapper,
- automatic Sponsor access to user data,
- a universal AI currency,
- a blockchain proposal,
- a replacement for enterprise API contracts, or
- a finished or provider-adopted standard.

It is an open draft for testing a provider-controlled delegation model.

## Repository Status

- [x] Payer-neutral four-object architecture
- [x] User-funded delegation model
- [x] Sponsor-funded delegation profile
- [x] Provider-side grant and ledger separation
- [x] Mutable quota state removed from Execution Tokens
- [x] Rich Authorization Request alignment
- [x] Usage-status and revocation semantics
- [x] Provider discovery proposal
- [x] Basic, Standard, Advanced, and Sponsored profiles
- [x] Threat model
- [x] Privacy and no-silent-payer-substitution rules
- [x] Executive / technical presentation
- [x] Build Week submission strategy
- [ ] Reservation and settlement profile
- [ ] Consent receipt profile
- [ ] Reference implementation or protocol simulator
- [ ] Conformance test suite
- [ ] External provider and OAuth review

## Documents

| File | Description |
|---|---|
| [SPEC.md](SPEC.md) | Canonical v0.4 technical specification |
| [SPONSORED_DELEGATION.md](SPONSORED_DELEGATION.md) | Sponsor, donor, employer, and third-party funding profile |
| [BUILD_WEEK_2026.md](BUILD_WEEK_2026.md) | Competition fit, recommended product, pitch, and demo plan |
| [ROADMAP.md](ROADMAP.md) | Path from draft to reference implementation and standards discussion |
| [DISCOVERY.md](DISCOVERY.md) | Provider capability metadata |
| [IMPLEMENTATION_PROFILES.md](IMPLEMENTATION_PROFILES.md) | Staged implementation profiles |
| [THREAT_MODEL.md](THREAT_MODEL.md) | Security, economic-abuse, and sponsor-risk model |
| [RATIONALE.md](RATIONALE.md) | Economic and adoption rationale |
| [FLOWS.md](FLOWS.md) | User-funded, sponsor-funded, execution, exhaustion, and revocation flows |
| [EXAMPLES.md](EXAMPLES.md) | Illustrative provider-neutral integration examples |
| [DISCUSSIONS/decisions.md](DISCUSSIONS/decisions.md) | Design decisions |
| [DISCUSSIONS/open-questions.md](DISCUSSIONS/open-questions.md) | Unresolved questions |
| [AI_CONTRIBUTIONS/README.md](AI_CONTRIBUTIONS/README.md) | Multi-model review record |

The existing [executive / technical PDF](docs/ABDS_executive_technical_brief_fixed.pdf) and [PowerPoint deck](docs/ABDS_executive_technical_brief.pptx) predate v0.4. They remain useful background material but do not yet present payer-neutral or sponsored funding.

## OpenAI Build Week

The current repository is a standards proposal, not yet the working/runnable project required by the competition.

The recommended entry is **ABDS Studio** in the **Developer Tools** track: a small runnable sandbox showing a Sponsor funding NatureGuard, provider-controlled consent, grant issuance, ledger enforcement, and revocation.

See [BUILD_WEEK_2026.md](BUILD_WEEK_2026.md) for the exact submission positioning and three-minute demo storyboard.

## Review Priorities

1. Is payer-neutral funding a useful generalization, or should sponsored funding remain a separate extension?
2. Is OAuth Rich Authorization Requests the right carrier for the economic policy?
3. Does the grant separate authorization policy from ledger state cleanly enough?
4. What Sponsor reporting is useful without becoming surveillance?
5. How should eligibility be attested without centralizing sensitive user data?
6. Which changes require renewed consent?
7. What would make a provider reject this model on economic or abuse grounds?

## Author

Proposed by **Marc Johnston** ([@MJohnstonAI](https://github.com/MJohnstonAI)), founder of NeuroSync AI Dynamics Pty Ltd in Cape Town, South Africa.

## License

MIT - this proposal is open for review, adoption, implementation, challenge, and extension.
