# ABDS v0.5 Flow and Architecture Diagrams

These diagrams summarize the current canonical model. `SPEC.md` controls where a diagram and normative text differ.

## 1. Payer-Neutral Authorization Core

```mermaid
flowchart LR
    U[User Entitlement]
    O[Organization Budget]
    S[Sponsor Budget]
    P[Provider Promotion]
    D[Developer Account]
    G[Delegated AI Grant]
    T[Short-lived Execution Token]
    X[Provider Execution]

    U --> G
    O --> G
    S --> G
    P --> G
    D --> G
    G --> T
    T --> X
```

## 2. v0.5 Two-Plane Architecture

```mermaid
flowchart TD
    X[Provider Execution]
    X --> U[Usage Event Plane]
    X --> L[Economic Ledger Plane]

    U --> U1[Logical request and physical attempt]
    U --> U2[Provider, route, requested and resolved model]
    U --> U3[Tokens, modalities, tools, latency, outcome]
    U --> U4[Optional workspace, feature, workflow, agent and trace refs]

    L --> L1[Reservation created]
    L --> L2[Settlement posted]
    L --> L3[Reservation released or expired]
    L --> L4[Execution denied]
    L --> L5[Compensating adjustment]
```

Provider accounting is authoritative. Client observability labels cannot change the billed quantity or payer.

## 3. Attribution Hierarchy

```mermaid
flowchart TD
    FS[Funding Source] --> DG[Delegated AI Grant]
    DG --> C[Client]
    C --> B[Beneficiary / Workspace]
    B --> R[Logical Request]
    R --> WF[Workflow / Feature]
    WF --> AR[Agent Run]
    AR --> AS[Agent Step]
    AS --> A1[Physical Attempt]
```

## 4. Logical Request Versus Physical Attempts

```mermaid
flowchart LR
    R[Logical Request req_88] --> A1[Attempt 1: primary model timeout]
    R --> A2[Attempt 2: retry failed after partial inference]
    R --> A3[Attempt 3: fallback model completed]
    A1 --> U1[Usage Event]
    A2 --> U2[Usage Event]
    A3 --> U3[Usage Event]
    U1 --> S[One idempotent settlement]
    U2 --> S
    U3 --> S
```

A final successful response does not erase the cost of previous billable attempts.

## 5. User-Funded Delegation

```mermaid
sequenceDiagram
    participant U as Resource User
    participant A as Consumer Application
    participant AS as Provider Authorization Server
    participant G as Grant Service
    participant API as AI Resource Server
    participant L as Provider Ledger

    U->>A: Start AI feature
    A->>AS: Authorization request with authorization_details
    AS->>U: Show Client, payer, cap, models, overage, privacy
    U->>AS: Approve or reduce cap
    AS->>G: Create grant against eligible entitlement
    G-->>AS: delegation_id
    AS-->>A: Authorization code
    A->>AS: Exchange code with PKCE
    AS-->>A: Short-lived Execution Token
    A->>API: Logical request
    API->>G: Validate grant and funding status
    API->>L: Reserve or debit atomically
    L-->>API: Authorized envelope
    API-->>A: Result
    API->>L: Settle actual usage and release remainder
```

## 6. Sponsor-Funded NatureGuard

```mermaid
sequenceDiagram
    participant S as Green Earth Foundation
    participant AS as Provider Authorization Server
    participant U as NatureGuard User
    participant A as NatureGuard
    participant G as Grant Service
    participant API as AI Resource Server
    participant L as Sponsor Ledger

    S->>AS: Create bounded Sponsor program
    Note over S,AS: Total cap, per-user cap, models, end date, reporting policy
    U->>A: Start sponsored feature
    A->>AS: Request grant with funding_offer_id
    AS->>AS: Validate Sponsor, Client, and eligibility
    AS->>U: Show Sponsor pays; no silent fallback
    U->>AS: Approve
    AS->>G: Create grant bound to Client + Beneficiary + funding bucket
    G-->>AS: delegation_id
    AS-->>A: Authorization code and token exchange
    A->>API: AI request
    API->>L: Reserve Sponsor allocation
    API-->>A: Result
    API->>L: Settle measured usage
    Note over U,S: Sponsor sees aggregate reporting only by default
```

## 7. Reservation and Settlement State Machine

```mermaid
stateDiagram-v2
    [*] --> Active: reservation_created
    Active --> Settled: settlement_posted
    Active --> Released: reservation_released
    Active --> Expired: reservation_expired
    Settled --> Adjusted: adjustment_posted
    Released --> [*]
    Expired --> [*]
    Adjusted --> [*]
```

## 8. Streaming and Partial Completion

```mermaid
sequenceDiagram
    participant A as Client
    participant API as Provider API
    participant L as Ledger
    participant M as Model

    A->>API: Request with maximum output and idempotency key
    API->>L: Create reservation
    L-->>API: reservation_id
    API->>M: Execute within envelope
    M-->>API: Stream partial output and measured usage
    A--xAPI: User cancels or disconnects
    API->>M: Stop future generation
    API->>L: Settle consumed quantity
    API->>L: Release unused quantity
    API-->>A: Partial-completion status
```

## 9. Retry and Fallback Accounting

```mermaid
sequenceDiagram
    participant A as Client
    participant R as Provider Router
    participant P1 as Primary Model
    participant P2 as Fallback Model
    participant E as Event Store
    participant L as Ledger

    A->>R: Logical request req_88
    R->>P1: Attempt att_1
    P1-->>R: Timeout after partial inference
    R->>E: Usage Event att_1
    R->>P1: Retry att_2
    P1-->>R: Capacity failure
    R->>E: Usage Event att_2
    R->>P2: Fallback att_3
    P2-->>R: Completed
    R->>E: Usage Event att_3
    R->>L: One idempotent settlement referencing billable events
    R-->>A: Final response
```

## 10. Privacy Boundaries

```mermaid
flowchart LR
    U[Resource User] -->|authorizes| P[AI Provider]
    A[Client] -->|opaque workflow and trace refs| P
    P -->|grant-specific usage and errors| A
    S[Sponsor] -->|funding policy| P
    P -->|aggregate program report| S

    C[Prompts / Outputs / Files / Identity]
    C -. not granted by funding .-> S
    A -. no access to unrelated plan or Sponsor balance .-> P
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
    Note over A,U: No charge to another payer without prior authorization or fresh consent
```
