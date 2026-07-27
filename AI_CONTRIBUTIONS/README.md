# AI Agent Contributions

This folder records technical critique and design input from AI systems including Claude, GPT, Gemini, Llama, and others.

## Canonical Specification Context

Historical contributions remain useful research evidence, but they reviewed earlier ABDS drafts. The canonical v0.5 reading set is:

1. `README.md`
2. `CHANGELOG.md`
3. `SPEC.md`
4. `USAGE_ATTRIBUTION.md`
5. `RESERVATION_SETTLEMENT.md`
6. `FLOWS.md`
7. `THREAT_MODEL.md`

The current v0.5 draft:

- separates Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider;
- supports user, organization, Sponsor, Provider-promotion, and developer funding;
- uses OAuth Rich Authorization Requests for economic policy;
- keeps mutable economic state out of tokens;
- prohibits silent payer substitution;
- separates Sponsor funding from data access;
- defines one immutable Usage Event per physical model attempt;
- separates Usage Events from economic Ledger Events;
- attributes retries, fallbacks, routes, workflows, and agent steps;
- defines reservation, settlement, release, expiry, reconciliation, and adjustment semantics;
- provides JSON Schemas and worked examples.

AI reviewers MUST NOT treat earlier examples containing mutable quota token claims as current ABDS guidance.

## Why This Exists

ABDS affects AI Providers, application developers, users, organizations, and Sponsors. Multi-model review helps expose security, OAuth, accounting, privacy, implementation, and economic blind spots that one model or author may miss.

## Contribution Workflow

1. Read the canonical v0.5 documents.
2. State the model name, version, date, and review scope.
3. Separate confirmed defects, design trade-offs, and speculative ideas.
4. Cite the affected repository sections.
5. Avoid claiming Provider endorsement or standards-body status.
6. Submit the contribution through a human-reviewed commit or pull request.

## Folder Structure

```text
AI_CONTRIBUTIONS/
├── README.md
├── Claude/
├── GPT/
├── Gemini/
├── Llama/
├── other/
└── community/
```

## File Naming Convention

```text
{model_name}_{date}_{topic}.md
```

## Recorded Contributions

### Claude Sonnet 4.6

Key contributions included identifying the bootstrapping problem, proposing staged maturity profiles, recognizing the need for Provider capability discovery, and documenting the severity of the original mutable-quota token error.

### GPT-5.5 Thinking

Key contributions included the corrected four-object architecture, removal of mutable quota from tokens, Provider-side grant and ledger authority, enterprise funding considerations, and the estimate-reserve-execute-settle-release pattern.

### Gemini

Key contributions included formal OAuth terminology and mapping, high-throughput Provider architecture, MUST/SHOULD/MAY framing, threat analysis, backend-for-frontend guidance, and separation of token introspection from usage introspection.

### GPT-5.6 Thinking - v0.5 Synthesis

The v0.5 synthesis integrated community feedback about user/workspace and agent-step cost attribution. It added:

- Provider Accounting and Client Observability planes;
- one immutable Usage Event per physical model attempt;
- separate Ledger Events for economic mutations;
- requested versus resolved model attribution;
- retry, fallback, routing, workflow, and agent-step correlation;
- idempotent reservation and settlement;
- append-only adjustment semantics;
- synchronized specification, roadmap, discovery, profiles, threats, diagrams, schemas, examples, and presentation.

This synthesis is incorporated into the canonical repository documents rather than treated as an alternative specification.

## Suggested Review Prompts

**Security:**
> Read the canonical ABDS v0.5 documents and identify authorization, attribution, reservation, settlement, event-delivery, and privacy failures.

**Provider feasibility:**
> If implementing ABDS at an AI Provider or routing gateway, identify the three hardest engineering and economic problems and propose testable mitigations.

**Accounting:**
> Test whether the Usage Event and Ledger Event separation supports retries, fallbacks, partial completion, adjustments, disputes, and historical pricing without double settlement.

**Privacy:**
> Evaluate whether Sponsor reporting and Client observability fields can be useful without exposing prompts, outputs, identity, or small-cohort behavior.

**Conformance:**
> Derive positive and negative test vectors for the Basic, Standard, Advanced, and Sponsored Funding profiles.
