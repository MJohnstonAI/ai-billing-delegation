# Contributing to ABDS v0.5

ABDS is an open draft that needs implementation evidence, adversarial critique, and Provider review before it can credibly seek formal standards discussion.

## Read the Canonical Draft First

Use this order:

1. `README.md`
2. `CHANGELOG.md`
3. `SPEC.md`
4. `USAGE_ATTRIBUTION.md`
5. `RESERVATION_SETTLEMENT.md`
6. `FLOWS.md`
7. `THREAT_MODEL.md`
8. `IMPLEMENTATION_PROFILES.md`
9. `DISCOVERY.md`

Historical AI contributions and earlier commits are research context, not current normative guidance.

## Share a Real Use Case

Open an issue titled **Use case: [application or program]** and describe:

- Resource User and Beneficiary;
- current payer and proposed Funding Principal;
- Client, feature, workflow, and model usage pattern;
- retries, routing, streaming, tools, or agent steps that affect cost;
- required caps, reservation behavior, and privacy promises;
- current billing failure or product constraint; and
- what would make the design unacceptable to a Provider.

Useful domains include consumer apps, nonprofits, education, employers, universities, government services, accessibility, research, and Provider-funded promotions.

## Review Priorities

High-value review questions include:

- Is payer-neutral funding a sound abstraction?
- Is Rich Authorization Requests the right carrier for economic policy?
- Are grant policy, Usage Events, and Ledger Events separated correctly?
- Is one event per physical model attempt practical?
- Which usage dimensions form the minimum interoperable core?
- How should failed, speculative, retry, fallback, and safety calls be billed?
- When must a Provider reserve resources before execution?
- Are settlement, release, reconciliation, and adjustment semantics idempotent and auditable?
- Can Sponsor reporting remain useful without becoming surveillance?
- What Provider economics or abuse risk would defeat adoption?

Submit changes against the relevant canonical document. Material version changes must also update `CHANGELOG.md` and the `SPEC.md` changelog.

## Build a Reference Simulator

A useful ABDS Studio implementation should include:

- mock Authorization Server, Resource Server, grant service, and Provider ledger;
- user-funded and Sponsor-funded flows;
- Provider-controlled consent;
- short-lived Execution Tokens;
- one Usage Event per physical attempt;
- requested/resolved model and retry/fallback attribution;
- reservation, settlement, released quantity, expiry, and adjustment;
- grant and program revocation;
- usage and event retrieval;
- no-silent-payer-substitution tests;
- Sponsor privacy tests;
- schema and invariant validation; and
- machine-readable conformance output.

Use fictional Provider domains and resource units unless an authorized integration exists.

## Add Technical Evidence

Especially useful contributions include:

- OAuth and Rich Authorization Request analysis;
- Provider gateway and accounting architecture;
- usage-event and ledger-event schema review;
- concurrency, idempotency, and reconciliation tests;
- event-delivery signing and replay protection;
- routing and model-alias interoperability;
- Provider economics and fraud analysis;
- Sponsor governance and privacy research;
- consent receipt design;
- OpenTelemetry mapping; and
- positive and negative conformance vectors.

## AI-Assisted Contributions

See `AI_CONTRIBUTIONS/README.md`.

Contributors must identify the model and date, distinguish generated analysis from accepted project decisions, verify technical claims against primary sources, avoid implying Provider endorsement, and retain human responsibility for the final contribution.

## Repository Workflow

The current accepted draft lives on `main`. Short-lived review branches and pull requests are welcome, but substantive accepted standards work should not remain hidden on parallel branches. Git history and release tags preserve prior states.

## Conduct and Governance

Contributions must be substantive, specific, respectful, and open to challenge. Spam, personal attacks, and misleading promotional claims will be removed.

ABDS is currently maintained by `@MJohnstonAI`. If external implementations and reviews develop, governance should move toward a multi-stakeholder model including Provider, developer, security, accounting, privacy, user, and Funding Principal perspectives.
