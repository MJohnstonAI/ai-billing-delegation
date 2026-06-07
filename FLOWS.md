# ABDS OAuth Flow Diagrams

## Standard Delegation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Consumer App
    participant P as AI Provider (e.g. Anthropic)
    participant API as AI API

    U->>A: Opens app, triggers AI feature
    A->>P: Redirect to authorization endpoint
    Note over A,P: ?scope=ai.quota.delegate&quota_cap=100
    P->>U: Show consent screen
    Note over P,U: "MusicApp wants to use 100 of your monthly queries"
    U->>P: Approves (adjusts cap if desired)
    P->>A: Authorization code
    A->>P: Exchange code for delegation token
    P->>A: Delegation token (JWT with quota claims)
    A->>API: API call with delegation token
    API->>P: Validate token, check quota
    P->>API: Quota OK, decrement user balance
    API->>A: Response
    A->>U: AI-powered result
```

## Quota Exhaustion Flow

```mermaid
sequenceDiagram
    participant A as Consumer App
    participant API as AI API
    participant U as User

    A->>API: API call with delegation token
    API->>API: Check quota_used >= quota_cap
    API->>A: HTTP 429, X-ABDS-Quota-Exceeded: true
    A->>U: "You've used your 100 monthly queries for MusicApp"
    U->>A: Taps "Increase limit"
    A->>API: Redirect to quota increase consent screen
    API->>U: "Increase MusicApp quota to 200?"
    U->>API: Approves
    API->>A: Updated delegation token
```

## Revocation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as AI Provider Dashboard
    participant A as Consumer App
    participant API as AI API

    U->>P: Navigates to "Connected Apps"
    U->>P: Clicks "Revoke" for MusicApp
    P->>P: Marks delegation_id as revoked
    A->>API: Subsequent API call
    API->>A: HTTP 401, abds_token_revoked
    A->>U: "Your Anthropic authorization was revoked. Reconnect?"
```

## Multi-Provider Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Consumer App
    participant ANT as Anthropic
    participant OAI as OpenAI

    Note over U,A: User has both Claude Pro and ChatGPT Plus
    U->>A: Opens app settings
    A->>U: "Connect your AI account"
    U->>A: Selects "Anthropic"
    A->>ANT: ABDS authorization flow
    ANT->>A: Delegation token (Anthropic)
    Note over A: App now uses Anthropic quota by default
    U->>A: Later switches to "OpenAI"
    A->>OAI: ABDS authorization flow
    OAI->>A: Delegation token (OpenAI)
    Note over A: App switches to OpenAI quota
```

## User Control Dashboard (Conceptual)

```
┌─────────────────────────────────────────────┐
│  Anthropic Account → Connected Apps          │
├─────────────────────────────────────────────┤
│  MusicTasteApp                               │
│  Quota: 47/100 used this month               │
│  Resets: Dec 1, 2024                         │
│  Models: claude-3-haiku only                 │
│  [Adjust Limit]  [Revoke Access]             │
├─────────────────────────────────────────────┤
│  EntertainmentCurator                        │
│  Quota: 12/50 used this month                │
│  Resets: Dec 1, 2024                         │
│  Models: any                                 │
│  [Adjust Limit]  [Revoke Access]             │
└─────────────────────────────────────────────┘
```
