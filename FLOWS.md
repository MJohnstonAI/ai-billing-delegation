# ABDS v0.6 Flow and Architecture Diagrams

These diagrams summarize the current draft. `SPEC.md` controls where normative text and diagrams differ.

## 1. Payer-Neutral Authorization Core

```mermaid
flowchart LR
    U[User Entitlement]
    O[Organization Budget]
    S[Sponsor Budget]
    P[Provider Promotion]
    D[Developer Account]
    C[Consent Receipt]
    G[Delegated AI Grant]
    T[Short-lived Execution Token]
    X[Provider Execution]

    U --> C
    O --> C
    S --> C
    P --> C
    D --> C
    C --> G
    G --> T
    T --> X
```

## 2. Accounting and Evidence Planes

```mermaid
flowchart TD
    X[Provider Execution] --> U[Usage Event Plane]
    X --> L[Economic Ledger Plane]

    U --> A[Attempt identity, route, model, dimensions]
    U --> E[Evidence provenance]
    E --> G[Gateway-attested]
    E --> R[Provider-reported]
    E --> S[Provider-signed]
    G --> Q[Reconciliation]
    R --> Q
    S --> Q
    Q --> L

    L --> L1[Reservation]
    L --> L2[Settlement]
    L --> L3[Release or Expiry]
    L --> L4[Compensating Adjustment]
```

## 3. Attribution Hierarchy

```mermaid
flowchart TD
    FS[Funding Source] --> DG[Delegated AI Grant]
    DG --> C[Registered Client]
    C --> B[Beneficiary]
    B --> R[Logical Request]
    R --> W[Workload / Workflow]
    W --> AR[Agent Run]
    AR --> AS[Agent Step]
    AS --> A1[Primary Attempt]
    AS --> A2[Retry]
    AS --> A3[Fallback]
```

The delegated principal and registered Client remain separately attributable.

## 4. Run-Level Reservation With Child Events

```mermaid
flowchart TD
    RR[Run-level Reservation] --> S1[Agent Step 1]
    RR --> S2[Agent Step 2]
    S1 --> A1[Model Attempt]
    S1 --> A2[Retry]
    S2 --> A3[Fallback]
    A1 --> U1[Usage Event]
    A2 --> U2[Usage Event]
    A3 --> U3[Usage Event]
    U1 --> ST[One Terminal Settlement]
    U2 --> ST
    U3 --> ST
```

## 5. Consent Receipt and Grant

```mermaid
sequenceDiagram
    participant A as Client
    participant AS as Provider Authorization Server
    participant U as Resource User
    participant G as Grant Service

    A->>AS: Structured authorization request
    AS->>U: Show payer, ceiling, scope, privacy, expiry, revocation
    U->>AS: Approve or reduce request
    AS->>AS: Issue immutable Consent Receipt
    AS->>G: Create grant bound to receipt
    G-->>A: authorization code
    A->>AS: Exchange code using PKCE
    AS-->>A: Short-lived token with delegation_id and jti
```

## 6. Gateway Evidence Reconciled With Provider Evidence

```mermaid
sequenceDiagram
    participant A as Client
    participant GW as ABDS Gateway
    participant P as AI Provider
    participant E as Event Store
    participant L as Ledger

    A->>GW: Logical request
    GW->>L: Reserve run envelope
    GW->>P: Provider request
    P-->>GW: Response + provider_request_id
    GW->>E: Gateway-attested provisional Usage Event
    GW->>L: Provisional or policy-defined settlement
    P-->>GW: Later Provider usage or billing record
    GW->>E: Provider-reported or Provider-signed evidence
    GW->>E: Append Reconciliation Event
    alt Quantity matches
        GW->>L: No economic change
    else Quantity differs
        GW->>L: Idempotent compensating adjustment
    end
```

## 7. Provider-Signed Evidence

```mermaid
flowchart LR
    P[Provider Usage Event] --> C[Canonical Payload]
    C --> D[SHA-256 Digest]
    D --> S[Provider Signature]
    S --> V[Verifier]
    K[Provider Key Discovery] --> V
    V --> R[Verified / Failed]
```

Production signatures should use asymmetric keys. High-volume systems may verify inclusion in a signed batch.

## 8. Event Ordering

```mermaid
flowchart LR
    E1[Sequence 1: Gateway observed] --> E2[Sequence 2: Provider reported]
    E2 --> E3[Sequence 3: Reconciliation]
    E3 --> E4[Sequence 4: Adjustment]
```

Ordering is scoped to a reservation, run, request, or attempt. ABDS does not require one global sequence.

## 9. Late Usage and Correction

```mermaid
flowchart TD
    O[Original Usage Event] --> S[Original Settlement]
    P[Late Provider Record] --> R[Reconciliation Event]
    O --> R
    R --> M{Variance?}
    M -->|No| F[Final / Matched]
    M -->|Yes| A[Compensating Ledger Adjustment]
```

The original event and settlement remain immutable.

## 10. Sponsor-Funded NatureGuard

```mermaid
sequenceDiagram
    participant S as Green Earth Foundation
    participant AS as Provider
    participant U as NatureGuard User
    participant A as NatureGuard
    participant L as Sponsor Ledger

    S->>AS: Create bounded funding program
    U->>A: Start sponsored feature
    A->>AS: Request grant with funding offer
    AS->>U: Show Sponsor, limits, workload, privacy, no payer fallback
    U->>AS: Approve
    AS-->>U: Consent Receipt
    AS-->>A: Grant and short-lived token
    A->>AS: AI request
    AS->>L: Reserve Sponsor allocation
    AS->>L: Settle Provider-final usage
    Note over U,S: Sponsor sees aggregate reporting only by default
```

## 11. Funding Unavailable

```mermaid
sequenceDiagram
    participant A as Client
    participant API as Provider API
    participant L as Ledger
    participant U as Resource User

    A->>API: AI request
    API->>L: Validate authorized funding bucket
    L-->>API: Exhausted, paused, expired, or revoked
    API-->>A: abds_funding_unavailable
    A-->>U: Explain funded access is unavailable
    Note over A,U: No silent charge to another payer
```
