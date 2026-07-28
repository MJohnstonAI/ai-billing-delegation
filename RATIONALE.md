# ABDS Rationale and Economic Case

## The Developer's Dilemma

Consumer AI developers typically:

1. absorb variable inference cost;
2. build app-specific credits or subscriptions;
3. ask users to bring API keys; or
4. remove expensive AI features.

Growth can become a financial liability before revenue exists. API keys are not a mainstream consumer experience, and every application rebuilding billing, balances, metering, and abuse controls wastes engineering effort.

ABDS moves hard economic enforcement to the AI Provider, which already controls model access and measures execution.

## The Payer-Neutral Question

ABDS asks:

> Can any authorized Funding Principal fund a bounded grant for a specific Client and Beneficiary?

The Funding Principal may be a user, employer, university, government program, donor, foundation, membership organization, Provider promotion, or developer.

The model separates:

- who uses the application;
- who builds it;
- who authorizes the operations;
- who funds the Provider-recognized budget;
- which application workload caused usage;
- who measures and settles it.

## Why OAuth Is the Starting Point

OAuth provides a mature pattern in which a registered Client obtains bounded authorization without receiving the user's account credentials.

AI funding adds economic requirements:

- cost varies by model and workload;
- streaming and agentic tasks have uncertain final usage;
- abuse can drain a budget quickly;
- the payer may differ from the user;
- consent must explain financial and privacy consequences;
- retries and fallback must remain attributable;
- late Provider usage may require reconciliation.

ABDS uses OAuth for authorization and adds Provider-side grants, Consent Receipts, short-lived Execution Tokens, Usage Events, evidence provenance, reservations, settlement, and reconciliation.

## Why Consent Receipts Matter

Current grant state does not prove what was approved earlier.

An immutable Consent Receipt records:

- payer;
- ceiling;
- model, operation, and workload scope;
- overage and exhaustion behavior;
- duration;
- privacy and Sponsor visibility;
- revocation path;
- policy version.

This supports disputes, policy changes, and audit without placing mutable state in the token.

## Why Evidence Provenance Matters

A gateway can report what it observed, but only the Provider controls authoritative execution measurement and billing.

ABDS therefore distinguishes:

```text
gateway_attested
provider_reported
provider_signed
```

This permits practical transitional gateways while preserving a clear provider-native target.

## Why Reconciliation Must Be Append-Only

Provider usage or billing records may arrive late or differ from a gateway estimate.

Rewriting the original event destroys audit evidence. ABDS appends a Reconciliation Event and, when necessary, a compensating Ledger adjustment.

## Why Dual Attribution Matters

A user may trigger one feature, while the Client creates many additional calls through:

- retry policy;
- fallback routing;
- speculative execution;
- background jobs;
- caching failures;
- agent loops.

Traffic must remain attributable to both the Beneficiary and the registered Client. Otherwise the user may appear to be the sole source of application-generated cost.

## NatureGuard Example

A conservation foundation funds bounded public NatureGuard usage.

The Provider:

1. verifies the Sponsor and Client;
2. shows the user the payer, ceiling, workload, privacy, and expiry;
3. issues a Consent Receipt;
4. creates a grant;
5. issues a short-lived token;
6. reserves the request envelope;
7. records every physical model attempt;
8. reconciles gateway and Provider evidence;
9. settles the Sponsor funding bucket;
10. releases unused capacity.

The Sponsor receives aggregate reporting by default, not prompts, photos, reports, precise location, or identity.

## Provider Economics

ABDS preserves Provider control.

A Provider may:

- define eligible funding products;
- verify Clients and Sponsors;
- define units and pricing;
- restrict models, operations, routes, and workloads;
- set per-grant and per-request limits;
- require reservations;
- require sender-constrained tokens;
- sign or report usage evidence;
- stop abuse;
- expose paid delegated programs.

The proposal does not dictate the commercial settlement rail.

## No Silent Payer Substitution

If an authorized funding source ends or fails, the request stops, uses another already-authorized source, or obtains fresh consent.

The economic promise is:

> The party shown as paying is the party whose authorized funding source is charged.

## Open-Source Objective

The near-term goal is not to claim a finished standard. It is to produce a precise proposal, test vectors, and a runnable reference implementation that Provider, OAuth, accounting, security, privacy, nonprofit, and developer reviewers can challenge.
