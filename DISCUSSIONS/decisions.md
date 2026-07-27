# Design Decisions Log

This document records accepted ABDS design decisions and their rationale.

## D1: Extend OAuth Rather Than Define a New Authentication Protocol

**Decision:** ABDS profiles established OAuth mechanisms.

**Rationale:** OAuth has mature libraries, deployment experience, and extensibility. ABDS should focus on AI resource authorization and accounting.

## D2: User-Controlled Caps Are Mandatory

**Decision:** The effective consent flow MUST allow a Resource User or Provider policy to reduce the Client's requested cap.

**Rationale:** Bounded consent is essential to user trust and economic safety.

## D3: Model Scoping Is Policy-Driven

**Decision:** `model_scope` may be optional for simple grants, but Providers MUST enforce it whenever consent or policy restricts model classes.

**Rationale:** Simple apps need low friction; high-cost or routed workloads need cost and policy controls.

## D4: Sensitive Credentials Stay Out of Untrusted Clients

**Decision:** Backend-mediated token handling is the default for consumer apps. Public-client execution requires suitably short-lived, audience-restricted, sender-constrained credentials and equivalent risk controls.

## D5: ABDS Is an Open Cross-Vendor Proposal

**Decision:** ABDS is an MIT-licensed open draft, not a proprietary Provider feature or standards-body publication.

## D6: The Core Model Is Payer-Neutral

**Decision:** Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider are separate roles.

## D7: Structured Economic Policy Uses Rich Authorization Requests

**Decision:** Cap, period, model, operation, funding offer, and overage policy use OAuth Rich Authorization Requests rather than expanding top-level query parameters.

## D8: Funding Does Not Grant Data Access

**Decision:** Sponsor or organization funding does not authorize access to prompts, outputs, files, conversations, or identity.

## D9: No Silent Payer Substitution

**Decision:** When funding becomes unavailable, execution stops, uses another already-authorized source, or obtains fresh authorization.

## D10: Usage Facts and Economic Mutations Are Separate Event Families

**Decision:** A Usage Event records one physical AI attempt. A Ledger Event records reservation, settlement, release, expiry, denial, or adjustment.

**Rationale:** Technical telemetry and economic accounting have different invariants, retention, correction, and privacy requirements.

## D11: One Physical Attempt Produces One Usage Event

**Decision:** Retries, fallbacks, speculative calls, safety calls, and route failovers are independently attributable.

**Rationale:** A successful final response must not hide failed or superseded billable work.

## D12: Requested and Resolved Models Are Separate

**Decision:** Routers and aliases distinguish the model requested by the Client from the model actually executed.

**Rationale:** Cost, compatibility, safety, and audit depend on the actual execution path.

## D13: Client Attribution Is Untrusted Observability Metadata

**Decision:** Workspace, feature, workflow, agent, experiment, trace, and span references cannot alter Provider billing or authorization.

**Rationale:** These labels help explain product behavior but are controlled by the Client and may be false or malformed.

## D14: Economic Events Are Append-Only

**Decision:** Accepted usage and ledger events are immutable. Corrections use compensating adjustment events.

**Rationale:** Rewriting history breaks reconciliation, disputes, audit, and historical pricing.

## D15: Variable-Cost Execution Uses Idempotent Reservation and Settlement

**Decision:** Streaming, multimodal, batch, routed, and agentic workloads use estimate-reserve-execute-settle-release where Provider policy requires it.

**Rationale:** Final usage may be unknown at request time, and network retries must not create duplicate holds or charges.

## D16: Main Is the Canonical Current Draft

**Decision:** Accepted substantive documentation lives on `main`; Git history and release tags preserve earlier drafts.

**Rationale:** Human and AI reviewers should not need to discover parallel branches to find the current standard.
