# Artificial Intelligence Billing Delegation Standard (ABDS) Technical Specification v0.6 (Draft)

## Abstract

The Artificial Intelligence Billing Delegation Standard (ABDS) is an OAuth-aligned profile for bounded, Provider-enforced AI resource funding and consumption.

ABDS separates the Resource User, Beneficiary, registered Client, Funding Principal, Economic Authorizer, and AI Provider. The v0.6 architecture combines:

- a Provider-maintained Delegated AI Grant;
- short-lived Execution Tokens;
- immutable Usage Events for physical attempts;
- an authoritative economic ledger;
- immutable Consent Receipts;
- evidence provenance; and
- append-only reconciliation.

ABDS is not a new authentication protocol, payment rail, universal AI currency, or claim of Provider adoption.

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are used as described by RFC 2119 and RFC 8174.

## 1. Motivation

Consumer AI applications face recurring structural problems:

- inference cost normally accrues to the developer before revenue is proven;
- Bring Your Own Key is unsuitable for most consumers;
- every application rebuilds credits, quotas, metering, and abuse controls;
- users and organizations lack a safe way to authorize bounded third-party AI use;
- Sponsors may fund access without operating the application;
- final Provider billing may differ from gateway estimates;
- retries, fallbacks, background work, and agent loops can obscure which application behavior caused cost; and
- later Provider records may arrive after an initial settlement.

ABDS treats funding and metered execution as a delegated authorization, evidence, and accounting problem.

## 2. Roles and Objects

| Term | Definition |
|---|---|
| **Provider** | AI Provider operating or controlling authorization, execution, grant policy, measurement, and accounting. |
| **Resource User** | Person using the AI-enabled Client. |
| **Beneficiary** | Person or eligible class permitted to consume an allocation. |
| **Client** | Registered Consumer Application requesting and using an ABDS grant. |
| **Funding Principal** | Party whose Provider-recognized entitlement or budget is charged. |
| **Economic Authorizer** | Party permitted to commit the Funding Principal's resources. |
| **Sponsor** | Funding Principal other than the Resource User or application developer. |
| **Consent Receipt** | Immutable record of the effective economic, workload, privacy, duration, and revocation terms approved for a grant. |
| **Delegated AI Grant** | Provider-maintained authorization binding Client, Beneficiary, funding source, limits, scopes, status, and consent. |
| **Execution Token** | Short-lived OAuth access token referencing `delegation_id`. |
| **Logical Request** | One Client-level operation. |
| **Run** | Optional grouping of requests or agent steps under a shared execution envelope. |
| **Physical Attempt** | One actual Provider or upstream execution attempt, including retry, fallback, speculative, safety, or routing calls. |
| **Usage Event** | Immutable technical record for one physical attempt. |
| **Evidence** | Provenance describing who asserts the usage facts and what integrity supports the assertion. |
| **Reconciliation Event** | Immutable comparison between earlier usage and later Provider evidence. |
| **Ledger Event** | Immutable economic state transition such as reservation, settlement, release, expiry, denial, or adjustment. |
| **Reservation** | Temporary Provider-authoritative hold against a grant and funding bucket. |
| **Settlement** | Final Provider-authoritative debit for measured consumption. |
| **`delegation_id`** | Stable public grant reference used in tokens, events, usage views, and revocation. |
| **`funding_bucket_ref`** | Opaque Provider-side reference to the charged entitlement or budget bucket; never a bearer credential. |

## 3. Core Architecture

```text
Funding Entitlement or Budget
        | authorizes
Consent Receipt
        | binds approved terms
Delegated AI Grant
        | referenced by
Short-lived Execution Token
        | authorizes
Provider Execution
        |-> Usage Event Plane
        |-> Economic Ledger Plane
Usage Event
        |-> Evidence provenance
        |-> Reconciliation
Reconciliation
        |-> no change, dispute, or compensating adjustment
```

The Provider Accounting Plane is authoritative.

Client attribution is untrusted observability metadata and MUST NOT alter grant policy, measured usage, billed quantity, or funding-source selection.

Mutable usage, remaining balance, reset time, Sponsor pool balance, reservation state, price, and settlement state MUST NOT be trusted from bearer-token claims.

## 4. Funding Source Types

Providers SHOULD support one or more of:

```text
user_entitlement
organization_budget
sponsor_budget
provider_promotion
developer_account
```

Supported types MUST be advertised through Provider discovery.

## 5. OAuth Profile

ABDS uses or profiles:

- Authorization Code Flow;
- PKCE with `S256` for public Clients;
- Rich Authorization Requests for structured economic and workload policy;
- Pushed Authorization Requests for sensitive or high-value authorization;
- Token Exchange where useful for short-lived, audience-specific execution credentials;
- Resource Indicators for target API binding; and
- DPoP, mTLS, or equivalent sender constraint for elevated-risk grants.

Until a registered identifier exists, `abds_ai_delegation` is a draft placeholder.

Illustrative authorization detail:

```json
{
  "type": "abds_ai_delegation",
  "actions": ["ai.execute", "ai.usage.read"],
  "locations": ["https://api.provider.example"],
  "models": ["economy-text"],
  "operations": ["ai.generate.text"],
  "workloads": ["workload_public_report"],
  "budget": {
    "max_units": 100,
    "unit_type": "provider_ai_unit",
    "period": "monthly",
    "per_request_max_units": 5,
    "overage": "prohibited"
  },
  "funding_offer_id": "offer_natureguard_public_2026"
}
```

A Client MUST NOT name an arbitrary Provider funding account. The Authorization Server MUST validate Client, redirect URI, funding offer, Beneficiary eligibility, requested limits, and effective Funding Principal.

## 6. Consent and Consent Receipt

The Provider MUST display:

- verified Client identity;
- Resource User or Beneficiary context;
- Funding Principal or payer;
- spend ceiling, unit, period, and per-request limit;
- permitted model classes, operations, and enforceable workload scope;
- overage and exhaustion behavior;
- effective and expiry times;
- Client and Sponsor data visibility;
- revocation controls; and
- whether another funding source can ever be used.

After approval, the Provider MUST issue or retain a Consent Receipt conforming to `schemas/abds-consent-receipt-v0.6.schema.json`.

The receipt MUST bind at least:

```text
consent_receipt_id
delegation_id
client_id
beneficiary_ref
funding_source_type
spend_ceiling
overage_policy
policy_version
data_visibility
issued_at
expires_at
issuer
integrity
```

The Resource User or Provider MUST be able to reduce the requested cap before approval.

Higher caps, broader model, operation, or workload scope, paid overage, a new Funding Principal, broader Sponsor visibility, or material duration extension requires a new receipt and renewed authorization where applicable.

Funding MUST NOT imply Sponsor access to prompts, outputs, files, conversations, precise location, or identity.

## 7. Delegated AI Grant

The Provider MUST maintain a server-side grant for every active delegation.

The grant SHOULD include:

- `delegation_id` and optional internal `grant_id`;
- `consent_receipt_id` and policy version;
- Beneficiary and Client binding;
- funding-source type and internal funding reference;
- Economic Authorizer type;
- unit type, cap, period, and optional per-request cap;
- model, operation, and enforceable workload scope;
- overage and exhaustion policy;
- status, creation, update, and expiry times.

Live used, remaining, reserved, reconciled, and settled quantities are accounting state, not immutable grant-policy fields or token claims.

Grant and accounting transitions MUST be atomic or provide equivalent protection against overspend and double settlement.

## 8. Execution Token

An Execution Token MUST contain or resolve:

```text
iss
aud
client_id
delegation_id
jti
iat
exp
scope
abds_version
```

It MUST be:

- short-lived;
- audience-restricted;
- scoped;
- bound to the registered Client;
- uniquely replay-correlated through `jti`; and
- rejected after grant revocation.

Illustrative claims:

```json
{
  "iss": "https://auth.provider.example",
  "sub": "beneficiary_subject",
  "aud": "https://api.provider.example",
  "iat": 1785300000,
  "exp": 1785300900,
  "jti": "tok_xyz789",
  "client_id": "app_natureguard",
  "delegation_id": "del_abc123",
  "scope": "ai.execute ai.usage.read",
  "abds_version": "0.6"
}
```

A token MUST NOT contain live quota, remaining balance, funding-source identifier, Sponsor balance, reservation, price, reconciliation, or settlement state.

For elevated-risk grants, Providers SHOULD use DPoP, mTLS, one-time execution nonces, or equivalent sender constraint.

## 9. Execution Enforcement

For each logical request, the Provider MUST:

1. validate token signature, issuer, expiry, audience, `jti`, Client binding, and scope;
2. resolve `delegation_id`;
3. validate grant, Consent Receipt, Beneficiary, model, operation, workload, and funding status;
4. enforce cap, per-request, model, tool, route, and agentic limits;
5. assign or validate stable `request_id`, optional `run_id`, and unique `attempt_id`;
6. account for settled usage and active reservations;
7. reserve or debit atomically;
8. execute only inside the authorized envelope;
9. measure usage authoritatively;
10. emit one Usage Event for each billable physical attempt;
11. preserve evidence provenance;
12. post idempotent Ledger Events;
13. reconcile later Provider evidence where required; and
14. release unused reservation capacity.

The Client remains responsible for its own session security, tenancy isolation, user authorization, and rate limiting.

## 10. Usage Event Profile

Each billable Physical Attempt MUST be independently attributable.

A successful logical response MUST NOT hide failed, retried, fallback, superseded, speculative, safety, or routing attempts that consumed billable resources.

v0.6 Usage Events SHOULD conform to `schemas/abds-usage-event-v0.6.schema.json` and include:

- stable event, grant, Client, request, run, and attempt identifiers;
- scoped sequence ordering;
- execution and observation timestamps;
- requested and resolved model context;
- extensible usage dimensions;
- separate estimated, gateway-observed, Provider-reported, and Provider-final measurements where available;
- funding-source type and opaque funding bucket;
- optional pricing snapshot and monetary amount;
- evidence class and status;
- reconciliation state; and
- optional privacy-minimized Client attribution.

See `USAGE_EVENT_SCHEMA.md`.

## 11. Event Ordering

Each v0.6 Usage Event MUST include:

```text
sequence_scope
sequence_number
```

The sequence scope is one of:

```text
reservation
run
request
attempt
```

Sequence numbers MUST be unique and monotonically increasing within the identified scope.

`previous_event_id` SHOULD link the immediately preceding event where known.

ABDS does not require a global Provider-wide sequence.

At-least-once delivery is permitted. Consumers MUST deduplicate by stable event identifier and MUST treat reuse of an identifier with different content as a conflict.

## 12. Evidence Profile

`evidence.class` is one of:

```text
provider_signed
provider_reported
gateway_attested
```

- `provider_signed` is the provider-native authoritative target.
- `provider_reported` represents authenticated Provider API, usage, export, or billing data.
- `gateway_attested` represents intermediary observation and is provisional unless reconciled.

A gateway MUST NOT represent its own estimate or observation as Provider-authoritative evidence.

Provider-signed evidence SHOULD bind issuer, Provider request and event identifiers, payload digest, key identifier, signature format, signature, and signed time.

Production signatures SHOULD use asymmetric keys and support key rotation. High-volume Providers MAY sign batch manifests or Merkle roots with verifiable event inclusion proofs.

See `EVIDENCE_RECONCILIATION.md`.

## 13. Client Observability and Dual Attribution

The Client MAY provide opaque references for:

```text
workspace
feature
workflow
workload
agent run
agent step
experiment
trace
span
```

These fields MUST NOT contain prompts, outputs, secrets, email addresses, customer names, filenames, or raw identity.

High-volume traffic MUST remain attributable to both:

1. the delegated principal or Beneficiary; and
2. the registered Client that generated the traffic.

Application retries, routing, speculative execution, background work, and agent loops MUST NOT make an individual user appear to be the sole origin of the traffic.

## 14. Ledger Event Profile

Reservations, settlements, releases, expiry, denials, and adjustments SHOULD emit immutable Ledger Events.

Initial event types remain:

```text
reservation_created
reservation_released
reservation_expired
settlement_posted
adjustment_posted
execution_denied
```

Usage Events describe technical facts. Ledger Events describe economic transitions.

Accepted events MUST be append-only. Corrections MUST use a compensating adjustment referencing the original event, actor, reason, and idempotency key.

## 15. Reservation and Settlement

Providers SHOULD use reservation and settlement for streaming, multimodal, batch, routed, agentic, or otherwise variable-cost operations:

```text
Authorize -> Estimate -> Reserve -> Execute -> Settle -> Release
```

A reservation MUST be bound to one grant, Client, request or run, unit type, and funding bucket.

It reaches one terminal finalization: settled, released, or expired.

Settlement MUST:

- use Provider-measured or Provider-final usage;
- be idempotent;
- reference billable Usage Events;
- remain within the reservation unless overage was explicitly authorized;
- preserve the execution-time pricing snapshot when money is exposed; and
- release unused capacity.

A disconnect, cancellation, timeout, or partial response does not imply zero usage.

See `RESERVATION_SETTLEMENT.md`.

## 16. Reconciliation

A Reconciliation Event compares earlier usage with later Provider evidence.

It SHOULD conform to `schemas/abds-reconciliation-event-v0.6.schema.json`.

The arithmetic invariant is:

```text
adjustment_quantity = provider_final_quantity - original_quantity
```

A zero variance produces `no_change`.

A non-zero variance produces an idempotent compensating adjustment or a dispute state.

Late or corrected Provider evidence MUST NOT overwrite the original Usage Event or settlement.

A Reconciliation Event MUST preserve:

- `delegation_id`;
- `client_id`;
- `request_id`;
- source Usage Event reference;
- unit type;
- funding bucket; and
- Provider request or billing record reference.

Unmatched Provider charges and missing Provider records MUST enter an investigation state rather than be silently charged twice.

## 17. Accounting Invariants

Implementations MUST preserve:

1. Every settled quantity maps to exactly one `delegation_id` and funding bucket.
2. One settlement identifier is accepted at most once.
3. One reservation reaches one terminal finalization.
4. Active reservations plus settled usage cannot exceed the authorized envelope except for explicit overage.
5. Retries, fallbacks, speculative calls, and application-generated traffic remain visible.
6. Funding failure cannot silently move usage to another payer.
7. Aggregate balances are reproducible from append-only events or an equivalent auditable log.
8. Historical monetary amounts retain their pricing snapshot.
9. Client attribution cannot alter measured usage or funding selection.
10. Consent Receipt identifiers cannot be reused for different approved terms.
11. Usage Event identifiers and scoped sequence numbers are unique.
12. Gateway-attested evidence cannot be treated as Provider-signed.
13. Reconciliation arithmetic is reproducible.
14. Late usage cannot create duplicate settlement.
15. Sponsor reporting cannot exceed the authorized privacy policy.

## 18. Usage Status and Event Access

The Provider MUST expose grant-specific usage status without revealing unrelated subscription, grant, or Sponsor information.

Providers SHOULD support at least one of:

- paginated grant-specific event retrieval;
- signed webhook delivery;
- asynchronous export;
- Provider console download.

Retrieval and delivery MUST prevent cross-grant access, replay, tampering, and identifier collision.

## 19. Revocation and Funding Changes

The Resource User MUST be able to revoke the Client grant.

The Economic Authorizer MUST be able to reduce or terminate future funding.

The Provider MUST be able to suspend abusive Clients, grants, or programs.

After revocation, new execution MUST fail. In-flight work MUST stop as soon as practical, settle consumed resources, and release unused reservation capacity.

## 20. No Silent Payer Substitution

If authorized funding is unavailable, exhausted, expired, paused, or revoked, the Provider and Client MUST NOT silently charge another party.

The request MUST stop, use another already-authorized source, or obtain fresh authorization from the new Funding Principal and affected Resource User.

## 21. Privacy and Retention

ABDS requires data minimization.

Usage, Consent, Reconciliation, and Ledger Events MUST NOT require prompt or output content, raw user identity, workspace names, filenames, customer names, payment-card data, unrelated account usage, or Sponsor-confidential pool balances.

Providers SHOULD separate retention for:

- consent and disputes;
- accounting and reconciliation;
- security and fraud evidence;
- product telemetry; and
- optional debugging content.

Sponsor reporting SHOULD be aggregate by default and use privacy thresholds where small cohorts create re-identification risk.

## 22. Security

Providers MUST follow current OAuth security practice and MUST:

- require exact redirect URI matching and PKCE for public Clients;
- use short token lifetimes;
- validate audience, Client binding, and unique `jti`;
- maintain replay detection appropriate to token lifetime and risk;
- keep economic state Provider-side;
- atomically enforce caps and reservations;
- implement immediate revocation;
- prevent cross-grant enumeration;
- apply per-Client and per-grant rate limits;
- detect quota laundering, workload laundering, and retry amplification;
- deduplicate idempotent economic operations;
- reject forged or cross-workspace attribution;
- verify evidence provenance before treating it as authoritative;
- detect event omission, reordering, and identifier reuse;
- protect event delivery against replay and tampering; and
- protect signing keys and support rotation.

See `THREAT_MODEL.md`.

## 23. Provider Discovery

Providers SHOULD advertise:

- supported ABDS versions and profiles;
- authorization and token endpoints;
- Consent Receipt support;
- supported Usage Event schema versions;
- evidence classes;
- signature formats and key-discovery URI;
- Reconciliation Event schema versions;
- reconciliation support and window;
- Ledger Event schema versions;
- funding-source types;
- event delivery modes;
- reservation and settlement capabilities;
- sender-constrained-token support; and
- grant-management endpoint.

See `DISCOVERY.md`.

## 24. Implementation Profiles

Implementations MAY adopt Basic, Standard, Advanced / Enterprise, or Sponsored Funding profiles.

v0.6 adds:

- Consent Receipts to Standard;
- explicit evidence class to Standard;
- Provider-signed or equivalent high-assurance evidence to Advanced;
- reconciliation for gateway or delayed Provider records;
- workload attribution and replay controls.

See `IMPLEMENTATION_PROFILES.md`.

## 25. Errors

Providers SHOULD expose structured errors including:

```text
abds_invalid_consent_receipt
abds_consent_expired
abds_workload_not_allowed
abds_token_replay
abds_event_conflict
abds_evidence_unverified
abds_reconciliation_pending
abds_reconciliation_conflict
abds_funding_unavailable
abds_quota_exceeded
```

Errors MUST NOT expose unrelated balances, Sponsor-confidential information, signing-key material, internal pricing, or risk signals.

## 26. Compatibility

v0.6 preserves:

- payer-neutral roles and funding types;
- Rich Authorization Request policy;
- `delegation_id`;
- no mutable quota in tokens;
- no silent payer substitution;
- Sponsor privacy;
- one Usage Event per physical attempt;
- separate Ledger Events;
- reservation and settlement;
- append-only correction.

v0.5 schemas remain valid for implementations that do not yet expose Consent Receipts, evidence provenance, scoped ordering, or Reconciliation Events.

A v0.6 implementation MUST advertise schema support rather than silently emitting v0.6 fields under a v0.5 schema identifier.

## 27. Conformance

The repository validator checks:

- v0.5 compatibility;
- v0.6 JSON Schema validity;
- event identifier and sequence uniqueness;
- Consent Receipt binding and digest;
- reference provider-signature fixture;
- reconciliation arithmetic;
- funding-bucket consistency;
- duplicate settlement rejection;
- late-usage double-charge rejection.

Passing repository tests does not constitute formal standards certification or Provider endorsement.

## 28. Changelog

### v0.6

Added:

- `USAGE_EVENT_SCHEMA.md`;
- `CONSENT_RECEIPT.md`;
- `EVIDENCE_RECONCILIATION.md`;
- v0.6 Usage Event, Consent Receipt, and Reconciliation Event schemas;
- provider-signed, provider-reported, and gateway-attested evidence classes;
- scoped event ordering;
- formal Consent Receipts;
- append-only late-usage reconciliation;
- unique Execution Token `jti` and replay requirements;
- dual Client and Beneficiary attribution;
- positive and negative conformance fixtures.

### v0.5

Added one Usage Event per physical attempt, separate Ledger Events, reservation and settlement, retry and fallback attribution, schemas, examples, and synchronized documentation.

## 29. Open Questions

1. Which asymmetric signature and canonicalization profile should be mandatory?
2. Should Provider-signed evidence be Standard or Advanced?
3. How should batch manifests and Merkle inclusion proofs be standardized?
4. How should invoice-level aggregate usage be allocated to individual physical attempts?
5. Which Consent Receipt fields are the minimum interoperable core?
6. What reconciliation window is appropriate for interactive, batch, and routed workloads?
7. Which workload scopes can a Provider enforce without trusting Client labels?
8. How should key compromise affect previously verified evidence?
