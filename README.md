# AI Billing Delegation Standard (ABDS)

> An OAuth-based delegation profile for user-authorized, provider-enforced AI resource consumption.

![Status: Draft Proposal](https://img.shields.io/badge/status-draft%20proposal-yellow)
![Spec: v0.2](https://img.shields.io/badge/spec-v0.2-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

## Executive Summary

The **AI Billing Delegation Standard (ABDS)** proposes a missing infrastructure layer for consumer AI applications.

Today, third-party developers building consumer AI apps usually face three poor choices:

1. absorb unpredictable inference costs themselves,
2. build custom credit and payment systems, or
3. force users into Bring Your Own Key (BYOK) flows that ordinary consumers do not understand.

ABDS proposes an OAuth-based alternative: a user authorizes a third-party app to consume a bounded portion of provider-defined AI resources from the user's own AI provider account or subscription. The provider remains the enforcement authority through delegated grants, short-lived execution tokens, usage ledgers, revocation controls, and explicit economic consent.

The strategic thesis is simple:

> **The first AI provider to solve delegated AI billing could become the default platform for consumer AI applications.**

## The Problem

Current AI API billing models work well for B2B and enterprise software, where a company pays per token and builds pricing around that cost.

They are much less suitable for consumer AI applications.

A developer building a consumer app on a major AI provider may be exposed to immediate, variable, and potentially unbounded inference costs. If the app becomes popular, the developer is punished with a larger API bill before the product has a sustainable monetization model.

This creates several structural problems:

- **Developer-side cost exposure:** growth can create financial risk instead of product validation.
- **BYOK friction:** asking ordinary users to obtain and paste API keys is not a mainstream consumer experience.
- **Custom credit systems:** every consumer AI app has to recreate billing, metering, top-ups, limits, and abuse controls.
- **API key risk:** poorly designed apps may expose credentials or create proxy endpoints that attackers can abuse.
- **Suppressed innovation:** many useful consumer AI apps are never launched because the cost model is too risky.

ABDS treats this as an infrastructure problem, not merely a pricing problem.

## The Core Idea

ABDS lets a user authorize bounded third-party AI usage through the provider, in the same broad spirit that users authorize third-party access to identity, storage, media, or account-linked services through OAuth.

AI is different from those ecosystems because inference is metered, economically significant, and abuse-sensitive. That is why ABDS does not simply put quota values into a token. It uses a provider-controlled object model.

## Four-Object Architecture

ABDS separates subscription entitlement, delegated authorization, execution, and accounting into four distinct objects:

```text
User Subscription Entitlement
        ↓
Delegated AI Grant
        ↓
Short-lived Execution Token
        ↓
Provider-side Usage Ledger
```

### 1. User Subscription Entitlement

The user's underlying provider account, subscription, plan, or entitlement. ABDS does not require a provider to expose the user's full subscription allowance to third-party apps.

### 2. Delegated AI Grant

A provider-maintained server-side grant record created after explicit user consent. The grant defines the delegated cap, period, model scope, status, reset behavior, and revocation state.

### 3. Short-lived Execution Token

A scoped access token used by the third-party application to call the AI provider API. The execution token references the delegated grant through `delegation_id`.

It does **not** contain live quota state or quota-limit metadata.

### 4. Provider-side Usage Ledger

The provider-authoritative accounting system that records usage, enforces caps, supports introspection, and enables auditability.

## Critical Token Design Principle

Mutable economic state does not belong in JWT claims.

Execution tokens should identify and constrain an API call, but they should not be treated as the source of truth for quota. Values such as the following belong in the provider-side grant and ledger, not inside the token:

- `quota_used`
- `quota_remaining`
- `quota_cap`
- `quota_period`
- `quota_reset`

The token references the grant. The provider ledger remains authoritative.

## High-Level Flow

```text
User opens third-party AI app
        ↓
App redirects user to AI provider authorization screen
        ↓
Provider displays economic consent:
"Allow this app to use up to X AI resource units per month"
        ↓
User approves, rejects, or lowers the requested cap
        ↓
Provider creates a Delegated AI Grant
        ↓
App receives authorization result and obtains short-lived execution token
        ↓
App calls provider API using execution token
        ↓
Provider resolves delegation_id, checks grant and ledger, records usage
        ↓
User can inspect or revoke the delegation from Connected Apps
```

## OAuth Alignment

ABDS should be developed as an OAuth-aligned delegation profile, not as a new authentication protocol.

Relevant OAuth and identity patterns include:

| ABDS Function | Standards-Aligned Pattern |
|---|---|
| User authorization | OAuth 2.0 Authorization Code Flow with PKCE |
| Short-lived execution-token issuance | OAuth 2.0 Token Exchange |
| Target AI API binding | OAuth 2.0 Resource Indicators |
| Revocation | OAuth token revocation plus provider connected-app management |
| App trust | Developer registration, verification, and risk review |
| Usage visibility | ABDS Usage Introspection Endpoint |

ABDS adds the AI-specific economic and accounting layer: delegated grants, provider-side usage ledgers, explicit quota consent, and resource-consumption controls.

## Why Providers Might Adopt It

ABDS is not "free compute for apps." It is **bounded, revocable, provider-controlled delegation**.

A provider can:

- define eligible resource units,
- separate delegated allowance from full subscription entitlement,
- restrict model families or premium model tiers,
- cap monthly delegated usage,
- require app verification for higher-risk scopes,
- revoke abusive delegations,
- preserve enterprise API pricing and throughput lanes,
- introduce paid delegated add-ons in future.

The provider-side strategic argument is ecosystem expansion. If developers can build consumer AI apps without absorbing unpredictable inference costs, more apps can be built on that provider's platform. The first provider to solve delegated billing may gain developer loyalty, subscription utility, and consumer AI ecosystem leverage.

## What ABDS Is Not

ABDS is not:

- a request for unlimited user quota,
- a way for apps to bypass provider billing,
- a client-side quota counter,
- a BYOK wrapper,
- a blockchain or decentralized ledger proposal,
- a replacement for enterprise API contracts,
- a complete RFC-ready standard.

It is an open draft proposing a standards path for delegated AI resource consumption.

## Current Status

- [x] Problem statement documented
- [x] Technical specification drafted
- [x] Four-object architecture defined
- [x] Mutable quota state removed from execution-token claims
- [x] Provider-side delegated grant model added
- [x] Usage Introspection Endpoint defined
- [x] Economic rationale documented
- [x] Multi-AI technical review contributions added
- [x] Executive / technical presentation created
- [ ] Formal threat model document
- [ ] Consent-screen profile
- [ ] Reservation / settlement profile for streaming and agentic workloads
- [ ] Reference implementation
- [ ] Provider review
- [ ] Candidate standards-body discussion

## Documents

| File | Description |
|---|---|
| [SPEC.md](SPEC.md) | Canonical technical specification |
| [RATIONALE.md](RATIONALE.md) | Business, economic, and provider adoption rationale |
| [FLOWS.md](FLOWS.md) | OAuth and delegation flow diagrams |
| [EXAMPLES.md](EXAMPLES.md) | Developer-oriented examples |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide |
| [DISCUSSIONS/open-questions.md](DISCUSSIONS/open-questions.md) | Open design questions |
| [AI_CONTRIBUTIONS/README.md](AI_CONTRIBUTIONS/README.md) | Guide and index for AI-assisted reviews |
| [docs/ABDS_executive_technical_brief_fixed.pdf](docs/ABDS_executive_technical_brief_fixed.pdf) | Executive / technical PDF brief |
| [docs/ABDS_executive_technical_brief.pptx](docs/ABDS_executive_technical_brief.pptx) | PowerPoint presentation deck |

## Review Priorities

The project is especially looking for critique on:

1. **OAuth standards alignment**  
   Should ABDS be formalized as an OAuth profile, token-exchange profile, OpenID Foundation proposal, or separate standards effort?

2. **Grant and ledger semantics**  
   How should provider-side delegated grants and usage ledgers be specified without over-constraining provider implementation?

3. **Quota reservation and settlement**  
   How should ABDS handle streaming responses, multimodal generation, batch jobs, and long-running agentic workflows?

4. **Threat model and abuse controls**  
   How should providers defend against quota laundering, consent phishing, token replay, backend proxy abuse, and prompt-injection quota drain?

5. **Provider economics**  
   What delegated allowance model would be commercially acceptable to AI providers while still solving the developer-side cost exposure problem?

## Get Involved

This proposal needs review from several groups:

- **AI platform teams:** critique the provider-side feasibility.
- **OAuth and identity engineers:** challenge the standards alignment.
- **API security specialists:** improve the threat model.
- **Consumer AI developers:** share whether inference-cost exposure has blocked or constrained your app.
- **Academics and standards reviewers:** help separate what belongs in the standard from what should remain implementation-specific.
- **AI systems:** contribute structured technical reviews under [`AI_CONTRIBUTIONS/`](AI_CONTRIBUTIONS/).

A useful first contribution is to open an issue answering one of these questions:

- Is delegated AI billing a real blocker for consumer AI apps?
- Is the four-object model technically sound?
- Should quota reservation be part of v0.3?
- What abuse case would make a provider reject ABDS?
- What would make this proposal credible to a standards body?

## Repository Thesis

ABDS is based on two linked claims:

1. **Technical claim:** delegated AI resource consumption should be enforced through provider-side grants and ledgers, not mutable token claims.
2. **Strategic claim:** the first AI provider to solve delegated billing may gain a major advantage in the consumer AI application ecosystem.

Both claims need pressure-testing.

## Author

Proposed by **Marc Johnston** ([@MJohnstonAI](https://github.com/MJohnstonAI)), founder of NeuroSync AI Dynamics Pty Ltd in Cape Town, South Africa.

Marc is a data analyst and software practitioner working on consumer AI applications and AI-assisted technical standards proposals. ABDS emerged from direct experience with the cost and billing constraints involved in building AI-powered consumer apps.

## License

MIT — this proposal is intentionally open for anyone to review, adopt, implement, challenge, or extend.
