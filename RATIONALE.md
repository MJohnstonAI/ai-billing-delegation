# ABDS v0.5 Rationale and Economic Case

## The Developer's Dilemma

Consumer AI developers typically:

1. absorb variable inference cost;
2. build app-specific subscriptions or credits;
3. ask users to bring API keys; or
4. remove expensive AI features.

Growth can become a liability before revenue exists. API keys are not a mainstream consumer experience, and every application rebuilding payments, balances, metering, and abuse controls wastes engineering effort.

ABDS moves the hard economic control to the AI Provider, which already measures execution and controls access to models.

## The Payer-Neutral Question

The original proposal asked whether a user could authorize bounded application usage against a Provider entitlement. The payer-neutral model asks:

> Can any authorized Funding Principal fund a bounded grant for a specific Client and Beneficiary?

The Funding Principal may be a user, employer, university, government program, donor, foundation, membership organization, Provider promotion, or developer.

This separates who uses the application, who builds it, who authorizes its AI operations, who funds it, and who enforces and accounts for usage.

## Why v0.5 Adds More Than Billing Delegation

Authorization answers **who may consume**. A production platform must also answer:

- which application behavior caused usage;
- which physical model attempts occurred;
- whether retries, fallback, routing, tools, or agent steps amplified cost;
- what the Provider measured;
- what was reserved and finally settled; and
- which funding bucket paid.

Without this information, teams guess from aggregate invoices. They cannot reliably optimize product behavior, investigate disputes, compare routes, or demonstrate that Sponsor funds were used as authorized.

v0.5 therefore separates:

```text
Usage Event Plane     - technical facts about each physical attempt
Economic Ledger Plane - reservation, settlement, release, denial, and correction
```

This is not merely observability. It is the audit bridge between authorization and economic settlement.

## Why One Event Per Physical Attempt Matters

One user action may create several real executions:

- primary model call;
- retry after timeout;
- fallback to another model;
- safety or moderation call;
- speculative call;
- tool-assisted or agent step.

Recording only the final successful response hides cost and makes routing decisions impossible to audit. v0.5 preserves the logical request while attributing each billable physical attempt separately.

## Why Reservation and Settlement Matter

Streaming, multimodal, batch, routed, and agentic tasks may not have a reliable final cost at request time.

The Provider needs:

```text
Authorize -> Estimate -> Reserve -> Execute -> Settle -> Release
```

Reservation prevents concurrent overspend. Settlement uses Provider-measured usage. Idempotency prevents duplicate charges after network retries. Append-only adjustment events preserve audit history without rewriting previous prices or usage.

## NatureGuard

Under Sponsor-funded ABDS:

1. Green Earth Foundation creates a Provider-recognized NatureGuard program.
2. The program defines total and per-user caps, model policy, duration, and reporting.
3. The user sees who pays and what the Sponsor can see.
4. The Provider creates a grant bound to NatureGuard, the Beneficiary, and Sponsor bucket.
5. NatureGuard uses a short-lived token.
6. Each physical model attempt creates a Usage Event.
7. The Provider reserves and settles the Sponsor ledger.
8. The Sponsor receives privacy-safe aggregate reporting.

The user and developer do not pay covered Provider inference cost. The developer still pays for application infrastructure, support, storage, orchestration, and usage outside the grant.

## Why OAuth Is the Starting Point

OAuth provides a familiar pattern for authorizing a registered third-party application without sharing credentials. AI funding requires additional semantics because cost varies, the payer may differ from the user, long tasks are difficult to bound, and consent must explain economic and privacy consequences.

ABDS therefore profiles OAuth while adding Provider-side grants, structured economic authorization, execution accounting, and funding-aware lifecycle rules.

## Why Rich Authorization Requests Matter

A scope such as `ai.execute` cannot safely express:

- maximum units and period;
- per-request cap;
- model, route, modality, or operation policy;
- funding offer;
- overage behavior; and
- Sponsor reporting policy.

OAuth Rich Authorization Requests provides a standards-aligned carrier for this structured policy.

## Economic Case for Providers

ABDS preserves Provider control. A Provider can:

- choose eligible plans and funding products;
- define resource units and prices;
- cap total, per-user, and per-request usage;
- restrict models, routes, modalities, and tools;
- require Client and Sponsor verification;
- reserve high-variance workloads;
- detect quota laundering and retry amplification;
- expose only privacy-safe event data;
- suspend abusive grants or programs; and
- decide which funding types it supports.

ABDS may create demand that does not exist under developer-funded billing: public-interest applications, governed employee pools, student programs, accessibility tools, and Provider-funded promotions.

## The Provider CFO Objection

A Provider may reasonably argue that delegation could increase utilization without sufficient revenue, cannibalize API sales, create fraud, increase support cost, or aggregate consumer subscriptions into wholesale capacity.

ABDS does not make those concerns disappear. It makes them governable:

- funding arrangements remain Provider-recognized;
- grants are bounded and tied to Client, Beneficiary, audience, models, and operations;
- every physical attempt is attributable;
- reservations and caps limit loss;
- abusive aggregation can be detected and revoked;
- no paid overage occurs without authorization; and
- Sponsor programs can be separate commercial products.

The proposal succeeds only if Provider economics remain sustainable.

## Why Sponsorship Must Not Become Surveillance

Funding and data access are separate permissions. Sponsor funding does not authorize prompts, outputs, files, conversations, identity, precise location, or Client-internal workflow labels.

Default Sponsor reporting should be aggregate and subject to privacy thresholds. Broader reporting requires a separate purpose, authorization, and legal basis.

## Why the Payer Must Never Change Silently

When a funding source ends or is exhausted, silently charging the user or developer breaks economic consent.

ABDS requires a hard stop, another already-authorized source, or fresh consent:

> The payer shown during authorization is the payer whose authorized funding bucket is settled.

## Why Events Must Be Append-Only

Rewriting historical usage or price destroys reconciliation and dispute evidence. Accepted Usage Events and Ledger Events remain immutable. Corrections use compensating adjustments that identify the original event, actor, reason, and quantity.

## Why the Proposal Should Be Open

A proprietary feature could validate the concept but would force Clients to implement different delegation, event, error, and settlement semantics for each Provider.

An open profile can establish common consent language, grant semantics, event schemas, privacy expectations, Provider discovery, and interoperability tests.

## Conclusion

ABDS v0.5 is best understood as payer-neutral authorization plus Provider-authoritative execution accounting for metered AI resources.

Its promise is not free AI. Its promise is an explicit, bounded, revocable, attributable, auditable, privacy-preserving choice about who funds each authorized AI execution.
