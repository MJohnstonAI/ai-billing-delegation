# ABDS Sponsored Delegation Profile v0.5 (Draft)

> Payer-neutral, privacy-preserving third-party funding for bounded AI usage.

## 1. Purpose

This profile applies when a Sponsor, employer, university, government, donor, membership organization, or AI Provider funds AI usage for a Beneficiary through a registered Client.

The Sponsor funds a Provider-recognized budget or entitlement. The Provider remains the authorization, enforcement, measurement, and accounting authority. Covered usage is not charged to the Resource User or application developer.

Sponsorship does not imply Sponsor access to prompts, outputs, files, conversations, precise location, identity, or individual behavior.

## 2. Roles

| Role | Description |
|---|---|
| Resource User | Person using the Client |
| Beneficiary | Person or class eligible for the funded allocation |
| Client | Registered application requesting and using the grant |
| Funding Principal | Sponsor whose Provider-recognized budget is charged |
| Economic Authorizer | Sponsor administrator or policy permitted to commit the budget |
| Provider | Authorization Server, Resource Server, grant service, execution gateway, and accounting authority |

## 3. v0.5 Architecture

```text
Sponsor Budget
    -> Sponsorship Program / Funding Offer
        -> Delegated AI Grant
            -> Short-lived Execution Token
                -> Provider Execution
                    |-> Usage Event Plane
                    |-> Economic Ledger Plane
```

For each covered execution, the Provider can attribute:

- the Sponsorship Program and funding bucket;
- Client and pairwise-pseudonymous Beneficiary;
- logical request and physical attempts;
- requested and resolved model;
- retry, fallback, route, workflow, and agent-step context;
- measured resource dimensions; and
- reservation, settlement, released quantity, and adjustment events.

Client observability metadata is untrusted and cannot change Sponsor billing or grant policy.

## 4. Sponsorship Program

A Sponsor or Provider MAY establish a program before individual grants exist.

Recommended fields:

| Field | Description |
|---|---|
| `sponsorship_program_id` | Public program reference |
| `sponsor_id` | Provider-internal Sponsor identifier |
| `display_name` | Verified Sponsor name shown during consent |
| `app_client_ids` | Eligible Clients |
| `total_budget` | Program cap and unit type |
| `per_beneficiary_cap` | Per-Beneficiary cap and period |
| `per_request_cap` | Optional request envelope |
| `model_policy` | Permitted model classes, routes, or tiers |
| `operation_policy` | Permitted operations and modalities |
| `eligibility_policy` | Provider-enforced or attested eligibility |
| `starts_at`, `ends_at` | Program duration |
| `data_visibility` | Authorized Sponsor reporting categories |
| `status` | `draft`, `active`, `paused`, `exhausted`, `ended`, or `revoked` |

A program is policy and funding state, not an execution credential.

## 5. Authorization

Sponsored execution normally requires two distinct authorizations:

1. **Funding authorization:** the Economic Authorizer creates or approves the bounded Sponsor program.
2. **User authorization:** the Resource User authorizes the Client and accepts the disclosed sponsorship terms.

ABDS SHOULD use OAuth Rich Authorization Requests. `funding_offer_id` identifies a Provider-recognized offer already bound to eligible Clients or Beneficiaries. A Client MUST NOT name an arbitrary Sponsor account.

The Authorization Server MUST validate Sponsor identity, program status, Client eligibility, Beneficiary eligibility, requested model and operation rights, limits, duration, and data-visibility policy.

## 6. Consent Screen

The Provider MUST show:

- verified Client and developer;
- verified Sponsor;
- a clear statement that the Sponsor pays for covered usage;
- per-user cap, period, and per-request limit;
- program end or renewal behavior;
- permitted models, routes, operations, and modalities;
- whether any user charge is possible;
- exhaustion and cancellation behavior;
- Sponsor-visible reporting categories;
- a statement that funding does not grant prompt or output access; and
- user revocation controls.

Example:

> Green Earth Foundation will fund up to 100 standard AI units per month for your use of NatureGuard. You will not be charged for covered usage. The foundation receives aggregate program reporting, not your prompts or NatureGuard's answers. Access stops when your allowance or the program budget is exhausted. You can disconnect NatureGuard at any time.

## 7. Grant and Funding Binding

A sponsored grant MUST bind:

- `delegation_id`;
- Client;
- Beneficiary or eligibility rule;
- `sponsorship_program_id`;
- opaque Provider-side funding bucket;
- cap, period, and request envelope;
- model and operation policy;
- overage policy;
- reporting policy;
- lifecycle status; and
- revocation authority.

The opaque funding bucket MUST NOT appear as a bearer-token claim. Live program balance, grant usage, reservations, and settlement remain Provider-side.

## 8. Execution and Accounting

For each sponsored logical request, the Provider MUST:

1. validate the token, Client, audience, grant, Beneficiary, and program;
2. enforce model, operation, route, request, Beneficiary, and total-program limits;
3. reserve or debit the Sponsor bucket atomically;
4. prevent execution outside the authorized envelope;
5. emit one Usage Event for each billable physical attempt;
6. retain requested and resolved model attribution;
7. post idempotent Ledger Events;
8. settle Provider-measured usage;
9. release unused reserved quantity; and
10. prohibit payer substitution.

Every settled quantity maps to one `delegation_id` and one Sponsor funding bucket at settlement time.

## 9. Sponsor Reporting

The default Sponsor report SHOULD be limited to privacy-safe aggregates such as:

- total units consumed;
- active Beneficiary count;
- grant creation, revocation, denial, and exhaustion totals;
- aggregate model, route, modality, or operation categories;
- aggregate retries or failed-attempt cost where useful; and
- fraud or policy alerts required to protect the program.

Sponsor reporting MUST NOT expose Client workspace, feature, workflow, agent, experiment, trace, or span references unless separately authorized and privacy-safe. Providers SHOULD suppress or aggregate small cohorts where individual activity could be inferred.

## 10. No Silent Payer Substitution

When Sponsor funding is exhausted, paused, ended, revoked, or unavailable, the Provider and Client MUST NOT silently:

- charge the Resource User;
- charge the developer;
- switch to a personal subscription;
- switch to another Sponsor; or
- create paid overage.

Execution stops, uses another already-authorized funding source, or obtains fresh authorization.

## 11. Program Changes and Revocation

The Resource User can revoke the Client grant. The Sponsor can pause or end future funding subject to disclosed terms. The Provider can suspend abusive grants, Clients, or programs.

Fresh consent is required for a higher cap, broader models or operations, paid overage, new Funding Principal, broader Sponsor visibility, or material duration extension.

In-flight work settles measured consumption and releases unused capacity according to the disclosed policy.

## 12. Threats and Controls

| Threat | Required control |
|---|---|
| Eligibility fraud | Eligibility enforcement, rate limits, per-Beneficiary caps, anomaly detection |
| Sponsor impersonation | Provider-verified identity and Provider-controlled consent |
| Funding-offer substitution | Bind offers to Client and Beneficiary |
| Sponsor surveillance | Separate data authorization, aggregate reporting, privacy thresholds |
| Silent payer fallback | Hard stop or fresh authorization |
| Program-budget drain | Total, per-user, per-request, model, route, and agent limits; circuit breakers |
| Retry-cost hiding | One Usage Event per physical attempt |
| Cross-workspace charging | Pairwise opaque references and Client tenancy controls |
| Duplicate settlement | Idempotency and unique settlement identifiers |
| Policy bait-and-switch | Versioned policy and renewed consent for material expansion |

See `THREAT_MODEL.md` for the full v0.5 threat model.

## 13. NatureGuard Example

```text
Green Earth Foundation
    -> creates NatureGuard Sponsor program
        -> Provider shows payer, limits, privacy, and end date
            -> user approves NatureGuard grant
                -> Provider creates grant bound to Client + Beneficiary + Sponsor bucket
                    -> NatureGuard uses short-lived token
                        -> each model attempt emits a Usage Event
                        -> Sponsor bucket is reserved and settled
                        -> unused quantity is released
                        -> Sponsor receives aggregate reporting only
```

## 14. Relationship to Core v0.5

This profile extends, but does not replace:

- `SPEC.md`
- `USAGE_ATTRIBUTION.md`
- `RESERVATION_SETTLEMENT.md`
- `IMPLEMENTATION_PROFILES.md`
- `FLOWS.md`

Where this profile conflicts with the canonical specification, `SPEC.md` controls.
