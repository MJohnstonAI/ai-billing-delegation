# ABDS Provider Discovery v0.5

> Draft metadata for discovering ABDS endpoints, profiles, event schemas, and execution-accounting capabilities.

## Design Principle

ABDS discovery SHOULD extend established OAuth metadata practices. Discovery describes Provider capability, not a particular user's entitlement or balance.

Providers SHOULD publish ABDS metadata as either:

1. extensions to OAuth Authorization Server Metadata; or
2. a separately registered ABDS well-known document.

## Option A: OAuth Metadata Extensions

```json
{
  "issuer": "https://auth.provider.example",
  "authorization_endpoint": "https://auth.provider.example/oauth/authorize",
  "token_endpoint": "https://auth.provider.example/oauth/token",
  "revocation_endpoint": "https://auth.provider.example/oauth/revoke",
  "abds_supported": true,
  "abds_versions_supported": ["0.5"],
  "abds_profiles_supported": ["basic", "standard", "advanced", "sponsored_funding"],
  "abds_authorization_details_types_supported": ["abds_ai_delegation"],
  "abds_usage_status_endpoint": "https://api.provider.example/v1/abds/delegations/{delegation_id}/usage",
  "abds_usage_events_endpoint": "https://api.provider.example/v1/abds/delegations/{delegation_id}/events",
  "abds_supported_scopes": ["ai.execute", "ai.usage.read"],
  "abds_supported_quota_periods": ["daily", "weekly", "monthly"],
  "abds_funding_source_types_supported": [
    "user_entitlement",
    "organization_budget",
    "sponsor_budget",
    "provider_promotion",
    "developer_account"
  ],
  "abds_usage_event_schema_versions_supported": ["0.5"],
  "abds_ledger_event_schema_versions_supported": ["0.5"],
  "abds_usage_dimensions_supported": [
    "input_tokens",
    "output_tokens",
    "cached_input_tokens",
    "reasoning_tokens",
    "image_input",
    "tool_calls"
  ],
  "abds_event_delivery_modes_supported": ["paginated_retrieval", "signed_webhook", "export"],
  "abds_reservation_supported": true,
  "abds_partial_settlement_supported": true,
  "abds_reconciliation_supported": true,
  "abds_sponsorship_programs_supported": true,
  "abds_model_scope_supported": true,
  "abds_sender_constrained_tokens_supported": true
}
```

## Option B: ABDS-Specific Metadata Document

Proposed location:

```text
GET /.well-known/abds-configuration
```

```json
{
  "issuer": "https://auth.provider.example",
  "abds_versions_supported": ["0.5"],
  "profiles_supported": ["basic", "standard", "advanced", "sponsored_funding"],
  "authorization_details_types_supported": ["abds_ai_delegation"],
  "authorization_endpoint": "https://auth.provider.example/oauth/authorize",
  "token_endpoint": "https://auth.provider.example/oauth/token",
  "revocation_endpoint": "https://auth.provider.example/oauth/revoke",
  "token_exchange_supported": true,
  "resource_indicators_supported": true,
  "usage_status_endpoint": "https://api.provider.example/v1/abds/delegations/{delegation_id}/usage",
  "usage_events_endpoint": "https://api.provider.example/v1/abds/delegations/{delegation_id}/events",
  "delegation_management_endpoint": "https://provider.example/account/connected-apps",
  "supported_scopes": ["ai.execute", "ai.usage.read"],
  "supported_quota_periods": ["daily", "weekly", "monthly"],
  "funding_source_types_supported": [
    "user_entitlement",
    "organization_budget",
    "sponsor_budget",
    "provider_promotion",
    "developer_account"
  ],
  "usage_event_schema_versions_supported": ["0.5"],
  "ledger_event_schema_versions_supported": ["0.5"],
  "usage_dimensions_supported": ["input_tokens", "output_tokens", "image_input", "tool_calls"],
  "event_delivery_modes_supported": ["paginated_retrieval", "signed_webhook"],
  "reservation_supported": true,
  "partial_settlement_supported": true,
  "reconciliation_supported": true,
  "idempotency_supported": true,
  "sponsorship_programs_supported": true,
  "model_scope_supported": true,
  "sender_constrained_tokens_supported": true,
  "dpop_supported": true,
  "par_supported": true,
  "consent_receipts_supported": false
}
```

## Required Metadata

| Field | Required | Description |
|---|---:|---|
| `issuer` | Yes | Provider issuer identifier |
| `abds_versions_supported` | Yes | Supported ABDS draft versions |
| `profiles_supported` | Yes | Supported implementation profiles |
| `authorization_endpoint` | Yes | OAuth authorization endpoint |
| `token_endpoint` | Yes | OAuth token endpoint |
| `revocation_endpoint` | Yes | Token or delegation revocation endpoint |
| `usage_status_endpoint` | Yes | Provider-authoritative usage-status endpoint |
| `supported_scopes` | Yes | Supported ABDS scopes |
| `supported_quota_periods` | Yes | Supported grant periods |
| `authorization_details_types_supported` | Yes | Supported Rich Authorization Request identifiers |
| `funding_source_types_supported` | Yes | Enforceable funding-source types |

## v0.5 Capability Metadata

| Field | Description |
|---|---|
| `usage_events_endpoint` | Grant-specific usage-event retrieval endpoint |
| `usage_event_schema_versions_supported` | Supported Usage Event schema versions |
| `ledger_event_schema_versions_supported` | Supported Ledger Event schema versions |
| `usage_dimensions_supported` | Published token, modality, tool, and other dimensions |
| `event_delivery_modes_supported` | Retrieval, webhook, export, or console modes |
| `reservation_supported` | Reservation and settlement support |
| `partial_settlement_supported` | Partial completion and cancellation accounting |
| `reconciliation_supported` | Pending and later-finalized settlement support |
| `idempotency_supported` | Replay-safe reservation and settlement operations |
| `monetary_amounts_exposed` | Whether grant-visible events include currency amounts |
| `pricing_snapshot_supported` | Whether historical price snapshots are exposed |
| `client_attribution_fields_supported` | Opaque workspace, feature, workflow, agent, trace, or experiment fields echoed by the Provider |

## Other Optional Metadata

- `model_scope_supported`
- `sender_constrained_tokens_supported`
- `dpop_supported`
- `par_supported`
- `delegation_management_endpoint`
- `app_verification_required`
- `max_delegation_period`
- `max_delegated_resource_units`
- `sponsorship_programs_supported`
- `sponsor_verification_required`
- `sponsor_reporting_modes_supported`
- `consent_receipts_supported`

## Identifier Guidance

`delegation_id` is the public grant reference used in tokens, usage status, Usage Events, Ledger Events, revocation, and connected-app records. Providers MAY maintain an internal `grant_id`.

Recommended endpoint shapes:

```text
GET /v1/abds/delegations/{delegation_id}/usage
GET /v1/abds/delegations/{delegation_id}/events
```

## Security and Privacy

Discovery metadata MUST NOT reveal user plan, balance, private model access, Provider risk thresholds, internal grant identifiers, Sponsor pool balances, Beneficiary eligibility, private funding offers, or pricing confidential to a contract.

Public discovery describes capability. Authenticated endpoints determine entitlement and authorization.

## Open Questions

1. Should ABDS use only OAuth metadata extensions or register a separate well-known suffix?
2. Which v0.5 event fields belong in public discovery versus authenticated metadata?
3. Should Providers advertise billability rules for failed, speculative, and fallback attempts?
4. Should pricing-snapshot support be a Standard-profile requirement?
5. Should webhook signing and replay protection use a common profile?
