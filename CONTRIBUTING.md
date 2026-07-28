# Contributing to ABDS v0.6

ABDS is an open draft that needs implementation evidence, adversarial critique, and Provider review before it can credibly seek formal standards discussion.

## Read the Canonical Draft

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
11. `IMPLEMENTATION_PROFILES.md`
12. `DISCOVERY.md`

Historical AI contributions and earlier commits are context, not current normative guidance.

## High-Value Contributions

- review the provider-signed, provider-reported, and gateway-attested evidence hierarchy;
- propose a production asymmetric signature and canonicalization profile;
- test Consent Receipt fields against real authorization use cases;
- design invoice-level and batch reconciliation;
- build ABDS Studio or a mock Provider;
- add a gateway adapter without claiming provider-native adoption;
- expand negative test vectors;
- assess OAuth, abuse, privacy, accounting, and Provider economics.

## Normative Change Requirements

A normative change should include:

1. a design issue or clear rationale;
2. updated decision record where accepted;
3. schema changes under a new schema version where compatibility changes;
4. positive example;
5. negative fixture;
6. validator update;
7. threat-model update where security is affected;
8. change-control entry.

Published schema identifiers must not be silently repurposed.

## Provider and Product Claims

Use fictional domains, identifiers, models, units, and Sponsors in examples.

Do not imply that OpenAI, Google, OpenRouter, Anthropic, or another Provider supports ABDS unless that support is publicly documented and accurately cited.

A gateway or sponsor-owned API account is a transitional adapter, not provider-native ABDS.

## AI-Assisted Contributions

See `AI_CONTRIBUTIONS/README.md`.

Contributors should identify the AI model and retain human responsibility for the final submission.

## Governance

ABDS is currently maintained by [@MJohnstonAI](https://github.com/MJohnstonAI). If external implementation and review grow, governance should move toward a multi-stakeholder group representing Providers, developers, security, privacy, users, accounting, and Funding Principals.
