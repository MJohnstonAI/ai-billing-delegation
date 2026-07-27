# ABDS Upgrade Change Control

> Concise record of material changes between draft versions of the AI Billing Delegation Standard.

This document is the primary version-to-version change-control summary. `SPEC.md` remains the canonical technical draft.

## Version Summary

| Version | Theme | Material outcome |
|---|---|---|
| v0.1 | Initial proposal | Introduced user-authorized AI usage delegation but incorrectly placed mutable quota state in token claims |
| v0.2 | Four-object correction | Moved live quota to a Provider-side grant and ledger; established the grant-token-ledger separation |
| v0.3 | OAuth hardening | Added OAuth terminology, PKCE, discovery, implementation profiles, threat model, and public `delegation_id` |
| v0.4 | Payer-neutral funding | Added Funding Principal, Economic Authorizer, Beneficiary, Sponsor funding, Rich Authorization Requests, privacy rules, and no silent payer substitution |
| v0.5 | Usage attribution and settlement | Added one usage event per physical model attempt, separate ledger events, reservation and settlement, retry/fallback attribution, schemas, examples, and synchronized documentation |

## v0.5 - Usage Attribution and Settlement

**Status:** Current draft.

### Problem addressed

v0.4 could identify who authorized and funded a grant, but it did not fully standardize how Providers and application teams trace actual AI cost to product behavior. It also described reservation and settlement only at a high level.

### Added

- `USAGE_ATTRIBUTION.md`
- `RESERVATION_SETTLEMENT.md`
- `schemas/abds-usage-event-v0.5.schema.json`
- `schemas/abds-ledger-event-v0.5.schema.json`
- `examples/usage-event-agent-fallback.json`
- `examples/reservation-settlement-sequence.json`
- one immutable usage event per physical Provider execution attempt
- separate requested-model and resolved-model fields
- logical-request, retry, fallback, speculative, agent-run, and agent-step correlation
- optional privacy-minimized Client attribution for workspace, feature, workflow, and experiment
- separate immutable ledger events for reservation, settlement, release, expiry, denial, and adjustment
- idempotency boundaries for reservation and settlement
- append-only correction semantics through compensating adjustment events
- historical pricing snapshots where monetary amounts are exposed
- explicit distinction between internal upstream cost and the amount charged to the Funding Principal
- Provider discovery metadata for event schemas and reservation capabilities
- expanded implementation profiles and threat model
- synchronized Mermaid diagrams, README, roadmap, and executive presentation

### Core architectural change

```text
v0.4: Grant -> Token -> Provider Ledger

v0.5: Grant -> Token -> Provider Execution
                         |-> Usage Event Plane
                         |-> Economic Ledger Plane
```

### Compatibility

- v0.5 preserves the v0.4 payer-neutral grant model.
- Existing `delegation_id`, funding-source, consent, revocation, and no-silent-payer-substitution semantics remain valid.
- Providers can adopt usage-event reporting before exposing full monetary settlement data.
- Client attribution fields are optional and untrusted for enforcement.
- No v0.5 field authorizes broader model, operation, data, or funding access than the underlying grant.

### Migration guidance

Implementers moving from v0.4 should:

1. keep grant policy and live balances Provider-side;
2. generate a stable logical `request_id` and unique `attempt_id` for every physical attempt;
3. emit immutable usage events for billable attempts;
4. emit separate ledger events for economic mutations;
5. introduce idempotent reservation and settlement where cost is variable;
6. preserve pricing snapshots and use compensating events for corrections;
7. treat workspace, feature, workflow, and agent labels as observability metadata only;
8. update discovery metadata to advertise supported v0.5 schemas and capabilities.

## v0.4 - Payer-Neutral and Sponsored Delegation

- separated Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider;
- added user, organization, Sponsor, Provider-promotion, and developer funding-source types;
- added Sponsor-funded programs and NatureGuard example;
- adopted OAuth Rich Authorization Requests for structured economic policy;
- separated grant authorization policy from ledger state;
- established Sponsor privacy defaults;
- prohibited silent payer substitution.

## v0.3 - Discovery, Profiles, and Threat Model

- aligned terminology with OAuth Authorization Server, Resource Server, Client, and access-token concepts;
- required PKCE for public clients;
- introduced Provider discovery metadata;
- introduced Basic, Standard, Advanced, and Sponsored implementation profiles;
- formalized the threat model;
- clarified public `delegation_id` use;
- strengthened backend and sender-constrained-token guidance.

## v0.2 - Four-Object Architecture

- removed mutable `quota_used` and remaining-quota state from execution-token claims;
- introduced the Provider-maintained Delegated AI Grant;
- introduced short-lived Execution Tokens referencing `delegation_id`;
- introduced the Provider-side Usage Ledger;
- distinguished token introspection from usage introspection;
- added atomic enforcement, revocation, and usage-status concepts.

## v0.1 - Initial Draft

- introduced the developer-cost and BYOK problem;
- proposed user-authorized bounded AI usage;
- established the initial OAuth-style direction;
- contained a critical design error by treating mutable quota as token state.

## Change-Control Rules

- `main` contains the current canonical draft.
- Material accepted changes must update this document and the `SPEC.md` changelog.
- Historical events and draft versions are preserved through Git history and release tags, not parallel canonical branches.
- A draft version number does not claim standards-body approval or Provider adoption.
