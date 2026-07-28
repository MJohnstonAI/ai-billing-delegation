# ABDS Provider Discovery v0.6

> Draft metadata for discovering ABDS authorization, consent, event, evidence, reconciliation, and accounting capabilities.

## Design Principle

Discovery describes Provider capability, not a particular user's entitlement, balance, pricing, eligibility, or Sponsor pool.

Providers SHOULD publish ABDS metadata as:

1. extensions to OAuth Authorization Server Metadata; or
2. a separately registered ABDS well-known document.

## Illustrative Metadata

```json
{
  "issuer": "https://auth.provider.example",
  "authorization_endpoint": "https://auth.provider.example/oauth/authorize",
  "token_endpoint": "https://auth.provider.example/oauth/token",
  "revocation_endpoint": "https://auth.provider.example/oauth/revoke",

  "abds_supported": true,
  "abds_versions_supported": ["0.5", "0.6"],
  "abds_profiles_supported": [
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
| `abds_funding_source_types_supported` | Yes | Enforceable funding-source types |

## v0.6 Capability Metadata

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

## Identifier Guidance

`delegation_id` is the public grant reference used in tokens, Consent Receipts, usage status, Usage Events, Reconciliation Events, Ledger Events, revocation, and connected-app records.

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
- private model access;
- Provider risk thresholds;
- internal grant identifiers;
- Sponsor pool balances;
- Beneficiary eligibility;
- private funding offers;
- contract-confidential pricing;
- signing private keys.

Public discovery describes capability. Authenticated endpoints determine entitlement and authorization.

## Open Questions

1. Should ABDS use OAuth metadata extensions, a separate well-known suffix, or both?
2. Which asymmetric signature and canonicalization profile should be mandatory?
3. Should Providers advertise failed-attempt billability rules?
4. Should the reconciliation window vary by workload class?
5. How should batch evidence and inclusion proofs be discovered?
