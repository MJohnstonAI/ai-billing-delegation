# Contributing to ABDS

ABDS is an early payer-neutral delegation proposal. It needs evidence, critique, and implementation experience before it can credibly seek standards discussion.

## Share a Real Use Case

Open an Issue titled **"Use case: [app or program name]"** and describe:

- who uses the application,
- who currently pays for AI usage,
- who could fund it under ABDS,
- which limits and privacy promises are required,
- how the current billing model affected the product, and
- what would make the use case unacceptable to an AI Provider.

Useful examples include consumer apps, nonprofit programs, education, employers, universities, government services, accessibility tools, and Provider-funded promotions.

## Review the Specification

High-priority questions:

- Is payer-neutral funding a sound generalization?
- Should Sponsored Funding be part of the core model or an extension?
- Is OAuth 2.0 Rich Authorization Requests the right carrier for economic policy?
- Are grant authorization policy and ledger state separated correctly?
- How should token refresh and Token Exchange work?
- How should variable-cost requests reserve and settle units?
- Which Sponsor reports are useful without becoming surveillance?
- How should Beneficiary eligibility be attested?
- Which policy changes require renewed consent?
- What attack would make a Provider reject the design?

Submit improvements as Pull Requests against `SPEC.md`, `SPONSORED_DELEGATION.md`, or the relevant supporting document.

## Build a Reference Simulator

A useful reference implementation would include:

- a mock Provider Authorization Server and Resource Server,
- Provider discovery metadata,
- a user-funded flow,
- a Sponsor program and NatureGuard Client,
- provider-controlled consent,
- a grant service,
- short-lived Execution Tokens,
- a Usage Ledger,
- reservation and settlement,
- grant and program revocation,
- quota exhaustion,
- tests proving no silent payer substitution,
- tests proving Sponsor funding does not expose prompts or outputs, and
- a machine-readable conformance report.

The simulator should use fictional Provider domains and resource units. It must not imply that a real Provider implements ABDS unless that integration exists and is authorized.

## Add Technical Evidence

Especially useful contributions include:

- OAuth and authorization-details analysis,
- security and privacy review,
- Provider economics,
- Sponsor governance,
- nonprofit or public-interest funding requirements,
- ledger concurrency and idempotency,
- consent research,
- conformance test vectors, and
- comparison with established delegated authorization systems.

## AI-Assisted Contributions

See [AI_CONTRIBUTIONS/README.md](AI_CONTRIBUTIONS/README.md).

Contributors should:

- identify the model and date,
- distinguish generated analysis from human decisions,
- verify technical claims against primary sources,
- avoid claiming provider support that does not exist, and
- retain the human contributor's responsibility for the final change.

## Code of Conduct

Contributions should be substantive, specific, respectful, and open to challenge. Personal attacks, spam, and off-topic promotion will be removed.

## Governance

ABDS is currently maintained by [@MJohnstonAI](https://github.com/MJohnstonAI). If the project gains external implementation and review, governance should move toward a multi-stakeholder working group including Provider, developer, security, privacy, user, and Funding Principal perspectives.
