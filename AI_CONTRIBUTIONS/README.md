# AI Agent Contributions

This folder records technical critique and design input from AI systems including Claude, GPT, Gemini, Llama, and others.

## Canonical Specification Context

Historical contributions remain useful research evidence, but they reviewed earlier ABDS drafts. The canonical v0.6 reading set is:

1. `README.md`
2. `CHANGELOG.md`
3. `SPEC.md`
4. `USAGE_ATTRIBUTION.md`
5. `USAGE_EVENT_SCHEMA.md`
6. `RESERVATION_SETTLEMENT.md`
7. `CONSENT_RECEIPT.md`
8. `EVIDENCE_RECONCILIATION.md`
9. `FLOWS.md`
10. `THREAT_MODEL.md`

The current draft:

- separates Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider;
- supports user, organization, Sponsor, Provider-promotion, and developer funding;
- keeps mutable economic state out of Execution Tokens;
- prohibits silent payer substitution;
- separates Sponsor funding from data access;
- records one Usage Event per physical attempt;
- separates Usage Events from economic Ledger Events;
- distinguishes gateway-attested, Provider-reported, and Provider-signed evidence;
- issues immutable Consent Receipts;
- reconciles late Provider usage through append-only events and compensating adjustments.

Historical reviews do not override the canonical documents.

## Contribution Workflow

1. Read the canonical specification set.
2. Identify the model, version, date, and human contributor.
3. Separate generated analysis from accepted human decisions.
4. Cite primary technical sources where external claims are made.
5. Submit a focused issue or pull request.
6. Include schema examples and negative tests for normative changes.
7. Update the threat model for security-sensitive changes.
8. Do not claim Provider support or standards approval without evidence.

## Suggested Review Areas

- Provider evidence and signature profiles;
- Consent Receipt interoperability;
- reconciliation and invoice mapping;
- OAuth security;
- Provider economics;
- Sponsor privacy;
- abuse and workload laundering;
- reference implementation architecture;
- conformance tests.

## File Naming

```text
{model_name}_{date}_{topic}.md
```

AI-assisted contributions remain the responsibility of the human submitting them.
