# ABDS Technical Specification v0.2 (Draft)

## Abstract

This document specifies the AI Billing Delegation Standard (ABDS), an OAuth-based delegation profile that lets users authorize bounded third-party consumption of provider-defined AI resource units, enforced by the AI provider through grant records, short-lived execution tokens, usage ledgers, revocation controls, and explicit economic consent.

ABDS requires no new authentication infrastructure — it extends the proven OAuth 2.0 Authorization Code Flow with AI-specific scope definitions, a delegated grant object model, and provider-side usage ledger requirements.

## 1. Motivation

Consumer AI applications face a structural billing problem with no current solution:

- AI provider API costs are billed to the developer, not the end user
- No mechanism exists for a user to authorize quota consumption from their own subscription
- BYOK (Bring Your Own Key) is not viable for non-technical consumers
- Developers must either