# ABDS Sponsored Delegation Profile v0.4 (Draft)

> A payer-neutral extension for sponsor-funded AI usage.

## 1. Purpose

The ABDS core model should not assume that the person using an AI application is also the party whose subscription or account pays for inference.

This profile covers cases where a third party funds bounded AI usage for an application's users. Examples include:

- a conservation foundation funding NatureGuard for the public,
- a donor funding an educational tutor for students,
- a company funding an approved employee assistant,
- a university funding research tools,
- a government program funding access to public services,
- an AI provider funding a promotional allowance, and
- a membership or patronage organization funding tools for its community.

The user does not pay the AI provider's inference cost for calls covered by the sponsor grant. The application developer does not pay that inference cost either. The sponsor funds a provider-recognized budget or entitlement, while the AI provider remains the enforcement and accounting authority.

Sponsorship does not imply that the sponsor can see prompts, outputs, personal data, or individual behavior.

## 2. Generalized ABDS Roles

ABDS separates the following roles even when one party performs several of them:

| Role | Description |
|---|---|
| **Resource User** | Person using the AI-enabled application. |
| **Beneficiary** | Person or class of people eligible to consume a funded allocation. Usually the Resource User. |
| **Consumer Application / Client** | Registered application requesting and using an ABDS grant. |
| **Funding Principal** | Party whose provider-recognized entitlement or budget is charged. |
| **Economic Authorizer** | Party allowed to commit the Funding Principal's budget. |
| **Sponsor** | A Funding Principal other than the Resource User or application developer. |
| **AI Provider** | Authorization Server, Resource Server, grant service, and authoritative ledger operator. |

For user-funded ABDS, the Resource User, Beneficiary, Funding Principal, and Economic Authorizer may all be the same person.

For sponsored ABDS, the Sponsor is the Funding Principal, a sponsor administrator or policy is the Economic Authorizer, and the Resource User is the Beneficiary.

## 3. Payer-Neutral Four-Object Architecture

```text
Funding Entitlement or Budget
        |
Delegated AI Grant
        |
Short-lived Execution Token
        |
Provider-side Usage Ledger
```

### 3.1 Funding Entitlement or Budget

A provider-recognized source of AI resource units or monetary budget. The source may belong to:

- an individual subscriber,
- an organization,
- a sponsor,
- an AI provider promotional program, or
- a developer account.

The provider MAY settle the funding source through prepaid credits, an invoice, a subscription allowance, a committed-spend agreement, or another commercial arrangement. ABDS standardizes delegation and enforcement semantics, not the commercial settlement rail.

### 3.2 Delegated AI Grant

The provider-side grant binds:

- the Client,
- the Beneficiary or eligibility rule,
- an opaque funding-source reference,
- a bounded economic policy,
- permitted models and operations,
- consent and disclosure state,
- lifecycle status, and
- revocation authority.

### 3.3 Short-lived Execution Token

The token references the grant using `delegation_id`. It does not need to expose the Sponsor, funding-source identifier, live budget, or ledger state.

### 3.4 Provider-side Usage Ledger

The ledger records reservations, debits, settlements, releases, refunds, and denials against the applicable grant and funding source.

## 4. Sponsorship Program

A Sponsor or AI Provider MAY define a Sponsorship Program before any user grant is created.

Recommended fields:

| Field | Type | Description |
|---|---|---|
| `sponsorship_program_id` | string | Public reference safe to display to eligible users. |
| `sponsor_id` | string | Provider-internal Sponsor identifier. |
| `display_name` | string | Sponsor name shown during consent. |
| `verified_domain` | string | Verified Sponsor domain, where available. |
| `app_client_ids` | array | Clients eligible to consume the program budget. |
| `total_budget` | object | Provider-defined cap and unit type for the program. |
| `per_beneficiary_cap` | object | Maximum allocation for each Beneficiary and period. |
| `per_request_cap` | object | Optional maximum for a single execution. |
| `model_policy` | object | Permitted or excluded model classes. |
| `operation_policy` | array | Permitted operations such as text generation or image analysis. |
| `eligibility_policy` | object | Provider-enforced or sponsor-attested eligibility rules. |
| `starts_at` | ISO 8601 | Program start. |
| `ends_at` | ISO 8601 | Program end. |
| `data_visibility` | object | Sponsor-visible usage and reporting categories. |
| `status` | enum | `draft`, `active`, `paused`, `exhausted`, `ended`, or `revoked`. |

The Sponsorship Program is a policy and funding source. It is not an execution credential.

## 5. Authorization Model

### 5.1 Two Distinct Authorizations

Sponsored use normally requires two decisions:

1. **Funding authorization:** the Sponsor authorizes a bounded program, eligible Client, beneficiary policy, and reporting policy.
2. **User authorization:** the Resource User authorizes the Client to perform the disclosed AI operations and accepts the sponsorship terms.

These decisions MAY occur at different times. A Sponsor can create a program before any user joins it.

The provider MUST NOT treat sponsor funding approval as user consent to disclose personal data or process content beyond the Client's separately authorized purpose.

### 5.2 Rich Authorization Request

ABDS SHOULD use OAuth 2.0 Rich Authorization Requests rather than adding an expanding set of top-level OAuth query parameters.

Illustrative, non-registered authorization detail:

```json
[
  {
    "type": "abds_ai_delegation",
    "actions": ["ai.execute", "ai.usage.read"],
    "locations": ["https://api.provider.example"],
    "models": ["standard-text", "vision-economy"],
    "budget": {
      "max_units": 100,
      "period": "monthly",
      "per_request_max_units": 5,
      "overage": "prohibited"
    },
    "funding_offer_id": "offer_natureguard_public_2026"
  }
]
```

The final authorization-details type requires a collision-resistant identifier and standards registration strategy. `abds_ai_delegation` is a draft placeholder.

The Authorization Server MUST:

- validate that the funding offer exists and is active,
- verify that the Client is eligible for the offer,
- ensure the requested rights do not exceed sponsor policy,
- ensure the Beneficiary is eligible,
- present the effective grant after all reductions,
- bind the resulting grant to the Client and Beneficiary, and
- reject unknown or malformed authorization details.

Pushed Authorization Requests are RECOMMENDED when the request contains sensitive eligibility information, large structured policies, or higher-value grants.

## 6. Sponsored Consent Screen

The provider's consent screen MUST clearly show:

- the verified Client and developer,
- the verified Sponsor,
- the statement that the Sponsor is paying for covered AI usage,
- the maximum per-user allowance and period,
- the program end date or renewal behavior,
- permitted operations and model classes,
- whether the user can incur any charge,
- what happens when the sponsorship ends or is exhausted,
- what usage information the Sponsor can see,
- a clear statement that sponsorship alone does not grant prompt or output access,
- the user's revocation path, and
- links to applicable Client and Sponsor terms.

Recommended plain-language example:

> Green Earth Foundation will fund up to 100 standard AI units per month for your use of NatureGuard. You will not be charged for covered usage. The foundation can see aggregate program usage, but not your prompts or NatureGuard's answers. Access stops when your allowance or the program budget is exhausted. You can disconnect NatureGuard at any time.

## 7. Grant Record Extensions

The following fields extend the ABDS grant record:

| Field | Required | Description |
|---|---:|---|
| `delegation_id` | Yes | Stable public grant reference. |
| `beneficiary_subject` | Yes | Provider-side subject or pseudonymous Beneficiary reference. |
| `app_client_id` | Yes | Bound Client identifier. |
| `funding_source_type` | Yes | `user_entitlement`, `organization_budget`, `sponsor_budget`, `provider_promotion`, or `developer_account`. |
| `funding_source_id` | Yes | Opaque provider-side funding reference. MUST NOT appear in bearer tokens. |
| `economic_authorizer_type` | Yes | `user`, `organization_admin`, `sponsor_policy`, `provider_policy`, or `developer`. |
| `sponsorship_program_id` | For sponsored grants | Public program reference. |
| `quota_cap` | Yes | Per-grant cap in the declared unit type. |
| `unit_type` | Yes | Provider-defined unit identifier. |
| `quota_period` | Yes | Applicable accounting period. |
| `per_request_cap` | No | Maximum units per execution. |
| `model_scope` | No | Permitted model classes or families. |
| `operation_scope` | Yes | Permitted AI operations. |
| `overage_policy` | Yes | MUST be `prohibited` unless a separate payer has explicitly authorized overage. |
| `data_visibility_policy` | Yes | Sponsor-visible reporting categories. |
| `status` | Yes | Grant lifecycle status. |

Live `quota_used`, `quota_remaining`, sponsor pool balance, and settlement state belong to the provider ledger and usage views, not the grant's authorization policy or execution token.

## 8. Execution and Accounting

For every sponsored execution, the provider MUST:

1. validate the execution token;
2. bind the token to the correct Client, audience, and `delegation_id`;
3. validate the Beneficiary and grant status;
4. validate the Sponsorship Program and funding source;
5. enforce model, operation, per-request, per-beneficiary, and program limits;
6. reserve or debit usage atomically;
7. execute only within the authorized envelope; and
8. settle the actual usage in the provider ledger.

The provider SHOULD distinguish internally between:

- a Beneficiary cap being exhausted,
- a Sponsorship Program pool being exhausted,
- a program being paused or ended,
- a funding settlement failure, and
- a provider policy denial.

The Client-facing error SHOULD reveal only the information required for safe recovery. It MUST NOT expose confidential Sponsor balances or risk decisions.

## 9. No Silent Payer Substitution

This is a mandatory safety property.

When sponsored funding becomes unavailable, the provider and Client MUST NOT silently:

- charge the Resource User,
- charge the application developer,
- switch to a user's personal subscription allowance, or
- create paid overage.

The request must stop, move to another already-authorized funding source, or obtain fresh explicit authorization from the new Funding Principal and affected user.

## 10. Privacy and Sponsor Visibility

The default sponsor-visible dataset SHOULD be limited to:

- aggregate units consumed,
- aggregate number of active Beneficiaries,
- grant creation and revocation counts,
- model or operation categories at an aggregate level,
- denied or exhausted request counts, and
- fraud or policy alerts necessary to protect the program.

The Sponsor MUST NOT receive prompts, outputs, conversation history, uploaded files, precise location, or user identity merely because it funds usage.

Any broader data sharing requires a separate legal basis, purpose-specific authorization, and consent flow outside the economic delegation itself.

Providers SHOULD support privacy-preserving thresholds or aggregation for small cohorts where individual activity could otherwise be inferred.

## 11. Revocation and Program Changes

The Resource User MUST be able to revoke the Client's grant.

The Sponsor MUST be able to pause or end future funding, subject to disclosed program terms.

The Provider MUST be able to suspend abusive grants or programs.

Material changes to the following require renewed user authorization:

- a higher per-user cap,
- broader model or operation access,
- paid overage,
- a new Funding Principal,
- broader Sponsor data visibility, or
- a materially later program end date where the original consent was time-bounded.

Reducing a cap or narrowing access does not require renewed consent, but the user SHOULD be notified when the change affects expected service.

## 12. Sponsored Funding Threats

| Threat | Example | Required mitigation |
|---|---|---|
| Eligibility fraud | Bots or ineligible users claim sponsored access. | Provider and Sponsor rate limits, eligibility proof, abuse detection, and per-beneficiary caps. |
| Funding-offer substitution | A Client replaces one offer identifier with another. | Bind offers to registered Clients and validate at the Authorization Server. |
| Sponsor impersonation | A malicious program claims a recognized charity is paying. | Verified Sponsor identity and domain display on provider-controlled consent. |
| Sponsor surveillance | Funding is used to justify access to prompts or user identity. | Data minimization, separate consent, aggregate reporting defaults, and audit controls. |
| Silent payer fallback | Exhausted sponsor budget is charged to the user. | Mandatory hard stop or renewed authorization. |
| Budget draining | Attackers automate high-cost use against a program pool. | Per-user and per-request caps, reservations, anomaly detection, and program circuit breakers. |
| Policy bait-and-switch | Sponsor broadens reporting or narrows benefits after consent. | Versioned policies, immutable consent receipts, and renewed consent for material changes. |
| Cross-app laundering | One approved Client resells the sponsor budget to another app. | Client, audience, Beneficiary, model, and operation binding with provider-side enforcement. |

## 13. NatureGuard Example

```text
Green Earth Foundation
        funds
NatureGuard Public AI Program
        offers 100 standard units per person per month
        |
NatureGuard requests a sponsored ABDS grant
        |
Provider shows the user sponsor, limits, privacy, and end date
        |
User approves
        |
Provider creates a grant bound to NatureGuard + user + sponsor program
        |
NatureGuard uses a short-lived token
        |
Provider debits the sponsor program ledger
        |
User pays no covered inference cost
Developer pays no covered inference cost
Sponsor sees aggregate program usage, not prompts
```

This scenario demonstrates why ABDS is better understood as payer-neutral AI resource delegation rather than only user-subscription delegation.

## 14. Open Questions

1. Should sponsor eligibility be provider-attested, Sponsor-attested, or delegated to a trusted verifier?
2. Should the core standard define minimum privacy aggregation thresholds?
3. Should Sponsorship Programs support earmarked model classes but remain neutral about application content?
4. How should refunds and credits be represented when a provider invoices in currency but enforces in resource units?
5. Should sponsor-funded grants require a formal consent receipt profile?
6. Should multiple Funding Principals be allowed to fund one grant, or should grants always resolve to one source at execution time?
7. Which sponsorship-policy changes require renewed consent versus notification?

## 15. Standards References

- [RFC 9396 - OAuth 2.0 Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396)
- [RFC 9126 - OAuth 2.0 Pushed Authorization Requests](https://www.rfc-editor.org/rfc/rfc9126)
- [RFC 9449 - OAuth 2.0 Demonstrating Proof of Possession](https://www.rfc-editor.org/rfc/rfc9449)
- [RFC 9700 - Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700)

