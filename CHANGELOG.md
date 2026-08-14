# ABDS Upgrade Change Control

> Concise record of material changes between draft versions of the Artificial Intelligence Billing Delegation Standard.

`SPEC.md` remains the v0.6 base specification. `SPEC_V0.7.md` is the normative v0.7 addendum. This file records version-to-version upgrades.

## Version Summary

| Version | Theme | Material outcome |
|---|---|---|
| v0.1 | Initial proposal | Introduced user-authorized AI usage delegation but incorrectly placed mutable quota state in token claims |
| v0.2 | Four-object correction | Moved live quota to a Provider-side grant and ledger |
| v0.3 | OAuth hardening | Added OAuth terminology, PKCE, discovery, profiles, threat model, and public `delegation_id` |
| v0.4 | Payer-neutral funding | Added Funding Principal, Economic Authorizer, Beneficiary, Sponsor funding, privacy, and no silent payer substitution |
| v0.5 | Usage attribution and settlement | Added one event per physical attempt, separate Ledger Events, reservation, settlement, schemas, and examples |
| v0.6 | Evidence, consent, and reconciliation | Added scoped ordering, evidence provenance, Consent Receipts, late-usage reconciliation, replay controls, and negative tests |
| v0.7 | Provider adoption and entitlement binding | Separated app login from economic authorization, added Provider-authoritative entitlement resolution, entitlement types, adoption profile, maturity labels, and a prospective licensing framework |

## v0.7 — Provider Adoption & Entitlement Binding

**Status:** Current draft.

### Problem addressed

v0.6 defined the Provider-side grant, consent, evidence, execution accounting, reservation, settlement, reconciliation, and payer-neutral funding model. It still left one commercially important boundary too implicit:

- application authentication could be confused with economic authorization;
- `user_entitlement` described who funded usage but not the commercial/accounting form of the entitlement;
- the specification did not explicitly define how a Provider determines which user-side or organization-side resources are eligible for delegation; and
- early Provider evaluation still appeared to require too much of the full Standard/Advanced implementation surface.

v0.7 addresses those gaps without changing the v0.6 accounting core.

### Added document

- `SPEC_V0.7.md` — normative v0.7 addendum

### New licensing and stewardship documents

- `LICENSE.md`
- `COMMERCIAL_USE.md`
- `NOTICE.md`
- `TRADEMARKS.md`

### Core technical changes

1. Added explicit separation between:

```text
Application Authentication
```

and:

```text
ABDS Economic Authorization
```

A successful login to a third-party Client does not authorize AI resource consumption.

2. Added Provider-authoritative **Entitlement Resolution**.

The Provider determines which funding entitlements, if any, are eligible for the requesting Client, Beneficiary, workload, model scope, and risk context.

3. Added an `entitlement_type` dimension independent from `funding_source_type`.

Illustrative entitlement types:

```text
prepaid_credit
pay_as_you_go
subscription_allowance
delegated_subscription_addon
organization_pool
sponsor_pool
promotional_credit
developer_balance
other_provider_defined
```

4. Added new Provider discovery fields:

```text
abds_entitlement_types_supported
abds_user_funded_delegation_supported
abds_entitlement_selection_mode
```

5. Added a lightweight **Provider Adoption Profile** for feasibility testing.

The profile requires the core authorization, entitlement, grant, metering, usage-status, revocation, and no-silent-payer-substitution properties without forcing an experimental Provider implementation to build the entire Advanced evidence and settlement stack first.

6. Added an informative adoption-status taxonomy:

```text
conceptual
simulated
gateway_compatible
provider_evaluated
provider_pilot
provider_native
```

A project cannot self-assign Provider-specific evaluation, pilot, or native status without Provider evidence.

7. Added the invariant:

> A Client MUST NOT manufacture, substitute, upgrade, or silently select a Provider entitlement. Entitlement eligibility and selection remain Provider-authoritative.

### Licensing change

v0.7 introduces a prospective repository licensing framework:

- specification/documentation: CC BY-NC-SA 4.0 unless a file states otherwise;
- software/executable implementation materials: PolyForm Small Business License 1.0.0 unless a file states otherwise;
- broader commercial use: separate written agreement with NeuroSync AI Dynamics (Pty) Ltd;
- historical versions: the new framework does not purport to revoke rights already validly granted for material previously described as MIT licensed;
- project names and future certification marks: governed separately by `TRADEMARKS.md`.

The repository should therefore be described as **source available**, not OSI-open-source as a whole.

### Compatibility

- v0.7 preserves the v0.4 payer-neutral funding model.
- v0.7 preserves the v0.5 Usage Event and Ledger Event separation.
- v0.7 preserves v0.6 Consent Receipts, evidence provenance, scoped ordering, reconciliation, replay controls, and append-only correction.
- Existing v0.5 and v0.6 schema identifiers are unchanged.
- A Provider may support v0.6 and v0.7 simultaneously.
- v0.7 support must be advertised explicitly through discovery.
- v0.7 does not imply that an existing consumer AI subscription is delegable.
- No Provider adoption or endorsement is claimed.

### Migration guidance

Implementers moving from v0.6 should:

1. keep application login and ABDS economic authorization as separate security decisions;
2. add an explicit Entitlement Resolution step before creating or materially changing a grant;
3. distinguish funding-source relationship from entitlement type;
4. make the Provider authoritative for entitlement eligibility and selection;
5. prevent silent entitlement or payer substitution;
6. advertise v0.7 entitlement capabilities through Provider discovery;
7. use the Provider Adoption Profile for early feasibility work where a full Standard/Advanced implementation is premature; and
8. describe Provider relationship status accurately using the v0.7 maturity taxonomy.

## v0.6 — Evidence, Consent, and Reconciliation

### Problem addressed

v0.5 defined who funded usage, which Client and physical attempts caused it, and how usage was reserved and settled. It did not fully standardize:

- whether a quantity was estimated, observed by a gateway, reported by a Provider, or cryptographically attested;
- what exact economic and privacy terms were approved;
- how distributed events are ordered;
- how late or corrected Provider usage is reconciled; or
- how a user and the application that generated high-volume traffic remain jointly attributable.

### Added documents

- `USAGE_EVENT_SCHEMA.md`
- `CONSENT_RECEIPT.md`
- `EVIDENCE_RECONCILIATION.md`

### Added schemas

- `schemas/abds-usage-event-v0.6.schema.json`
- `schemas/abds-consent-receipt-v0.6.schema.json`
- `schemas/abds-reconciliation-event-v0.6.schema.json`

### Core changes

1. Added evidence classes:

```text
provider_signed
provider_reported
gateway_attested
```

2. Added evidence states:

```text
provisional
reported
reconciled
variance_detected
disputed
adjusted
final
```

3. Added usage-measurement provenance:

```text
estimated
gateway_observed
provider_reported
provider_final
```

4. Added scoped event ordering:

```text
sequence_scope
sequence_number
previous_event_id
```

5. Added immutable Consent Receipts binding grant, Client, Beneficiary, payer, spend ceiling, model/operation/workload scope, overage, duration, privacy, revocation, policy version, and integrity.

6. Added append-only Reconciliation Events with the invariant:

```text
adjustment_quantity = provider_final_quantity - original_quantity
```

7. Required unique Execution Token `jti` and replay detection.

8. Required high-volume traffic to remain attributable to both the delegated principal and the registered Client.

### Compatibility

- v0.6 preserves the v0.4 payer-neutral funding model.
- v0.6 preserves the v0.5 Usage Event and Ledger Event separation.
- v0.5 schema files remain unchanged and available.
- Gateway-attested evidence is transitional and must not be described as Provider-signed.
- No v0.6 field expands the funding, model, operation, workload, or data access authorized by the grant.

## v0.5 — Usage Attribution and Settlement

Added:

- one immutable Usage Event per physical Provider attempt;
- requested and resolved model separation;
- logical request, retry, fallback, route, run, and step correlation;
- optional privacy-minimized Client attribution;
- separate immutable Ledger Events;
- idempotent reservation and settlement;
- append-only adjustment;
- pricing snapshots;
- schemas, examples, diagrams, discovery, profiles, and validation.

Architectural change:

```text
v0.4: Grant -> Token -> Provider Ledger

v0.5: Grant -> Token -> Provider Execution
                         |-> Usage Event Plane
                         |-> Economic Ledger Plane
```

## v0.4 — Payer-Neutral and Sponsored Delegation

- separated Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider;
- added user, organization, Sponsor, Provider-promotion, and developer funding types;
- adopted Rich Authorization Requests;
- added Sponsor privacy;
- prohibited silent payer substitution.

## v0.3 — Discovery, Profiles, and Threat Model

- aligned terminology with OAuth;
- required PKCE for public Clients;
- introduced Provider discovery;
- introduced implementation profiles;
- formalized the threat model;
- clarified public `delegation_id`;
- strengthened token handling.

## v0.2 — Four-Object Architecture

- removed mutable quota from token claims;
- introduced the Delegated AI Grant;
- introduced short-lived Execution Tokens;
- introduced the Provider-side ledger;
- distinguished token introspection from usage status;
- added atomic enforcement and revocation.

## v0.1 — Initial Draft

- introduced the developer-cost and BYOK problem;
- proposed bounded user-authorized AI usage;
- established the initial OAuth-style direction;
- contained the critical mutable-quota token design error.

## Change-Control Rules

- `main` contains the current accepted draft after release changes are merged.
- `SPEC.md` is the v0.6 base; `SPEC_V0.7.md` adds the current v0.7 normative delta.
- Material accepted changes update this file and the applicable current specification document.
- Historical drafts are preserved through Git history and release tags where available, not silently rewritten.
- Published schema identifiers are not silently repurposed.
- Licensing changes are prospective unless a valid earlier licence expressly allows otherwise.
- A draft version does not claim standards-body approval or Provider adoption.