# ABDS Technical Specification v0.5 (Draft)

## Abstract

The AI Billing Delegation Standard (ABDS) is an OAuth-aligned profile for bounded, provider-enforced AI resource funding and consumption. ABDS separates the Resource User, Beneficiary, Consumer Application, Funding Principal, Economic Authorizer, and AI Provider.

The v0.5 architecture combines a Provider-maintained Delegated AI Grant with short-lived Execution Tokens, immutable Usage Events, and an authoritative economic ledger. ABDS is not a new authentication protocol, payment rail, universal AI currency, or claim of Provider adoption.

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are used as described by RFC 2119 and RFC 8174.

## 1. Motivation

Consumer AI applications face recurring structural problems:

- inference costs normally accrue to the developer before revenue is proven;
- Bring Your Own Key is unsuitable for most consumers;
- every app rebuilds credits, quotas, metering, and abuse controls;
- users and organizations lack a safe way to authorize bounded third-party AI use;
- Sponsors may want to fund access without operating the application; and
- Provider invoices do not identify which user, workspace, feature, workflow, route, retry, agent step, or physical model attempt caused cost.

ABDS treats funding and metered execution as a delegated authorization and accounting problem.

## 2. Roles and Objects

| Term | Definition |
|---|---|
| **Provider** | AI Provider operating or controlling the Authorization Server, Resource Server, grant service, execution gateway, and accounting system. |
| **Resource User** | Person using the AI-enabled Client. |
| **Beneficiary** | Person or eligible class permitted to consume an allocation. |
| **Client** | Registered Consumer Application requesting and using an ABDS grant. |
| **Funding Principal** | Party whose Provider-recognized entitlement or budget is charged. |
| **Economic Authorizer** | Party permitted to commit the Funding Principal's resources. |
| **Sponsor** | Funding Principal other than the Resource User or application developer. |
| **Delegated AI Grant** | Provider-maintained authorization binding Client, Beneficiary, funding source, limits, scopes, status, and consent. |
| **Execution Token** | Short-lived OAuth access token referencing `delegation_id`. |
| **Logical Request** | One Client-level operation. |
| **Physical Model Attempt** | One actual Provider or upstream execution attempt, including retry, fallback, speculative, safety, or routing calls. |
| **Usage Event** | Immutable Provider record of what technically occurred for one physical attempt. |
| **Ledger Event** | Immutable Provider record of an economic transition such as reservation, settlement, release, expiry, denial, or adjustment. |
| **Reservation** | Temporary Provider-authoritative hold against a grant and funding bucket. |
| **Settlement** | Final Provider-authoritative debit for measured consumption. |
| **delegation_id** | Stable public grant reference used in tokens, usage views, events, logs, and revocation. |
| **funding_bucket_ref** | Opaque Provider-side reference to the charged entitlement or budget bucket; never a bearer credential. |

## 3. Core Architecture

```text
Funding Entitlement or Budget
        | authorizes and funds
Delegated AI Grant
        | referenced by
Short-lived Execution Token
        | authorizes
Provider Execution
        |-> Usage Event Plane
        |-> Economic Ledger Plane
```

The Provider Accounting Plane is authoritative. Client attribution is untrusted observability metadata and MUST NOT alter grant policy, measured usage, billed quantity, or funding-source selection.

The Execution Token MUST NOT be the source of truth for live usage, remaining quota, reset time, Sponsor balance, reservation state, price, or settlement state.

### 3.1 Funding Source Types

Providers SHOULD support one or more of:

- `user_entitlement`
- `organization_budget`
- `sponsor_budget`
- `provider_promotion`
- `developer_account`

Supported types MUST be advertised through Provider discovery.

## 4. OAuth Profile

ABDS uses or profiles:

- OAuth Authorization Code Flow;
- PKCE with `S256` for public Clients;
- Rich Authorization Requests for cap, period, model, operation, funding offer, and overage policy;
- Pushed Authorization Requests for sensitive or high-value authorization;
- Token Exchange where useful for short-lived, audience-specific execution credentials;
- Resource Indicators for target API binding; and
- DPoP, mTLS, or equivalent sender constraint for elevated-risk grants.

Until a registered identifier exists, `abds_ai_delegation` is a draft placeholder authorization-details type.

Illustrative authorization detail:

```json
{
  "type": "abds_ai_delegation",
  "actions": ["ai.execute", "ai.usage.read"],
  "locations": ["https://api.provider.example"],
  "models": ["standard-text"],
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

A Client MUST NOT name an arbitrary Provider funding account. The Authorization Server MUST validate the Client, redirect URI, funding offer, Beneficiary eligibility, requested limits, and effective Funding Principal.

## 5. Consent

The Provider MUST display:

- verified Client identity;
- Beneficiary or Resource User context;
- who pays;
- cap, unit, period, and per-request limit;
- permitted model classes and operations;
- overage and exhaustion behavior;
- expiry or renewal behavior;
- Client and Sponsor data visibility; and
- revocation controls.

The Resource User or Provider MUST be able to reduce the requested cap before approval. Sponsor funding MUST NOT imply Sponsor access to prompts, outputs, files, conversations, or identity.

## 6. Delegated AI Grant

The Provider MUST maintain a server-side grant for every active delegation. The grant SHOULD include:

- `delegation_id` and optional internal `grant_id`;
- Beneficiary and Client bindings;
- funding-source type and internal funding reference;
- Economic Authorizer type;
- unit type, cap, period, and optional per-request cap;
- model and operation scope;
- overage policy;
- status, creation, update, and expiry times.

Live used, remaining, reserved, and settled quantities are accounting state, not immutable grant-policy fields or token claims.

Grant and accounting transitions MUST be atomic or provide equivalent protection against overspend and double settlement.

## 7. Execution Token

An Execution Token MUST be short-lived, audience-restricted, scoped, bound to the Client, and reference `delegation_id`.

```json
{
  "iss": "https://auth.provider.example",
  "sub": "beneficiary_subject",
  "aud": "https://api.provider.example",
  "iat": 1784300000,
  "exp": 1784300900,
  "jti": "tok_xyz789",
  "client_id": "app_natureguard",
  "delegation_id": "del_abc123",
  "scope": "ai.execute ai.usage.read",
  "model_scope": ["standard-text"],
  "abds_version": "0.5"
}
```

The token MUST NOT contain live quota, reset, funding-source identifier, Sponsor balance, reservation, price, or settlement state. Token claims MAY only narrow Provider-side policy.

## 8. Execution Enforcement

For each logical request, the Provider MUST:

1. validate token signature, issuer, expiry, audience, Client binding, and scope;
2. resolve `delegation_id`;
3. validate grant, Beneficiary, model, operation, and funding status;
4. enforce cap, per-request, model, tool, route, and agentic limits;
5. assign or validate a stable `request_id` and unique `attempt_id`;
6. account for settled usage and active reservations;
7. reserve or debit atomically;
8. execute only inside the authorized envelope;
9. measure usage authoritatively;
10. emit Usage Events for physical attempts;
11. post idempotent Ledger Events; and
12. release unused reservations.

The Client remains responsible for its own session security, user authorization, tenancy isolation, and rate limiting.

## 9. Usage Event Profile

Each billable Physical Model Attempt MUST be independently attributable. A successful logical response MUST NOT hide failed, retried, fallback, superseded, speculative, safety, or routing attempts that consumed billable resources.

Usage Events SHOULD conform to `schemas/abds-usage-event-v0.5.schema.json` and include:

- schema and event identifiers;
- Provider-recorded time;
- `delegation_id`, Client, logical request, and physical attempt;
- operation, Provider, requested model, and resolved model;
- route, retry, and outcome context where applicable;
- extensible usage dimensions;
- funding-source type and opaque funding bucket;
- optional pricing snapshot and monetary amount; and
- optional opaque Client attribution.

The meaning and unit of each billable dimension MUST be published. Internal upstream cost and the amount charged to the Funding Principal MUST NOT be conflated.

See `USAGE_ATTRIBUTION.md` for the detailed profile.

## 10. Client Observability

The Client MAY provide opaque references for workspace, feature, workflow, agent run, agent step, experiment, trace, or span.

These fields MUST NOT contain prompts, outputs, secrets, email addresses, customer names, filenames, or raw identity. They MUST be treated as untrusted and MUST NOT change billing or funding selection.

## 11. Ledger Event Profile

Reservations, settlements, releases, expiry, denials, and adjustments SHOULD emit immutable Ledger Events conforming to `schemas/abds-ledger-event-v0.5.schema.json`.

Initial event types are:

```text
reservation_created
reservation_released
reservation_expired
settlement_posted
adjustment_posted
execution_denied
```

Usage Events describe technical facts. Ledger Events describe economic state transitions. Accepted events MUST be append-only. Corrections MUST use a compensating adjustment referencing the original event, actor, and reason.

## 12. Reservation and Settlement

Providers SHOULD use reservation and settlement for streaming, multimodal, batch, agentic, routed, or otherwise variable-cost operations:

```text
Authorize -> Estimate -> Reserve -> Execute -> Settle -> Release
```

A reservation MUST be atomically bound to one grant, Client, logical request, unit type, and funding bucket. It reaches at most one terminal state: settled, released, or expired.

Settlement MUST:

- use Provider-measured usage;
- be idempotent;
- reference billable Usage Events;
- remain within the reservation unless overage was explicitly authorized;
- retain the execution-time pricing snapshot when money is exposed; and
- release unused capacity.

A disconnect, cancellation, timeout, or partial response does not imply zero usage. See `RESERVATION_SETTLEMENT.md`.

## 13. Accounting Invariants

Implementations MUST preserve:

1. Every settled quantity maps to exactly one `delegation_id` and funding bucket.
2. One settlement identifier is accepted at most once.
3. One reservation reaches at most one terminal state.
4. Active reservations plus settled usage cannot exceed the authorized envelope except for explicit overage.
5. Retries, fallbacks, and speculative attempts remain visible.
6. Funding failure cannot silently move usage to another payer.
7. Aggregate balances are reproducible from append-only events or an equivalent auditable log.
8. Historical monetary amounts retain their pricing snapshot.
9. Client attribution cannot alter measured usage or funding selection.
10. Sponsor reporting cannot exceed the authorized privacy policy.

## 14. Usage Status and Event Access

The Provider MUST expose grant-specific usage status without revealing unrelated subscription, grant, or Sponsor information.

Providers SHOULD support at least one of:

- paginated grant-specific event retrieval;
- signed webhook delivery;
- asynchronous export; or
- Provider console download.

At-least-once delivery is acceptable. Consumers MUST deduplicate by stable event identifier. Retrieval and delivery MUST prevent cross-grant access, replay, and tampering.

## 15. Revocation and Funding Changes

The Resource User MUST be able to revoke the Client grant. The Economic Authorizer MUST be able to reduce or terminate future funding. The Provider MUST be able to suspend abusive Clients, grants, or programs.

After revocation, new execution MUST fail. In-flight work MUST stop as soon as practical, settle consumed resources, and release unused reservation capacity.

Higher caps, broader models or operations, paid overage, a new Funding Principal, broader Sponsor visibility, or a material duration extension require renewed consent.

## 16. No Silent Payer Substitution

If authorized funding is unavailable, exhausted, expired, paused, or revoked, the Provider and Client MUST NOT silently charge another party.

The request MUST stop, use another already-authorized source, or obtain fresh authorization from the new Funding Principal and affected Resource User.

## 17. Privacy and Retention

ABDS requires data minimization. Usage Events MUST NOT require prompt or output content, raw user identity, workspace names, filenames, customer names, payment-card data, unrelated account usage, or Sponsor-confidential pool balances.

Providers SHOULD separate retention for accounting, disputes, security/fraud evidence, product telemetry, and optional debugging content. Sponsor reporting SHOULD be aggregate by default and use privacy thresholds where small cohorts create re-identification risk.

## 18. Security

Providers MUST follow current OAuth security practice and MUST:

- require exact redirect URI matching and PKCE for public Clients;
- use short token lifetimes and validate audience and Client binding;
- keep economic state Provider-side;
- atomically enforce caps and reservations;
- implement immediate revocation;
- prevent cross-grant enumeration;
- apply per-Client and per-grant rate limits;
- detect quota laundering and retry amplification;
- deduplicate idempotent economic operations;
- reject forged or cross-workspace attribution attempts; and
- protect event delivery against replay and tampering.

See `THREAT_MODEL.md`.

## 19. Provider Discovery

Providers SHOULD advertise supported versions, profiles, endpoints, authorization-details type, funding-source types, unit types, model/operation scope, Usage Event and Ledger Event schema versions, event delivery, reservation, reconciliation, Sponsor programs, sender-constrained tokens, and app-verification requirements.

See `DISCOVERY.md`.

## 20. Error Registry

| Code | HTTP | Meaning |
|---|---:|---|
| `abds_invalid_delegation` | 403 | Grant is invalid for the Client, Beneficiary, audience, or resource |
| `abds_token_expired` | 401 | Execution Token expired |
| `abds_token_revoked` | 401 | Token or grant revoked |
| `abds_model_not_scoped` | 403 | Requested model is not permitted |
| `abds_operation_not_scoped` | 403 | Requested operation is not permitted |
| `abds_per_request_cap_exceeded` | 429 | Request exceeds its envelope |
| `abds_quota_exceeded` | 429 | Grant or Beneficiary cap is exhausted |
| `abds_funding_unavailable` | 403 | Authorized funding cannot cover the request |
| `abds_sponsorship_ended` | 403 | Sponsor program ended or was revoked |
| `abds_reservation_required` | 409 | Operation requires a reservation |
| `abds_reservation_denied` | 429 | Envelope cannot be reserved |
| `abds_reservation_expired` | 409 | Reservation is no longer active |
| `abds_reservation_conflict` | 409 | Idempotency key conflicts with another request |
| `abds_execution_envelope_exhausted` | 429 | Execution reached its limit |
| `abds_settlement_conflict` | 409 | Settlement conflicts with an existing terminal record |
| `abds_reconciliation_pending` | 202 | Final settlement is pending |
| `abds_attribution_invalid` | 400 | Attribution metadata is malformed or prohibited |

Errors MUST NOT expose confidential balances, unrelated grants, internal prices, or risk decisions.

## 21. Implementation Profiles

ABDS defines Basic, Standard, Advanced / Enterprise, and Sponsored Funding maturity profiles. They are not conformance badges until a test suite exists. See `IMPLEMENTATION_PROFILES.md`.

## 22. Versioning and Change Control

This specification is **v0.5 Draft**.

- **v0.5:** Added the two-plane execution model, one Usage Event per physical attempt, separate Ledger Events, requested/resolved model attribution, retry/fallback/agent correlation, extensible dimensions, reservation, settlement, reconciliation, idempotency, append-only adjustments, schemas, examples, and synchronized supporting documentation.
- **v0.4:** Added payer-neutral and Sponsor funding, Rich Authorization Requests, Sponsor privacy, and no silent payer substitution.
- **v0.3:** Added OAuth terminology, PKCE, discovery, profiles, `delegation_id`, and threat model.
- **v0.2:** Removed mutable quota from tokens and introduced the Provider-side grant and ledger architecture.
- **v0.1:** Initial draft.

See `CHANGELOG.md` for migration guidance.

## 23. Machine-Readable Artifacts

- `schemas/abds-usage-event-v0.5.schema.json`
- `schemas/abds-ledger-event-v0.5.schema.json`
- `examples/usage-event-agent-fallback.json`
- `examples/reservation-settlement-sequence.json`

## 24. Standards References

- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119)
- [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749)
- [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636)
- [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)
- [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414)
- [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693)
- [RFC 8707](https://www.rfc-editor.org/rfc/rfc8707)
- [RFC 9126](https://www.rfc-editor.org/rfc/rfc9126)
- [RFC 9396](https://www.rfc-editor.org/rfc/rfc9396)
- [RFC 9449](https://www.rfc-editor.org/rfc/rfc9449)
- [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700)

---

Feedback and contributions are welcome through GitHub Issues and Pull Requests.
