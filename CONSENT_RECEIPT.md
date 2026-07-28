# ABDS Consent Receipt Profile v0.6

> Immutable evidence of the economic, workload, duration, privacy, and revocation terms approved for a Delegated AI Grant.

## 1. Purpose

A Delegated AI Grant records the Provider's current authorization state. A Consent Receipt records what was shown and approved at a specific time.

The receipt does not replace the grant, token, or ledger. It provides auditable evidence of the policy that authorized them.

## 2. Required bindings

A receipt MUST bind:

```text
consent_receipt_id
delegation_id
client_id
beneficiary_ref
funding_source_type
spend_ceiling
overage_policy
policy_version
issued_at
expires_at
issuer
data_visibility
integrity
```

Sponsored grants SHOULD also include:

```text
sponsorship_program_id
funding_principal_display
```

## 3. Economic terms

The receipt MUST state:

- maximum quantity;
- Provider-defined unit type;
- applicable period;
- per-request ceiling where used;
- overage policy;
- exhaustion behavior;
- effective and expiry times.

`overage_policy` is either:

```text
prohibited
separately_authorized
```

A new payer, higher ceiling, broader scope, paid overage, broader Sponsor visibility, or material duration extension requires a new receipt and renewed authorization where required by policy.

## 4. Workload and model binding

The receipt MAY restrict:

```text
model_scope
operation_scope
workload_scope
```

Workload binding prevents a broadly authorized Client from silently using a grant for unrelated background jobs or high-volume workflows.

Client-supplied workload labels remain untrusted. The Provider enforces only scopes represented in the Provider-side grant and receipt.

## 5. Privacy and Sponsor visibility

Funding authorization and data disclosure are separate decisions.

The receipt MUST declare:

```text
sponsor_reporting
content_access
identity_access
```

`content_access` MUST state:

```text
not_granted_by_funding
```

unless a separate, purpose-specific authorization outside the funding grant permits broader access.

Aggregate reporting does not authorize prompts, outputs, files, precise location, conversation history, or raw identity.

## 6. Integrity

Every receipt MUST include a canonical digest. Provider-signed receipts are RECOMMENDED for Standard and higher profiles and SHOULD use asymmetric signatures in production.

Integrity evidence may include:

```text
receipt_digest
key_id
signature_format
signature
signed_at
```

A receipt identifier reused with different content is an integrity failure.

## 7. Lifecycle

```text
Provider displays effective terms
        ↓
Resource User / Economic Authorizer approves
        ↓
Provider issues Consent Receipt
        ↓
Provider creates or updates Delegated AI Grant
        ↓
Execution Tokens reference the grant
        ↓
Material policy change requires a new receipt
```

Older receipts remain immutable for audit and dispute resolution.

## 8. Revocation

The receipt SHOULD provide a Provider-controlled revocation URI or management path.

Revocation stops future execution under the grant. It does not erase prior consent, Usage Events, Ledger Events, or settlement records.

## 9. Example and schema

```text
examples/sponsor-consent-receipt.json
schemas/abds-consent-receipt-v0.6.schema.json
```
