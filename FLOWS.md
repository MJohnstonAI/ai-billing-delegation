# ABDS Flow Diagrams

## User-Funded Delegation

```mermaid
sequenceDiagram
    participant U as Resource User
    participant A as Consumer Application
    participant AS as Provider Authorization Server
    participant G as Grant Service
    participant API as AI Resource Server
    participant L as Usage Ledger

    U->>A: Starts AI feature
    A->>AS: Authorization request with structured authorization_details
    AS->>U: Show Client, funding source, cap, models, overage, and privacy
    U->>AS: Approve or lower the requested cap
    AS->>G: Create grant against eligible user entitlement
    G-->>AS: delegation_id
    AS-->>A: Authorization code
    A->>AS: Exchange code with PKCE verifier
    AS-->>A: Short-lived token referencing delegation_id
    A->>API: AI request with Execution Token
    API->>G: Validate grant and policy
    API->>L: Reserve or debit authorized usage
    L-->>API: Allowed
    API-->>A: AI response
    A-->>U: Result
```

## Sponsor-Funded NatureGuard

```mermaid
sequenceDiagram
    participant S as Green Earth Foundation
    participant AS as Provider Authorization Server
    participant U as NatureGuard User
    participant A as NatureGuard
    participant G as Grant Service
    participant API as AI Resource Server
    participant L as Sponsor Usage Ledger

    S->>AS: Create bounded NatureGuard Sponsorship Program
    Note over S,AS: Total cap, per-user cap, models, end date, reporting policy
    U->>A: Starts sponsored AI feature
    A->>AS: Request ABDS grant with funding_offer_id
    AS->>AS: Validate Sponsor program, Client, and user eligibility
    AS->>U: "Green Earth Foundation pays; you will not be charged"
    Note over AS,U: Show cap, end date, privacy, and revocation
    U->>AS: Approves
    AS->>G: Create grant bound to Client + Beneficiary + Sponsor program
    G-->>AS: delegation_id
    AS-->>A: Authorization code
    A->>AS: Exchange code using PKCE
    AS-->>A: Short-lived Execution Token
    A->>API: NatureGuard request
    API->>G: Validate grant, Client, Beneficiary, models, and program
    API->>L: Debit Sponsor program
    L-->>API: Allowed
    API-->>A: AI response
    A-->>U: NatureGuard result
    Note over U,S: Sponsor receives aggregate reporting only by default
```

## Quota Exhaustion

```mermaid
sequenceDiagram
    participant A as Consumer Application
    participant API as AI Resource Server
    participant L as Usage Ledger
    participant U as Resource User

    A->>API: AI request with Execution Token
    API->>L: Atomically reserve or debit usage
    L-->>API: Per-Beneficiary cap exhausted
    API-->>A: HTTP 429 abds_quota_exceeded
    A-->>U: "Your funded allowance is exhausted"
    Note over A,U: Show reset or reauthorization options
```

The Client does not receive confidential Sponsor pool balances.

## Sponsor Funding Unavailable

```mermaid
sequenceDiagram
    participant A as Consumer Application
    participant API as AI Resource Server
    participant L as Sponsor Usage Ledger
    participant U as Resource User

    A->>API: AI request
    API->>L: Validate Sponsorship Program and funding
    L-->>API: Program ended, paused, or unavailable
    API-->>A: abds_funding_unavailable or abds_sponsorship_ended
    A-->>U: Explain that sponsored access is unavailable
    Note over A,U: No silent charge to user or developer
    U->>A: Stop or explicitly authorize another funding source
```

## User Revocation

```mermaid
sequenceDiagram
    participant U as Resource User
    participant D as Provider Connected Apps
    participant G as Grant Service
    participant A as Consumer Application
    participant API as AI Resource Server

    U->>D: Revoke Client
    D->>G: Set grant status to revoked
    A->>API: Subsequent request
    API->>G: Resolve delegation_id
    G-->>API: revoked
    API-->>A: HTTP 401 abds_token_revoked
    A-->>U: Offer explicit reauthorization
```

## Sponsor Program Revocation

```mermaid
sequenceDiagram
    participant S as Sponsor Administrator
    participant P as Provider Program Service
    participant G as Grant Service
    participant A as Consumer Application

    S->>P: Pause or end future funding
    P->>G: Invalidate affected funding availability
    G-->>A: Optional program-status event
    Note over P,A: Existing requests settle according to disclosed policy
    Note over A: New requests hard-stop; no payer substitution
```

## Reservation and Settlement

```mermaid
sequenceDiagram
    participant A as Consumer Application
    participant API as AI Resource Server
    participant L as Usage Ledger
    participant M as Inference Engine

    A->>API: Request estimate for bounded operation
    API->>L: Check grant and funding availability
    L-->>API: Reservation approved
    API-->>A: reservation_id + maximum envelope
    A->>API: Execute with reservation_id
    API->>M: Run within authorized envelope
    M-->>API: Actual usage and response
    API->>L: Settle actual usage
    L->>L: Release unused reservation
    API-->>A: Response + optional usage receipt
```

## Payer-Neutral Funding Choices

```mermaid
flowchart LR
    U[User Entitlement]
    O[Organization Budget]
    S[Sponsor Budget]
    P[Provider Promotion]
    D[Developer Account]
    G[Delegated AI Grant]
    T[Short-lived Token]
    L[Provider Usage Ledger]

    U --> G
    O --> G
    S --> G
    P --> G
    D --> G
    G --> T
    T --> L
```

Only a funding source already authorized for the Client and Beneficiary can fund execution.
