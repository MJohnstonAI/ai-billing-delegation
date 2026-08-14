# Contributing to ABDS v0.7

ABDS is a public draft that needs implementation evidence, adversarial critique, and Provider review before it can credibly seek formal standards discussion.

ABDS v0.7 is source available under the licensing framework in `LICENSE.md`; it is not presented as an OSI-open-source repository as a whole.

## Read the Current Draft

1. `README.md`
2. `CHANGELOG.md`
3. `SPEC.md` — v0.6 base specification
4. `SPEC_V0.7.md` — current v0.7 normative addendum
5. `DISCOVERY.md`
6. `IMPLEMENTATION_PROFILES.md`
7. `FLOWS.md`
8. `USAGE_ATTRIBUTION.md`
9. `USAGE_EVENT_SCHEMA.md`
10. `RESERVATION_SETTLEMENT.md`
11. `CONSENT_RECEIPT.md`
12. `EVIDENCE_RECONCILIATION.md`
13. `THREAT_MODEL.md`
14. `LICENSE.md`
15. `COMMERCIAL_USE.md`
16. `NOTICE.md`
17. `TRADEMARKS.md`

Historical AI contributions and earlier commits are context, not current normative guidance.

## High-Value Contributions

Current priorities are deliberately narrow:

- review the separation between Application Authentication and Economic Authorization;
- challenge Provider-authoritative Entitlement Resolution;
- test whether the entitlement taxonomy is neutral across Provider business models;
- review the Provider Adoption Profile for minimum viable feasibility testing;
- review the provider-signed, provider-reported, and gateway-attested evidence hierarchy;
- propose a production asymmetric signature and canonicalization profile;
- test Consent Receipt fields against real authorization use cases;
- design invoice-level and batch reconciliation;
- add a gateway adapter without claiming Provider-native adoption;
- expand negative test vectors;
- assess OAuth, abuse, privacy, accounting, Provider economics, and consumer-protection risks.

ABDS Studio is deferred to v0.8 unless implementation resources justify earlier work.

## Normative Change Requirements

A normative change should include, where applicable:

1. a design issue or clear rationale;
2. updated decision record where accepted;
3. schema changes under a new schema version where compatibility changes;
4. positive example;
5. negative fixture;
6. validator update;
7. threat-model update where security is affected;
8. discovery/profile updates where capability changes;
9. change-control entry.

Published schema identifiers must not be silently repurposed.

## Provider and Product Claims

Use fictional domains, identifiers, models, units, and Sponsors in normative examples unless a real implementation is being accurately documented.

Do not imply that OpenAI, Google, OpenRouter, Anthropic, or another Provider supports, reviewed, endorsed, certified, piloted, or adopted ABDS unless that fact is supported by evidence from the Provider.

A gateway or sponsor-owned API account is not Provider-native ABDS.

The v0.7 adoption-status labels in `SPEC_V0.7.md` must be used conservatively.

## Contribution Licensing

Before submitting substantial material, read `LICENSE.md`.

Unless a separate written agreement applies, an intentionally submitted contribution accepted into an ABDS v0.7-or-later file is expected to be contributed under the same licence applicable to that file so the combined work can be distributed consistently.

By submitting a contribution, you represent that you have the right to submit it under the applicable terms.

Opening an issue, discussion, or pull request does not by itself transfer ownership of unrelated intellectual property to NeuroSync AI Dynamics.

NeuroSync AI Dynamics may introduce a Contributor Licence Agreement or additional provenance requirements before accepting substantial implementation, standards, or commercial integration contributions.

## AI-Assisted Contributions

See `AI_CONTRIBUTIONS/README.md`.

Contributors should identify material AI assistance where practical and retain human responsibility for the final submission, including rights, accuracy, security, and licensing.

## Governance

ABDS was originated by Marc Johnston and is currently stewarded through the `MJohnstonAI` repository for NeuroSync AI Dynamics (Pty) Ltd, Cape Town, South Africa.

If external implementation and review grow, governance may evolve toward a documented multi-stakeholder structure representing Providers, developers, security, privacy, users, accounting, Funding Principals, and commercial stakeholders.

No governance transition is implied until it is documented.