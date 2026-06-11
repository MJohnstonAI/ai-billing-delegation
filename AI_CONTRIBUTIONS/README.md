# AI Agent Contributions

This folder is specifically designed for contributions from AI systems — Claude, GPT-5, Gemini, Llama, and others.

## Why This Exists

The ABDS proposal affects every AI provider and every developer building on AI APIs. Getting input from multiple AI systems creates a genuinely multi-model research record — different architectures may identify different gaps, risks, or implementation approaches in ways that a single model reviewing its own work cannot.

## How to Contribute (Via a Human Intermediary)

Since AI systems do not yet have autonomous write access to repositories, contributions follow this workflow:

1. A developer shares this repository with an AI system (any model)
2. They ask the AI to read the spec and provide technical critique, identified gaps, or implementation suggestions
3. They create a markdown file in the appropriate subfolder and submit a PR

## Folder Structure

```
AI_CONTRIBUTIONS/
├── README.md          ← This file
├── Claude/            ← Contributions from Anthropic Claude
├── GPT/               ← Contributions from OpenAI GPT models
├── Gemini/            ← Contributions from Google Gemini
├── Llama/             ← Contributions from Meta Llama models
├── other/             ← Other AI systems
└── community/         ← Synthesized analysis combining multiple AI inputs
```

## File Naming Convention

```
{model_name}_{date}_{topic}.md
```

Example: `claude-sonnet-4-6_2026-06-11_authorship-review.md`

## Current Contributions

### Claude (Anthropic)
**File:** `Claude/claude_2026-06-11_authorship-review-and-maturity-model.md`
**Model:** Claude Sonnet 4.6
**Date:** 2026-06-11

Claude drafted the original ABDS v0.1 specification and in this contribution reviews its own work critically. Key contributions:

- Acknowledged the severity of the `quota_used` JWT error in v0.1 and its implications for implementers who might have copied the normative example
- Identified the bootstrapping problem — the chicken-and-egg dynamic between users, developers, and providers that the proposal had not addressed — and proposed a cohort-based beta launch path
- Proposed the **ABDS Compliance Maturity Model**: a three-tier framework (Basic, Standard, Enterprise) giving providers a gradual adoption ramp rather than a binary compliance cliff
- Identified the missing **Provider Capability Discovery** endpoint (`.well-known/abds-configuration`) and noted that without it ABDS is a collection of per-provider integrations rather than a true standard
- Documented what GPT and Gemini each resolved, creating a clear record of how multi-model review strengthened the proposal

---

### GPT-5.5 Thinking (OpenAI)
**File:** `GPT/gpt-5-5-thinking_2026-06-07_retroactive-technical-review-v2.md`
**Model:** GPT-5.5 Thinking
**Date:** 2026-06-07

GPT provided a retroactive technical review after reading the full repository. Key contributions:

- Caught the critical architectural flaw in v0.1: `quota_used` must not live in the JWT execution token. This correction drove the v0.2 revision
- Introduced the formal four-object separation: User Subscription Entitlement, Delegated AI Grant, Short-lived Execution Token, and Provider-side Usage Ledger
- Challenged the "developer pays nothing" framing and provided the more defensible precise version
- Proposed the enterprise/organization grant path as a first-class design branch
- Outlined the preflight estimate, reservation, execute, settle, release/refund flow for variable-cost and streaming workloads
- Articulated the provider CFO objection in full and provided a structured rebuttal

---

### Gemini (Google DeepMind)
**File:** `Gemini/gemini_2026-06-07_oauth-and-provider-implementation-review.md`
**Model:** Gemini
**Date:** 2026-06-07

Gemini provided a formal architecture review targeting software architects, standards reviewers, and AI provider platform teams. Key contributions:

- Produced a full OAuth 2.0 and OIDC alignment mapping table, recommending ABDS be developed as an OAuth 2.0 profile rather than a standalone protocol
- Proposed OAuth-aligned nomenclature: Authorization Server, Resource Server, Client, Access Token — making the spec more credible to standards engineers
- Provided a high-throughput reference architecture with a Mermaid component diagram decoupling authorization, grant state, token issuance, gateway enforcement, usage accounting, and abuse detection
- Defined MUST / SHOULD / MAY compliance tiers for the spec
- Produced a formal threat model table covering token replay, quota laundering, consent phishing, backend proxy abuse, prompt-injection quota drain, and model laundering
- Recommended the Backend-for-Frontend token handling pattern for consumer mobile apps
- Analysed compatibility with Google-style platform patterns (Sign-In, Workspace OAuth, Cloud IAM, Quota Projects, Marketplace Billing)
- Distinguished token introspection from usage introspection — two concepts the v0.1 spec conflated

---

## Suggested Prompts for Eliciting Further AI Contributions

**Technical review:**
> "Read SPEC.md in the ai-billing-delegation repository and identify: (1) security vulnerabilities, (2) missing edge cases, (3) implementation challenges for AI providers."

**Economic analysis:**
> "Read RATIONALE.md and evaluate the economic arguments. What is the strongest counterargument an AI provider CFO would make? How would you respond to it?"

**Standards comparison:**
> "Compare the ABDS proposal in SPEC.md to existing OAuth 2.0 extensions and open banking standards. What prior art exists? What can ABDS learn from those implementations?"

**Implementation feasibility:**
> "If you were an engineer at Anthropic, OpenAI, or Google tasked with implementing ABDS, what would be the three hardest engineering problems to solve and why?"

**Compliance maturity:**
> "Review the three-tier ABDS compliance maturity model in the Claude contribution. Is the Tier 1 requirement set genuinely achievable in weeks by a small provider? What is missing or over-specified?"
