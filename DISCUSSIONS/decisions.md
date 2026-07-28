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

## D4: Sensitive Credentials Stay Out of Untrusted Clients

**Decision:** Backend-mediated token handling is the default for consumer apps. Public-client execution requires short-lived, audience-restricted, sender-constrained credentials and equivalent risk controls.

## D5: ABDS Is an Open Cross-Vendor Proposal

**Decision:** ABDS is an MIT-licensed open draft, not a proprietary Provider feature or standards-body publication.

## D6: The Core Model Is Payer-Neutral

**Decision:** Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider are separate roles.

## D7: Structured Economic Policy Uses Rich Authorization Requests

**Decision:** Cap, period, model, operation, funding offer, and overage policy use OAuth Rich Authorization Requests rather than expanding top-level query parameters.

## D8: Funding Does Not Grant Data Access

**Decision:** Sponsor or organization funding does not authorize access to prompts, outputs, files, conversations, precise location, or identity.

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

## D13: Client Attribution Is Untrusted Observability Metadata

**Decision:** Workspace, feature, workflow, workload, agent, experiment, trace, and span references cannot alter Provider billing or authorization.

## D14: Economic Events Are Append-Only

**Decision:** Accepted Usage, Reconciliation, and Ledger Events are immutable. Corrections use compensating adjustment events.

## D15: Variable-Cost Execution Uses Idempotent Reservation and Settlement

**Decision:** Streaming, multimodal, batch, routed, and agentic workloads use estimate-reserve-execute-settle-release where Provider policy requires it.

## D16: Main Is the Canonical Current Draft

**Decision:** Accepted substantive documentation lives on `main`; Git history and release tags preserve earlier drafts.

## D17: Stable Identifiers Replace Repeated Domain Objects

**Decision:** Usage and accounting events use stable or pairwise references rather than copying user, workspace, application, or Sponsor objects into each event.

**Rationale:** Stable identifiers reduce payload size, stale duplicated data, privacy exposure, and inconsistent object snapshots.

## D18: Run-Level Reservation May Have Append-Only Child Events

**Decision:** One run- or request-level reservation may cover append-only child events for agent steps, model calls, retries, fallbacks, and tool calls, followed by one terminal settlement.

**Rationale:** This avoids double charging while preserving failed and superseded attempts for audit.

## D19: Evidence Has an Explicit Authority Class

**Decision:** ABDS distinguishes `provider_signed`, `provider_reported`, and `gateway_attested` evidence.

**Rationale:** A gateway can prove what it observed but cannot independently assert what the Provider authoritatively measured or charged.

## D20: Provider-Signed Evidence Is the Provider-Native Target

**Decision:** Provider-signed Usage Events, settlement receipts, or verifiable batch manifests are the preferred provider-native evidence model. Gateway-attested events are transitional and require reconciliation where Provider records exist.

**Rationale:** The Provider controls execution, measurement, pricing, and the charged funding bucket.

## D21: Consent Receipts Are Immutable and Versioned

**Decision:** Every new or materially changed grant has an immutable Consent Receipt binding payer, ceiling, scope, duration, privacy, revocation, policy version, and integrity evidence.

**Rationale:** Current grant state alone does not prove what the user or Economic Authorizer approved at an earlier time.

## D22: Late Usage Uses Append-Only Reconciliation

**Decision:** Late or corrected Provider usage creates a Reconciliation Event and, where required, a compensating Ledger adjustment. Original Usage Events and settlements are not rewritten.

**Rationale:** Reconciliation, audit, disputes, and historical pricing require immutable prior records.

## D23: Event Ordering Is Scoped, Not Global

**Decision:** Usage Events carry a sequence number scoped to a reservation, run, request, or attempt. ABDS does not require one globally ordered Provider event stream.

**Rationale:** Distributed systems cannot reliably provide one global sequence without unnecessary coordination.

## D24: Execution Tokens Require Unique Replay Correlation

**Decision:** Every Execution Token includes a unique `jti`, short expiry, audience and Client binding, and replay controls appropriate to the grant risk.

**Rationale:** Economic authorization tokens can consume scarce resources and must not be reusable without detection.

## D25: High-Volume Traffic Has Dual Attribution

**Decision:** Provider records preserve attribution to both the delegated principal or Beneficiary and the registered Client that generated the workload.

**Rationale:** Application retries, routing, background work, and agent loops must not make an individual user appear to be the sole source of traffic.
