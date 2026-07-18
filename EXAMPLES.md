# ABDS Illustrative Examples

> These examples describe a proposed protocol. All domains, endpoints, identifiers, models, tokens, units, and funding offers are fictional. They are not evidence that any AI Provider currently implements ABDS.

## 1. User-Funded Authorization Details

```json
[
  {
    "type": "abds_ai_delegation",
    "actions": ["ai.execute", "ai.usage.read"],
    "locations": ["https://api.provider.example"],
    "models": ["economy-text"],
    "budget": {
      "max_units": 100,
      "unit_type": "provider_ai_unit",
      "period": "monthly",
      "per_request_max_units": 5,
      "overage": "prohibited"
    }
  }
]
```

The Resource User is also the Funding Principal.

## 2. Sponsor-Funded NatureGuard Authorization Details

```json
[
  {
    "type": "abds_ai_delegation",
    "actions": ["ai.execute", "ai.usage.read"],
    "locations": ["https://api.provider.example"],
    "models": ["economy-text", "economy-vision"],
    "budget": {
      "max_units": 100,
      "unit_type": "provider_ai_unit",
      "period": "monthly",
      "per_request_max_units": 5,
      "overage": "prohibited"
    },
    "funding_offer_id": "offer_natureguard_public_2026"
  }
]
```

The Authorization Server resolves the offer, verifies that NatureGuard is eligible, validates the Beneficiary, and displays the Sponsor terms.

The Client cannot choose a raw Sponsor account or `funding_source_id`.

## 3. Authorization Request Construction

```javascript
async function startABDSAuthorization({
  authorizationEndpoint,
  clientId,
  redirectUri,
  authorizationDetails,
  state,
  codeChallenge
}) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    authorization_details: JSON.stringify(authorizationDetails)
  });

  window.location.assign(`${authorizationEndpoint}?${params}`);
}
```

Production Clients must:

- obtain endpoints and supported capabilities through Provider discovery,
- generate and verify `state`,
- generate a fresh PKCE verifier and `S256` challenge,
- use an exact registered redirect URI,
- reject unknown issuers in multi-Provider flows, and
- use Pushed Authorization Requests when required.

## 4. Provider-side Grant

```json
{
  "delegation_id": "del_natureguard_abc123",
  "beneficiary_subject": "usr_948201842",
  "app_client_id": "app_natureguard",
  "funding_source_type": "sponsor_budget",
  "funding_source_id": "internal_funding_source_391",
  "economic_authorizer_type": "sponsor_policy",
  "sponsorship_program_id": "program_green_earth_2026",
  "unit_type": "provider_ai_unit",
  "quota_cap": 100,
  "quota_period": "monthly",
  "per_request_cap": 5,
  "model_scope": ["economy-text", "economy-vision"],
  "operation_scope": ["ai.execute", "ai.usage.read"],
  "overage_policy": "prohibited",
  "status": "active",
  "created_at": "2026-07-18T10:00:00Z",
  "expires_at": "2026-12-31T23:59:59Z"
}
```

`funding_source_id` is provider-internal and must not be copied into the Execution Token.

## 5. Execution Token

```json
{
  "iss": "https://auth.provider.example",
  "sub": "usr_948201842",
  "aud": "https://api.provider.example",
  "iat": 1784368800,
  "exp": 1784369700,
  "jti": "tok_xyz789",
  "client_id": "app_natureguard",
  "delegation_id": "del_natureguard_abc123",
  "scope": "ai.execute ai.usage.read",
  "model_scope": ["economy-text", "economy-vision"],
  "abds_version": "0.4"
}
```

The token does not contain live quota, Sponsor balance, funding-source identifier, or settlement state.

## 6. Backend-Mediated AI Call

```javascript
async function callProvider({ executionToken, request }) {
  const response = await fetch("https://api.provider.example/v1/inference", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${executionToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: result.error,
      recovery: result.recovery
    };
  }

  return { ok: true, result };
}
```

The browser or mobile UI should call the Client's authenticated backend. Sensitive provider refresh and execution credentials should remain server-side.

## 7. Grant-specific Usage Status

```http
GET /v1/abds/delegations/del_natureguard_abc123/usage
Authorization: Bearer {short_lived_execution_token}
```

```json
{
  "delegation_id": "del_natureguard_abc123",
  "unit_type": "provider_ai_unit",
  "quota_cap": 100,
  "quota_used": 47,
  "quota_remaining": 53,
  "quota_period": "monthly",
  "quota_reset": "2026-08-01T00:00:00Z",
  "status": "active",
  "funding_display": {
    "type": "sponsor_budget",
    "name": "Green Earth Foundation"
  }
}
```

The Client sees only its grant-specific state. It does not receive the Sponsor's full pool balance or other Beneficiaries' activity.

## 8. Sponsor Aggregate Report

```json
{
  "sponsorship_program_id": "program_green_earth_2026",
  "reporting_period": {
    "starts_at": "2026-07-01T00:00:00Z",
    "ends_at": "2026-08-01T00:00:00Z"
  },
  "aggregate_usage": {
    "active_beneficiaries": 842,
    "total_units_used": 28610,
    "grants_created": 915,
    "grants_revoked": 31,
    "requests_denied_for_cap": 74
  },
  "content_visibility": "none",
  "identity_visibility": "aggregate_only"
}
```

Prompt, output, file, conversation, and identity access require separate authorization and are not implied by funding.

## 9. Funding Exhaustion

```json
{
  "error": "abds_funding_unavailable",
  "error_description": "The authorized funding source cannot cover this request.",
  "recovery": "stop_or_reauthorize"
}
```

The response does not reveal the Sponsor's confidential balance.

The Client must not silently retry using a user or developer funding source.

## 10. Per-Beneficiary Cap Exhaustion

```json
{
  "error": "abds_quota_exceeded",
  "error_description": "This grant has reached its allowance for the current period.",
  "quota_reset": "2026-08-01T00:00:00Z",
  "recovery": "wait_or_reauthorize"
}
```

## 11. Revocation

```javascript
function handleABDSFailure(result) {
  switch (result.error) {
    case "abds_token_revoked":
    case "abds_sponsorship_ended":
      return { requiresReauthorization: true };

    case "abds_quota_exceeded":
      return { allowanceExhausted: true };

    case "abds_funding_unavailable":
      return {
        sponsoredAccessUnavailable: true,
        allowSilentPayerFallback: false
      };

    default:
      return { retryable: false };
  }
}
```

## 12. Discovery Check

Before offering sponsored access, a Client should verify that Provider metadata includes:

```json
{
  "abds_version": "0.4",
  "profiles_supported": ["basic", "standard", "sponsored_funding"],
  "authorization_details_types_supported": ["abds_ai_delegation"],
  "funding_source_types_supported": ["user_entitlement", "sponsor_budget"],
  "sponsorship_programs_supported": true
}
```

The exact metadata field names remain draft until the discovery profile is registered and tested.
