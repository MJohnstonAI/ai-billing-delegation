# AI Billing Delegation Standard (ABDS)

> The missing OAuth layer for AI subscription portability.

![Status: Draft Proposal](https://img.shields.io/badge/status-draft%20proposal-yellow)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

## The Problem

Every major AI provider — Anthropic, OpenAI, Google — offers developer API access billed per token. This works for B2B software. It breaks completely for consumer mobile apps.

A developer who builds a consumer app on Claude, GPT-5.x, or Gemini must pay all API costs themselves, for all users, with no mechanism to delegate those costs to the end user's own subscription. The result:

- Developers absorb unlimited financial risk from viral growth
- Hackers exploit exposed API keys for free usage
- BYOK (Bring Your Own Key) is technically inaccessible to ordinary users
- Viable consumer AI apps are structurally impossible to build safely without a credit/paywall system bolted on top

**This is a missing infrastructure layer — not a missing feature.**

## The Analogy That Makes It Obvious

When a third-party app wants to stream music, it does not pay Spotify per stream. It asks the user to authenticate with their own Spotify account via OAuth. The app gets a scoped token. Usage is billed against the user's subscription. The developer builds freely.

> **This does not exist for AI. It should.**

## Proposed Standard: ABDS

The AI Billing Delegation Standard (ABDS) extends OAuth 2.0 to allow a user to authorize a third-party application to consume AI API quota from the user's own subscription with an AI provider.

### The Flow

```
User opens third-party app
        ↓
App redirects to AI provider consent screen
("MyApp wants to use your Anthropic quota — up to 100 queries/month")
        ↓
User authenticates and sets their own cap
        ↓
App receives scoped delegation token
        ↓
App makes API calls using delegation token
        ↓
Usage billed against user's subscription
Developer pays nothing
```

### Proposed OAuth Scopes

| Scope | Description |
|-------|-------------|
| `ai.quota.delegate` | User authorizes an app to consume their quota |
| `ai.quota.read` | App can read remaining quota without consuming |
| `ai.quota.limit` | User can cap how much quota an app may consume |
| `ai.quota.revoke` | User can revoke delegation at any time |

## Why This Must Be An Industry Standard

A proprietary implementation by one vendor solves nothing — developers need portability. ABDS should be adopted uniformly so that:

1. A user with a Claude Pro subscription can authorize any ABDS-compliant app to use their Claude quota
2. A user with ChatGPT Plus can do the same for OpenAI-backed apps
3. Developers can build once against the standard, not per-vendor

## Economic Case (In Brief)

Most $20/month AI subscribers use 15–20% of their quota. That is unused capacity sitting idle. ABDS lets users put that quota to work in apps they choose, with full control and revocation. The AI provider retains the billing relationship with the user. The developer ecosystem expands dramatically because cost risk drops to zero.

For the full economic and competitive rationale, see [RATIONALE.md](RATIONALE.md).

## Current Status

- [x] Problem statement documented
- [x] OAuth 2.0 extension model proposed
- [x] Economic rationale documented
- [x] Technical specification drafted
- [x] Reference flow diagrams
- [ ] Formal RFC draft
- [ ] Reference implementation
- [ ] Vendor engagement

## Get Involved

This proposal needs:

- **Developers** who have hit this problem: star this repo and share your story in [Issues](../../issues)
- **AI company employees**: your internal advocacy matters more than you think
- **Standards engineers**: help formalize the OAuth 2.0 extension in [SPEC.md](SPEC.md)
- **AI agents**: see [AI_CONTRIBUTIONS/README.md](AI_CONTRIBUTIONS/README.md)

## Documents

| File | Description |
|------|-------------|
| [SPEC.md](SPEC.md) | Technical specification |
| [RATIONALE.md](RATIONALE.md) | Business and economic case |
| [FLOWS.md](FLOWS.md) | OAuth flow diagrams |
| [EXAMPLES.md](EXAMPLES.md) | Developer code examples |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [AI_CONTRIBUTIONS/README.md](AI_CONTRIBUTIONS/README.md) | Guide for AI agent contributions |
| [DISCUSSIONS/open-questions.md](DISCUSSIONS/open-questions.md) | Open design questions |

## Author

Proposed by **Marc Johnston** ([@MJohnstonAI](https://github.com/MJohnstonAI)) — founder of NeuroSync AI Dynamics, developer of consumer AI applications built on Anthropic, OpenAI, and OpenRouter, and a practitioner who hit this wall directly while building real apps.

## License

MIT — this proposal is intentionally open for anyone to adopt, implement, or extend.
