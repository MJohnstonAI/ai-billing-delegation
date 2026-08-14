# ABDS Provider Discovery v0.7

> Draft metadata for discovering ABDS authorization, entitlement, consent, event, evidence, reconciliation, and accounting capabilities.

## Design Principle

Discovery describes Provider capability, not a particular user's entitlement, balance, pricing, eligibility, private plan, funding offer, or Sponsor pool.

Providers SHOULD publish ABDS metadata as:

1. extensions to OAuth Authorization Server Metadata; or
2. a separately registered ABDS well-known document.

v0.7 adds entitlement-capability discovery so that a Client can learn which classes of delegated funding a Provider supports without learning whether a particular user is eligible.

## Illustrative Metadata

```json
{
  "issuer": "https://auth.provider.example",
  "authorization_endpoint": "https://auth.provider.example/oauth/authorize",
  "token_endpoint": "https://auth.provider.example/oauth/token",
  "revocation_endpoint": "https://auth.provider.example/oauth/revoke",

  "abds_supported": true,
  "abds_versions_supported": ["0.6", "0.7"],
  "abds_profiles_supported": [
    "provider_adoption",
    "basic",
    "standard",
    "advanced",
    "sponsored_funding"
  ],
  "abds_authorization_details_types_supported": [
    "abds_ai_delegation"
  ],

  "abds_usage_status_endpoint":
    "https://api.provider.example/v1/abds/delegations/{delegation_id}/usage",
  "abds_usage_events_endpoint":
    "https://api.provider.example/v1/abds/delegations/{delegation_id}/events",
  "abds_consent_receipts_endpoint":
    "https://api.provider.example/v1/abds/delegations/{delegation_id}/consent-receipts",
  "abds_reconciliation_events_endpoint":
    "https://api.provider.example/v1/abds/delegations/{delegation_id}/reconciliation",

  "abds_supported_scopes": ["ai.execute", "ai.usage.read"],
  "abds_supported_quota_periods": ["daily", "weekly", "monthly"],
  "abds_funding_source_types_supported": [
    "user_entitlement",
    "organization_budget",
    "sponsor_budget",
    "provider_promotion",
    "developer_account"
  ],

  "abds_entitlement_types_supported": [
    "prepaid_credit",
    "pay_as_you_go",
    "subscription_allowance",
    "delegated_subscription_addon",
    "organization_pool",
    "sponsor_pool",
    "promotional_credit",
    "developer_balance"
  ],
  "abds_user_funded_delegation_supported": true,
  "abds_entitlement_selection_mode": "provider_controlled",

  "abds_usage_event_schema_versions_supported": ["0.5", "0.6"],
  "abds_ledger_event_schema_versions_supported": ["0.5"],
  "abds_consent_receipt_schema_versions_supported": ["0.6"],
  "abds_reconciliation_event_schema_versions_supported": ["0.6"],

  "abds_evidence_classes_supported": [
    "gateway_attested",
    "provider_reported",
    "provider_signed"
  ],
  "abds_provider_signature_formats_supported": ["JWS"],
  "abds_provider_signing_keys_uri":
    "https://auth.provider.example/.well-known/jwks.json",
  "abds_batch_evidence_supported": false,

  "abds_event_sequence_scopes_supported": [
    "reservation",
    "run",
    "request",
    "attempt"
  ],
  "abds_event_delivery_modes_supported": [
    "paginated_retrieval",
    "signed_webhook",
    "export"
  ],

  "abds_reservation_supported": true,
  "abds_partial_settlement_supported": true,
  "abds_reconciliation_supported": true,
  "abds_reconciliation_window_seconds": 86400,
  "abds_consent_receipts_supported": true,
  "abds_workload_scope_supported": true,
  "abds_sender_constrained_tokens_supported": true,
  "abds_dpop_supported": true
}
```

## Proposed Well-Known Location

```text
GET /.well-known/abds-configuration
```

The final location and authorization-details identifier require a registration strategy.

## Required Core Metadata

| Field | Required | Description |
|---|---:|---|
| `issuer` | Yes | Provider issuer identifier |
| `abds_versions_supported` | Yes | Supported draft versions |
| `abds_profiles_supported` | Yes | Supported implementation profiles |
| `authorization_endpoint` | Yes | OAuth authorization endpoint |
| `token_endpoint` | Yes | OAuth token endpoint |
| `revocation_endpoint` | Yes | Token or grant revocation endpoint |
| `abds_usage_status_endpoint` | Yes | Provider-authoritative grant usage |
| `abds_supported_scopes` | Yes | Supported ABDS scopes |
| `abds_authorization_details_types_supported` | Yes | Supported Rich Authorization Request type |
| `abds_funding_source_types_supported` | Yes | Enforceable funding-source relationships |

## v0.7 Entitlement Metadata

| Field | Description |
|---|---|
| `abds_entitlement_types_supported` | Commercial/accounting forms the Provider may make eligible for delegation |
| `abds_user_funded_delegation_supported` | Whether a user-side entitlement may fund third-party execution at all |
| `abds_entitlement_selection_mode` | Whether the Provider selects the entitlement, allows selection from Provider offers, or uses policy-only selection |

`abds_entitlement_selection_mode` SHOULD be one of:

```text
provider_controlled
user_selectable_from_provider_offers
provider_policy_only
```

A Provider MAY publish additional values if needed, but SHOULD use collision-resistant names or URIs where interoperability matters.

### Important privacy rule

These fields describe capability only. They MUST NOT reveal:

- whether the current user has a qualifying subscription or credit balance;
- the user's remaining balance;
- account-specific pricing;
- organization membership;
- Sponsor eligibility;
- private promotional offers;
- internal risk tiers; or
- whether a particular account will be approved.

Those decisions belong to authenticated Entitlement Resolution during authorization.

## v0.6 Capability Metadata Retained in v0.7

| Field | Description |
|---|---|
| `abds_usage_event_schema_versions_supported` | Supported Usage Event versions |
| `abds_consent_receipt_schema_versions_supported` | Supported Consent Receipt versions |
| `abds_reconciliation_event_schema_versions_supported` | Supported reconciliation versions |
| `abds_evidence_classes_supported` | Gateway, Provider-reported, or Provider-signed evidence |
| `abds_provider_signature_formats_supported` | Supported production signature formats |
| `abds_provider_signing_keys_uri` | Provider verification-key discovery |
| `abds_batch_evidence_supported` | Signed batch or inclusion-proof support |
| `abds_event_sequence_scopes_supported` | Reservation, run, request, or attempt ordering |
| `abds_reconciliation_supported` | Late or corrected usage reconciliation |
| `abds_reconciliation_window_seconds` | Normal Provider evidence arrival window |
| `abds_consent_receipts_supported` | Immutable Consent Receipt support |
| `abds_workload_scope_supported` | Provider-enforced workload scope |
| `abds_sender_constrained_tokens_supported` | DPoP, mTLS, or equivalent support |

## Other Optional Metadata

- `abds_usage_dimensions_supported`
- `abds_event_delivery_modes_supported`
- `abds_reservation_supported`
- `abds_partial_settlement_supported`
- `abds_idempotency_supported`
- `abds_monetary_amounts_exposed`
- `abds_pricing_snapshot_supported`
- `abds_client_attribution_fields_supported`
- `abds_sponsorship_programs_supported`
- `abds_sponsor_reporting_modes_supported`
- `abds_delegation_management_endpoint`
- `abds_app_verification_required`
- `abds_max_delegation_period`
- `abds_max_delegated_resource_units`
- `abds_entitlement_resolution_endpoint` if a Provider exposes a dedicated authenticated interface

## Identifier Guidance

`delegation_id` remains the public grant reference used in tokens, Consent Receipts, usage status, Usage Events, Reconciliation Events, Ledger Events, revocation, and connected-app records.

An entitlement identifier or `funding_bucket_ref` MUST NOT be a bearer credential and SHOULD remain opaque outside the Provider accounting plane.

Recommended endpoint shapes:

```text
GET /v1/abds/delegations/{delegation_id}/usage
GET /v1/abds/delegations/{delegation_id}/events
GET /v1/abds/delegations/{delegation_id}/consent-receipts
GET /v1/abds/delegations/{delegation_id}/reconciliation
```

## Security and Privacy

Discovery metadata MUST NOT reveal:

- user plan or balance;
- user-specific entitlement eligibility;
- private model access;
- Provider risk thresholds;
- internal grant identifiers;
- Sponsor pool balances;
- Beneficiary eligibility;
- private funding offers;
- contract-confidential pricing;
- signing private keys.

Public discovery describes capability. Authenticated Provider systems determine entitlement, eligibility, authorization, and effective funding selection.

## Open Questions

1. Should ABDS use OAuth metadata extensions, a separate well-known suffix, or both?
2. Which asymmetric signature and canonicalization profile should be mandatory?
3. Should Providers advertise failed-attempt billability rules?
4. Should the reconciliation window vary by workload class?
5. How should batch evidence and inclusion proofs be discovered?
6. Are the v0.7 entitlement types sufficiently neutral across subscription, prepaid, organization, Sponsor, promotion, and pay-as-you-go business models?
7. Should Provider Adoption Profile support be a separate discovery flag or remain an implementation-profile value?