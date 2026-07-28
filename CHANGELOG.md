# ABDS Upgrade Change Control

> Concise record of material changes between draft versions of the Artificial Intelligence Billing Delegation Standard.

`SPEC.md` remains the canonical technical draft. This file records the version-to-version upgrade.

## Version Summary

| Version | Theme | Material outcome |
|---|---|---|
| v0.1 | Initial proposal | Introduced user-authorized AI usage delegation but incorrectly placed mutable quota state in token claims |
| v0.2 | Four-object correction | Moved live quota to a Provider-side grant and ledger |
| v0.3 | OAuth hardening | Added OAuth terminology, PKCE, discovery, profiles, threat model, and public `delegation_id` |
| v0.4 | Payer-neutral funding | Added Funding Principal, Economic Authorizer, Beneficiary, Sponsor funding, privacy, and no silent payer substitution |
| v0.5 | Usage attribution and settlement | Added one event per physical attempt, separate Ledger Events, reservation, settlement, schemas, and examples |
| v0.6 | Evidence, consent, and reconciliation | Added scoped ordering, evidence provenance, Consent Receipts, late-usage reconciliation, replay controls, and negative tests |

## v0.6 — Evidence, Consent, and Reconciliation

**Status:** Current draft.

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

### Added positive examples

- `examples/gateway-attested-usage-event.json`
- `examples/provider-signed-usage-event.json`
- `examples/sponsor-consent-receipt.json`
- `examples/late-usage-reconciliation.json`

### Added negative fixtures

- duplicate Usage Event replay;
- duplicate settlement identifier;
- unbound Consent Receipt;
- conflicting event ordering;
- mismatched provider-signature fixture;
- late-usage double-charge arithmetic.

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

5. Added immutable Consent Receipts binding:

```text
grant
Client
Beneficiary
payer
spend ceiling
model / operation / workload scope
overage
duration
privacy
revocation
policy version
integrity
```

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
- A Provider may support both v0.5 and v0.6.
- v0.6 support must be advertised through discovery.
- Gateway-attested evidence is transitional and must not be described as Provider-signed.
- No v0.6 field expands the funding, model, operation, workload, or data access authorized by the grant.

### Migration guidance

Implementers moving from v0.5 should:

1. preserve existing v0.5 event identifiers and immutable history;
2. add scoped event sequence metadata;
3. distinguish estimated, gateway-observed, Provider-reported, and Provider-final usage;
4. classify the evidence source;
5. issue a Consent Receipt for new or materially changed grants;
6. retain unique token `jti` and replay state;
7. append Reconciliation Events for late or corrected usage;
8. post compensating Ledger adjustments rather than rewriting settlements;
9. preserve Client and Beneficiary attribution;
10. advertise v0.6 capabilities in Provider metadata.

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

- `main` contains the current canonical draft.
- Material accepted changes update this file and the `SPEC.md` changelog.
- Historical drafts are preserved through Git history and release tags where available, not parallel canonical branches.
- Published schema identifiers are not silently repurposed.
- A draft version does not claim standards-body approval or Provider adoption.
