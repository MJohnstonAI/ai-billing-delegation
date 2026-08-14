# ABDS v0.7 Flow and Architecture Diagrams

These diagrams summarize the current draft. `SPEC.md` provides the v0.6 base requirements and `SPEC_V0.7.md` controls the v0.7 normative additions where these diagrams are only illustrative.

## 1. Application Authentication Is Separate From Economic Authorization

```mermaid
flowchart LR
    U[Resource User] --> I[Application Sign-In]
    I --> C[Client Session]
    C --> F[Connect AI Usage]
    F --> PA[Provider Authorization]
    PA --> ER[Entitlement Resolution]
    ER --> EC[Economic Consent]
    EC --> G[Delegated AI Grant]
```

Signing into the Client establishes identity/session context only. It does not authorize AI resource consumption.

## 2. Provider Entitlement Resolution

```mermaid
flowchart TD
    PA[Provider Account] --> E1[Prepaid Credit]
    PA --> E2[Pay-as-you-go]
    PA --> E3[Subscription Allowance]
    PA --> E4[Delegated Subscription Add-on]
    PA --> E5[Organization Pool]
    PA --> E6[Promotion / Sponsor / Other]

    E1 --> R[Provider Entitlement Resolution]
    E2 --> R
    E3 --> R
    E4 --> R
    E5 --> R
    E6 --> R

    R -->|Eligible| C[Bounded Economic Consent]
    R -->|Not eligible| D[No delegation / alternative Provider offer]
    C --> G[Delegated AI Grant]
```

The Client may request a funding class or Provider-published offer, but the Provider selects or validates the actual Eligible Funding Entitlement.

## 3. Consumer-App Reference Flow

```mermaid
sequenceDiagram
    participant U as Resource User
    participant A as Third-party AI Client
    participant AS as AI Provider Authorization Server
    participant G as Grant Service
    participant API as AI Provider API
    participant L as Provider Ledger

    U->>A: Sign into Client
    A-->>U: Client session established
    U->>A: Connect AI Usage
    A->>AS: Authorization request
    AS->>U: Authenticate / resolve Provider Account
    AS->>AS: Resolve eligible funding entitlements
    AS->>U: Show payer, entitlement category, cap, scope, duration, revocation
    U->>AS: Approve or reduce request
    AS->>AS: Issue immutable Consent Receipt
    AS->>G: Create grant bound to approved entitlement
    G-->>A: Authorization result
    A->>AS: Exchange code using PKCE
    AS-->>A: Short-lived token with delegation_id and client_id
    A->>API: AI request
    API->>L: Enforce grant and bound entitlement
    L-->>API: Authorized within cap
    API-->>A: AI result
    U->>AS: Inspect usage or revoke later
```

The developer does not need the user's master API key.

## 4. Payer-Neutral Authorization Core

```mermaid
flowchart LR
    U[User Entitlement]
    O[Organization Budget]
    S[Sponsor Budget]
    P[Provider Promotion]
    D[Developer Account]
    R[Entitlement Resolution]
    C[Consent Receipt]
    G[Delegated AI Grant]
    T[Short-lived Execution Token]
    X[Provider Execution]

    U --> R
    O --> R
    S --> R
    P --> R
    D --> R
    R --> C
    C --> G
    G --> T
    T --> X
```

## 5. Accounting and Evidence Planes

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

## 6. Attribution Hierarchy

```mermaid
flowchart TD
    FS[Funding Source / Entitlement] --> DG[Delegated AI Grant]
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

## 7. Run-Level Reservation With Child Events

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

## 8. Consent Receipt and Grant

```mermaid
sequenceDiagram
    participant A as Client
    participant AS as Provider Authorization Server
    participant U as Resource User / Economic Authorizer
    participant G as Grant Service

    A->>AS: Structured authorization request
    AS->>AS: Resolve eligible entitlement
    AS->>U: Show payer, entitlement category, ceiling, scope, privacy, expiry, revocation
    U->>AS: Approve or reduce request
    AS->>AS: Issue immutable Consent Receipt
    AS->>G: Create grant bound to receipt and entitlement
    G-->>A: authorization code
    A->>AS: Exchange code using PKCE
    AS-->>A: Short-lived token with delegation_id and jti
```

## 9. Gateway Evidence Reconciled With Provider Evidence

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

## 10. Provider-Signed Evidence

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

## 11. Event Ordering

```mermaid
flowchart LR
    E1[Sequence 1: Gateway observed] --> E2[Sequence 2: Provider reported]
    E2 --> E3[Sequence 3: Reconciliation]
    E3 --> E4[Sequence 4: Adjustment]
```

Ordering is scoped to a reservation, run, request, or attempt. ABDS does not require one global sequence.

## 12. Late Usage and Correction

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

## 13. Sponsor-Funded NatureGuard

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
    AS->>AS: Resolve eligible Sponsor pool
    AS->>U: Show Sponsor, limits, workload, privacy, no payer fallback
    U->>AS: Approve
    AS-->>U: Consent Receipt
    AS-->>A: Grant and short-lived token
    A->>AS: AI request
    AS->>L: Reserve Sponsor allocation
    AS->>L: Settle Provider-final usage
    Note over U,S: Sponsor sees aggregate reporting only by default
```

## 14. Funding or Entitlement Unavailable

```mermaid
sequenceDiagram
    participant A as Client
    participant API as Provider API
    participant L as Ledger / Entitlement Service
    participant U as Resource User

    A->>API: AI request
    API->>L: Validate authorized funding entitlement
    L-->>API: Exhausted, paused, expired, ineligible, or revoked
    API-->>A: abds_funding_unavailable
    A-->>U: Explain delegated access is unavailable
    Note over A,U: No silent charge to another payer or entitlement
```

## 15. Provider Adoption Maturity

```mermaid
flowchart LR
    C[conceptual] --> S[simulated]
    S --> G[gateway_compatible]
    G --> E[provider_evaluated]
    E --> P[provider_pilot]
    P --> N[provider_native]
```

The last three states require evidence from the named Provider. ABDS itself currently claims no Provider adoption.