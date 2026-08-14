# Contributing to ABDS v0.7.1

ABDS is a public draft that needs implementation evidence, adversarial critique, and Provider review before it can credibly seek formal standards discussion.

ABDS v0.7.1 is source available under the licensing framework in `LICENSE.md`; it is not presented as an OSI-open-source repository as a whole.

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
16. `PROVIDER_EVALUATION_LICENSE.md`
17. `CONTRIBUTOR_LICENSE_AGREEMENT.md`
18. `NOTICE.md`
19. `TRADEMARKS.md`

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

ABDS Studio is deferred unless implementation resources justify renewed work.

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

Do not imply that OpenAI, Google, OpenRouter, Anthropic, or another Provider supports, reviewed, endorsed, certified, piloted, funded, partnered with, or adopted ABDS unless that fact is supported by evidence from the Provider.

A gateway or sponsor-owned API account is not Provider-native ABDS.

The v0.7 adoption-status labels in `SPEC_V0.7.md` must be used conservatively.

## Contribution Rights

ABDS preserves a clean chain of title and relicensing authority so accepted work can remain maintainable and can, where appropriate, be included in future commercial provider agreements.

Before submitting substantive material, read:

- `LICENSE.md`; and
- `CONTRIBUTOR_LICENSE_AGREEMENT.md`.

For substantive pull requests, the contributor must include the following statement in the pull request:

> I agree to the ABDS Contributor Licence Agreement v1.0 in `CONTRIBUTOR_LICENSE_AGREEMENT.md`, and I represent that I have authority to grant the rights described there.

The contributor retains ownership of the contributor's original work, but grants the rights described in the Contributor Licence Agreement, including the Project Steward's ability to sublicense and relicense accepted contributions under public or commercial terms.

A submission that does not include the required rights grant may be discussed or reviewed but should not be merged as a substantive ABDS contribution until rights are resolved.

## Employer, provider, and corporate contributions

A contributor submitting work created for an employer, AI Provider, university, client, or other organization must have authority to grant the required rights.

For substantial organization-owned contributions, NeuroSync AI Dynamics may require a separately signed corporate confirmation or contributor agreement before merge.

A personal GitHub account does not by itself prove that an employee owns employer-created intellectual property.

## Small corrections

Purely factual issue reports, bug reports, suggestions, or very small non-copyrightable corrections may be accepted without a separate signed contributor agreement where no meaningful intellectual-property rights are being contributed.

The Project Steward decides whether a contribution requires additional rights documentation.

## Confidential and commercial material

Public repository submissions are not confidential.

Do not submit:

- trade secrets;
- provider-confidential architecture;
- confidential commercial terms;
- credentials;
- private user data;
- employer or client material you are not authorized to disclose; or
- information subject to an NDA.

Confidential provider review or commercial collaboration should use a separate agreed channel and, where appropriate, a confidentiality agreement.

## AI-Assisted Contributions

See `AI_CONTRIBUTIONS/README.md`.

Contributors should identify material AI assistance where practical and retain human responsibility for the final submission, including rights, accuracy, security, and licensing.

AI assistance does not relieve a contributor of the obligation to have authority to submit the final Contribution.

## Governance

ABDS was originated by Marc Johnston and is currently stewarded through the `MJohnstonAI` repository for NeuroSync AI Dynamics (Pty) Ltd, Cape Town, South Africa.

If external implementation and review grow, governance may evolve toward a documented multi-stakeholder structure representing Providers, developers, security, privacy, users, accounting, Funding Principals, and commercial stakeholders.

No governance transition is implied until it is documented.