# ABDS Provider Discovery

> Draft proposal for discovering ABDS support, endpoints, scopes, and provider capabilities.

Provider discovery is important because ABDS should not become a collection of provider-specific integrations. A third-party application should be able to determine whether a provider supports ABDS, which profile level it supports, which endpoints are available, and which resource-delegation features are enabled.

## Design Principle

ABDS discovery should align with existing OAuth metadata practices wherever possible.

Providers SHOULD publish ABDS capability metadata either as:

1. extensions to OAuth Authorization Server Metadata, or
2. a separately registered ABDS-specific well-known metadata document.

## Option A: OAuth Metadata Extensions

Providers may extend their OAuth Authorization Server Metadata document with ABDS-specific fields.

Typical location:

```text
GET /.well-known/oauth-authorization-server
```

Example additional metadata fields:

```json
{
  "issuer": "https://auth.provider.example",
  "authorization_endpoint": "https://auth.provider.example/oauth/authorize",
  "token_endpoint": "https://auth.provider.example/oauth/token",
  "revocation_endpoint": "https://auth.provider.example/oauth/revoke",
  "abds_supported": true,
  "abds_version": "0.4",
  "abds_profiles_supported": ["basic", "standard", "sponsored_funding"],
  "abds_authorization_details_types_supported": ["abds_ai_delegation"],
  "abds_usage_introspection_endpoint": "https://api.provider.example/v1/abds/delegations/{delegation_id}/usage",
  "abds_supported_scopes": [
    "ai.quota.delegate",
    "ai.quota.read"
  ],
  "abds_supported_quota_periods": ["daily", "weekly", "monthly"],
  "abds_funding_source_types_supported": [
    "user_entitlement",
    "sponsor_budget",
    "provider_promotion",
    "developer_account"
  ],
  "abds_sponsorship_programs_supported": true,
  "abds_model_scope_supported": true,
  "abds_reservation_supported": false,
  "abds_sender_constrained_tokens_supported": true
}
```

## Option B: ABDS-Specific Metadata Document

If ABDS requires a separate metadata document, the proposed location is:

```text
GET /.well-known/abds-configuration
```

Example:

```json
{
  "issuer": "https://auth.provider.example",
  "abds_version": "0.4",
  "profiles_supported": ["basic", "standard", "sponsored_funding"],
  "authorization_details_types_supported": ["abds_ai_delegation"],
  "authorization_endpoint": "https://auth.provider.example/oauth/authorize",
  "token_endpoint": "https://auth.provider.example/oauth/token",
  "token_exchange_supported": true,
  "resource_indicators_supported": true,
  "revocation_endpoint": "https://auth.provider.example/oauth/revoke",
  "usage_introspection_endpoint": "https://api.provider.example/v1/abds/delegations/{delegation_id}/usage",
  "delegation_management_endpoint": "https://provider.example/account/connected-apps",
  "supported_scopes": [
    "ai.quota.delegate",
    "ai.quota.read"
  ],
  "supported_quota_periods": ["daily", "weekly", "monthly"],
  "funding_source_types_supported": [
    "user_entitlement",
    "organization_budget",
    "sponsor_budget",
    "provider_promotion",
    "developer_account"
  ],
  "sponsorship_programs_supported": true,
  "model_scope_supported": true,
  "reservation_supported": false,
  "sender_constrained_tokens_supported": true,
  "dpop_supported": true,
  "par_supported": false
}
```

## Required Metadata Fields

A minimal ABDS discovery response should include:

| Field | Required | Description |
|---|---:|---|
| `issuer` | Yes | Provider issuer identifier |
| `abds_version` | Yes | Supported ABDS version |
| `profiles_supported` or `abds_profiles_supported` | Yes | Supported implementation profiles |
| `authorization_endpoint` | Yes | OAuth authorization endpoint |
| `token_endpoint` | Yes | OAuth token endpoint |
| `revocation_endpoint` | Yes | Token or delegation revocation endpoint |
| `usage_introspection_endpoint` | Yes | Provider-authoritative usage endpoint |
| `supported_scopes` | Yes | Supported ABDS scopes |
| `supported_quota_periods` | Yes | Supported delegation periods |
| `authorization_details_types_supported` | Yes | Supported ABDS Rich Authorization Request type identifiers |
| `funding_source_types_supported` | Yes | Funding-source types the Provider can authorize and enforce |

## Optional Metadata Fields

| Field | Description |
|---|---|
| `model_scope_supported` | Whether per-model or model-family scoping is supported |
| `reservation_supported` | Whether reservation / settlement semantics are supported |
| `sender_constrained_tokens_supported` | Whether sender-constrained execution tokens are available |
| `dpop_supported` | Whether DPoP is supported |
| `par_supported` | Whether pushed authorization requests are supported |
| `delegation_management_endpoint` | User-facing connected-apps or grant-management location |
| `app_verification_required` | Whether apps must be verified before requesting ABDS scopes |
| `max_delegation_period` | Maximum permitted quota period |
| `max_delegated_resource_units` | Provider-defined maximum delegated cap |
| `sponsorship_programs_supported` | Whether the Provider supports Sponsor-funded program budgets |
| `sponsor_verification_required` | Whether Sponsors must be verified before publishing funding offers |
| `sponsor_reporting_modes_supported` | Sponsor reporting modes such as `aggregate_only` |
| `consent_receipts_supported` | Whether the Provider can issue versioned consent receipts |

## Identifier Guidance

ABDS should standardize on `delegation_id` as the public reference identifier used in:

- execution tokens,
- introspection endpoints,
- logs,
- revocation events,
- user-facing connected-app records.

Providers MAY maintain an internal `grant_id`, but `grant_id` should not be required in public ABDS APIs.

Recommended public endpoint shape:

```text
GET /v1/abds/delegations/{delegation_id}/usage
```

## Security Considerations

Discovery metadata should not reveal:

- a user's subscription tier,
- a user's quota balance,
- provider-internal risk thresholds,
- private model availability by account,
- internal grant identifiers.
- Sponsor pool balances,
- Beneficiary eligibility data,
- private funding offers, or
- Sponsor risk and verification signals.

Discovery describes provider capability, not user entitlement.

## Open Questions

1. Should ABDS define a registered `.well-known/abds-configuration` suffix?
2. Should ABDS metadata be only an OAuth metadata extension?
3. Should provider discovery include profile-level conformance details?
4. Should apps be allowed to discover maximum cap ranges before user authorization?
5. Should model families be represented by provider-defined strings or a cross-provider taxonomy?
6. Should the ABDS authorization-details type be registered once globally or versioned by profile?
7. Which Sponsor capabilities belong in public discovery versus authenticated Sponsor metadata?
