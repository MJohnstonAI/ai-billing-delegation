# Artificial Intelligence Billing Delegation Standard (ABDS) v0.7

> Provider Adoption & Entitlement Binding — normative draft addendum

**Status:** Draft proposal. No Provider adoption or standards-body approval is claimed.

## 1. Relationship to v0.6

ABDS v0.7 is a focused compatibility-preserving upgrade to the v0.6 architecture.

`SPEC.md` remains the v0.6 base specification. This document is the normative v0.7 addendum. An implementation claiming ABDS v0.7 support MUST satisfy the applicable v0.6 requirements plus the v0.7 requirements in this document. Where this addendum expressly changes a v0.6 rule, this addendum controls for v0.7.

v0.7 does **not** replace the v0.6 grant, Consent Receipt, Execution Token, Usage Event, evidence, reservation, settlement, ledger, reconciliation, privacy, or replay-control architecture.

The v0.7 goal is narrower:

> Make explicit how a Provider determines which user- or organization-side AI funding entitlement is eligible for delegation to a third-party Client, and lower the barrier for a Provider to evaluate ABDS without implementing every advanced profile.

## 2. New Terms

| Term | Definition |
|---|---|
| **Provider Account** | An account, tenant, organization, project, wallet, subscription, or equivalent relationship recognized by the Provider. |
| **Eligible Funding Entitlement** | A Provider-recognized balance, allowance, budget, credit, add-on, promotion, or other resource source that Provider policy permits to fund an ABDS grant. |
| **Entitlement Type** | The commercial or accounting form of an Eligible Funding Entitlement. |
| **Entitlement Resolution** | The Provider-authoritative process that determines which entitlements, if any, may fund the requested delegation for the Client, Beneficiary, operation, workload, and policy context. |
| **Application Authentication** | Authentication used to establish who is signed into the third-party Client. It is distinct from ABDS economic authorization. |
| **Economic Authorization** | Provider-controlled authorization that commits an Eligible Funding Entitlement to a bounded Delegated AI Grant. |

## 3. Identity Authentication Is Not Funding Authorization

A successful sign-in to a Client MUST NOT be interpreted as permission to consume Provider-funded AI resources.

This rule applies even where the same organization supplies both identity and AI services. For example, signing into a Client with a Google, OpenAI, Anthropic, OpenRouter, enterprise SSO, or other identity MUST NOT by itself authorize AI consumption against any account, subscription, credit balance, organization budget, or other entitlement associated with that identity.

The Client MAY reuse an authenticated user session to begin an ABDS authorization request, but the Provider MUST perform separate Entitlement Resolution and economic consent before creating or expanding a Delegated AI Grant.

## 4. Entitlement Types

ABDS v0.7 separates **who funds** from **what commercial/accounting instrument funds** the grant.

The existing `funding_source_type` identifies the funding relationship, for example:

```text
user_entitlement
organization_budget
sponsor_budget
provider_promotion
developer_account
```

v0.7 adds `entitlement_type` to describe the Provider-recognized economic form. Providers MAY support values including:

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

Providers MAY define additional entitlement types. Provider-defined values SHOULD use collision-resistant names or URIs where interoperability matters.

An entitlement type does not imply that any consumer subscription is delegable. A Provider decides whether a particular plan, balance, credit, promotion, or subscription feature is eligible for ABDS use.

## 5. Provider-Authoritative Entitlement Resolution

Before creating a new grant or materially changing its payer or entitlement, the Provider MUST perform Entitlement Resolution.

The Provider MUST determine at least:

1. the authenticated Provider Account or eligible organizational context;
2. the effective Funding Principal and Economic Authorizer;
3. which funding entitlements are eligible for the requesting Client;
4. which models, operations, workloads, regions, or risk classes the entitlement may fund;
5. the maximum delegable ceiling, period, and per-request constraints permitted by Provider policy;
6. whether the entitlement may be selected by the user, automatically selected by Provider policy, or offered only through a Provider-managed program; and
7. whether fresh consent is required because payer, entitlement, scope, duration, or economic exposure changed.

The Client MUST NOT manufacture, assert as authoritative, substitute, upgrade, or silently select a Provider entitlement.

A Client MAY request a funding source class or Provider-published funding offer, but the Provider remains authoritative for the actual entitlement selected and charged.

## 6. Entitlement Binding

A Delegated AI Grant MUST bind, directly or through Provider-authoritative internal references:

```text
delegation_id
client_id
beneficiary_ref
funding_source_type
entitlement_type
funding_bucket_ref or equivalent internal reference
economic_authorizer
consent_receipt_id
```

The public or Client-visible representation MUST NOT expose bearer credentials, private funding account identifiers, unrelated balances, or internal risk signals.

`funding_bucket_ref` remains opaque and non-authoritative outside the Provider accounting plane.

Changing the effective Funding Principal or moving to a materially different entitlement MUST NOT happen silently. It requires Provider policy validation and fresh authorization where the economic terms materially change.

## 7. Consent Requirements

The v0.7 consent experience MUST make the economic relationship understandable without requiring the Resource User to understand API keys or Provider-internal accounting.

Where relevant, the Provider SHOULD disclose:

- the verified Client requesting access;
- who or what will fund the usage;
- the entitlement category in user-understandable language;
- the maximum amount or Provider resource units that may be consumed;
- the authorization period;
- model, operation, modality, tool, or workload restrictions;
- exhaustion and overage behavior;
- whether another funding source may ever be used;
- how to inspect usage; and
- how to revoke the delegation.

The Provider MAY hide implementation-specific entitlement identifiers if the user can still understand the economic consequence.

## 8. Reference Consumer-App Flow

```text
User opens third-party AI Client
        |
        v
User authenticates to the Client
        |
        |  Application Authentication only
        v
User selects "Connect AI Usage"
        |
        v
Client redirects to AI Provider authorization
        |
        v
Provider authenticates / resolves Provider Account
        |
        v
Provider resolves Eligible Funding Entitlements
        |
        v
Provider shows economic consent
        |
        |  e.g. "Allow this app to use up to X per month"
        v
User / Economic Authorizer approves
        |
        v
Provider issues Consent Receipt
        |
        v
Provider creates Delegated AI Grant
        |
        v
Client obtains short-lived Execution Token
        |
        v
Provider executes and charges the bound entitlement
        |
        v
Provider exposes usage and revocation controls
```

The developer does not need the user's master API key and MUST NOT infer delegation merely from application sign-in.

## 9. Discovery Additions

A v0.7 Provider SHOULD advertise the following capabilities through `DISCOVERY.md` metadata:

```json
{
  "abds_versions_supported": ["0.6", "0.7"],
  "abds_entitlement_types_supported": [
    "prepaid_credit",
    "pay_as_you_go",
    "subscription_allowance"
  ],
  "abds_user_funded_delegation_supported": true,
  "abds_entitlement_selection_mode": "provider_controlled"
}
```

`abds_entitlement_selection_mode` SHOULD be one of:

```text
provider_controlled
user_selectable_from_provider_offers
provider_policy_only
```

Discovery describes Provider capability, not a particular user's balance, eligibility, private plan, funding offer, or risk decision.

## 10. Provider Adoption Profile

v0.7 introduces a lightweight **Provider Adoption Profile** for feasibility testing.

Its purpose is to let a Provider evaluate the core ABDS proposition without first implementing the full Standard or Advanced evidence and reconciliation stack.

Required:

- OAuth Authorization Code Flow or equivalent secure authorization flow;
- PKCE for public Clients;
- registered Client identity;
- separate Application Authentication and Economic Authorization;
- Provider-authoritative Entitlement Resolution;
- explicit bounded economic consent;
- Provider-side Delegated AI Grant;
- short-lived scoped execution credential containing or resolving `delegation_id` and `client_id`;
- Provider-side metering and cap enforcement;
- grant-specific usage status;
- revocation;
- no mutable economic state trusted from bearer-token claims;
- no silent payer substitution; and
- explicit statement that the implementation is experimental unless the Provider has declared production support.

Recommended:

- Consent Receipt;
- unique token `jti` and replay controls;
- basic discovery metadata;
- per-Client and per-grant limits;
- connected-app management UI; and
- audit events sufficient to reconstruct the grant's economic effect.

The Provider Adoption Profile does not confer ABDS certification or endorsement.

## 11. Adoption Status Taxonomy

To avoid confusing architectural compatibility with Provider endorsement, ABDS v0.7 defines informative status labels:

```text
conceptual
simulated
gateway_compatible
provider_evaluated
provider_pilot
provider_native
```

Meanings:

- `conceptual` — specification or design only;
- `simulated` — demonstrated against mock Provider components;
- `gateway_compatible` — implemented by an intermediary without Provider-native delegation;
- `provider_evaluated` — reviewed by a Provider, with no adoption claim;
- `provider_pilot` — Provider-supported experimental implementation;
- `provider_native` — Provider declares native production support.

A project MUST NOT self-assign `provider_evaluated`, `provider_pilot`, or `provider_native` for a named Provider without evidence from that Provider.

ABDS itself remains a draft proposal and makes no Provider-adoption claim.

## 12. New v0.7 Invariants

In addition to the v0.6 invariants:

1. Application Authentication MUST NOT imply Economic Authorization.
2. Entitlement eligibility and selection remain Provider-authoritative.
3. A Client MUST NOT manufacture, substitute, upgrade, or silently select a Provider entitlement.
4. A grant MUST resolve to one effective funding entitlement for each settled economic event.
5. Funding failure MUST NOT silently fall back to another entitlement or payer.
6. A consumer subscription or account type MUST NOT be described as ABDS-delegable unless the Provider actually supports that delegation.
7. Provider capability discovery MUST NOT reveal user-specific entitlement or balance information.

## 13. Compatibility With v0.6

v0.7 preserves:

- the payer-neutral role model;
- Consent Receipts;
- `delegation_id`;
- short-lived Execution Tokens;
- Provider-side economic authority;
- one Usage Event per physical attempt where the applicable profile requires it;
- evidence provenance;
- separate Ledger Events;
- reservation and settlement;
- reconciliation and compensating adjustment;
- Sponsor privacy;
- no silent payer substitution; and
- replay and attribution controls.

Existing v0.5 and v0.6 schema identifiers are not repurposed.

A Provider may support v0.6 and v0.7 simultaneously. v0.7 capability MUST be advertised explicitly rather than inferred from v0.6 support.

## 14. Implementation Note

ABDS deliberately does not require a Provider to fund third-party use from an existing consumer subscription. A Provider may choose prepaid credits, pay-as-you-go balances, subscription add-ons, organization budgets, Sponsor programs, promotional allocations, or another Provider-defined entitlement.

The standard defines authorization and accounting boundaries; the Provider retains commercial control.

## 15. Current Status

ABDS v0.7 is a draft specification produced by NeuroSync AI Dynamics (Pty) Ltd, Cape Town, South Africa, originated by Marc Johnston.

No Google, OpenAI, Anthropic, OpenRouter, or other Provider adoption or endorsement is claimed unless separately documented by that Provider.

See `LICENSE.md`, `COMMERCIAL_USE.md`, `NOTICE.md`, and `TRADEMARKS.md` for repository licensing and stewardship terms.