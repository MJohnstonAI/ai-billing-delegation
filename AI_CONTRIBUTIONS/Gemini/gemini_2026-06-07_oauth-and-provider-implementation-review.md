# Technical Review of the AI Billing Delegation Standard (ABDS) - v2

**Document Reference:** ABDS-REV-2026-06-v2
**Status:** Formal Architecture Review / Standards Contribution
**Audience:** Software Architects, Chief Executive Officers, Academic Reviewers

---

## 1. Executive Summary

The AI Billing Delegation Standard (ABDS) addresses a critical economic and architectural bottleneck in the consumer AI ecosystem: the resource provisioning friction point. Currently, third-party developers building on foundational models must either assume volatile inference costs, engineer internal credit economies, or force users into high-friction "Bring Your Own Key" (BYOK) configurations. ABDS introduces a standardized mechanism to delegate resource billing directly to the end-user's pre-existing provider subscription.

To achieve internet-scale adoption, ABDS should be formalized as an **OAuth 2.0 Profile** utilizing the **OAuth Token Exchange pattern (RFC 8693)** and **Resource Indicators (RFC 8707)**. By inheriting the security baselines of the OAuth 2.0 Security Best Current Practice (BCP), the standard allows the industry to leverage existing Authorization Server (AS) infrastructure, radically lowering the barrier to adoption.

---

## 2. Core Architectural Strengths

The design paradigm of ABDS exhibits deep structural soundness in several key areas:

* **Isolation of Token State from Quota Metrics:** Omitting volatile consumption metrics from the JSON Web Token (JWT) claims prevents systemic cache-invalidation challenges and distributed race conditions. Keeping the token static with a unique reference indicator is the correct approach.
* **Provider-Authoritative Ledger Model:** Centralizing the state ledger prevents client-side manipulation and double-spending of subscription capabilities.
* **Short-Lived Execution Tokens:** Restricting downstream execution tokens to brief lifespans limits the window of vulnerability.
* **Elimination of Consumer BYOK:** Abstracting raw API keys preserves fundamental credential hygiene.

---

## 3. OAuth 2.0 and OIDC Alignment Mapping

To ensure interoperability, ABDS must map to current IETF and OpenID Foundation (OIDF) standards.

| ABDS Component | Established Standard | Implementation Requirement |
| :--- | :--- | :--- |
| **Initial App Authorization** | OAuth 2.0 Authorization Code Flow with PKCE | Mandated for all web and native client integrations. |
| **Long-Lived Delegation** | OAuth 2.0 Refresh Tokens | The Client uses a rotated Refresh Token to request new execution tokens. |
| **Execution Token Issuance** | OAuth 2.0 Token Exchange (RFC 8693) | The AS evaluates the original delegation grant and mints a downstream token. |
| **Targeting Providers** | OAuth 2.0 Resource Indicators (RFC 8707) | Specifies the target AI Provider API endpoint URL (`aud`). |

---

## 4. Token Design & Cryptographic Hardening

Execution Access Tokens must be formatted as cryptographically signed JSON Web Tokens (RFC 7519) utilizing asymmetric algorithms.

### Cryptographic Token Blueprint (JWT Claims)
*Note: Ensure values are strictly formatted strings or arrays without markdown link pollution.*

```json
{
  "iss": "[https://auth.aiprovider.com](https://auth.aiprovider.com)",
  "sub": "usr_948201842",
  "aud": "[https://api.aiprovider.com/v1/inference](https://api.aiprovider.com/v1/inference)",
  "exp": 1780842000,
  "iat": 1780841100,
  "jti": "b0a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "client_id": "app_translation_studio_prod",
  "delegation_id": "del_883019481a7b",
  "scope": "ai.inference.generate",
  "model_scope": ["standard-text-only"],
  "abds_version": "0.2"
}

```

### Security Considerations (DPoP)

To mitigate token-replay vulnerabilities resulting from transit interception or client-side log leaks, the specification **SHOULD support Demonstrating Proof-of-Possession at the Application Layer (DPoP, RFC 9449)**. High-security providers **MAY require** it for elevated risk scopes (e.g., highly agentic, unbounded models).

---

## 5. Quota Reservation for Complex Workloads

AI resource usage profiles differ fundamentally from traditional web APIs. A single prompt can trigger cascading tool calls or massive multi-modal output.

### The Reservation-Settlement Pattern (Recommended v0.3 Profile)

While not mandatory for the baseline v0.2 specification, ABDS should introduce an **Optimistic Reservation with Final Settlement** paradigm as a recommended v0.3 profile for streaming, long-running, multimodal, batch, and agentic workloads:

1. **The Lock Phase:** The Gateway calculates the maximum potential cost and places a temporary hold on the ledger. If the balance is insufficient, the request is instantly rejected with an HTTP `429 Too Many Requests` (indicating quota exceeded). The `402 Payment Required` status is strictly reserved for instances where the underlying user subscription has lapsed.
2. **The Execution Phase:** The system processes the workload or streams chunks to the client.
3. **The Settlement Phase:** When the stream completes or terminates, the Gateway calculates exact consumption, converts the temporary lock to a permanent debit, and releases unused reservation back to the active pool.

---

## 6. Client-Side Integration Architecture

Exposing long-lived refresh tokens or short-lived access tokens to standard browser storage (`localStorage` or `sessionStorage`) leaves the user's economic capacity vulnerable to Cross-Site Scripting (XSS).

### Backend-for-Frontend (BFF) Proxy Pattern

For modern multi-page Next.js architectures with TypeScript (or similar server-side rendering frameworks), the client runtime browser must never handle OAuth tokens directly.

1. **Server-Side Token Storage:** The long-lived Refresh Token received during the initial OAuth flow must be stored strictly server-side (e.g., within an encrypted database or secure key-value store linked to the user's session).
2. **Opaque Session Cookie:** The frontend browser is issued only an **opaque, secure, HTTP-only session cookie**. The browser's JavaScript runtime cannot access any underlying ABDS tokens.
3. **Server-Side Token Exchange:** When an AI event is triggered, the browser sends a standard internal API request to the backend. The backend retrieves the refresh token, performs an upstream token exchange (RFC 8693) for an execution token, signs the payload (if DPoP is required), and proxies the AI response back to the client.

---

## 7. Comparative Analysis: Google Cloud & IAM Patterns

To contextualize ABDS for enterprise engineering teams, it must be mapped against existing infrastructure primitives. Below is an analysis of how established Google architectural patterns relate to the decentralized consumer AI billing model:

* **Google Sign-In & Workspace OAuth Consent:** The preeminent pattern for delegating *data access* (e.g., "Read my emails"). ABDS extends this exact UI/UX consent paradigm, but shifts the requested scope from data access to *economic compute consumption*.
* **Google Cloud IAM & Service Accounts:** Designed for high-trust, server-to-server intra-organizational workloads. Service accounts cannot securely facilitate zero-trust, B2C application scaling without creating massive liability for the application developer.
* **Quota Projects (BYOK equivalence):** API calls can specify a target project for billing routing. However, this is designed for technical cloud resources, lacks human-facing consent flows, and fundamentally fails at consumer scale.
* **Cloud Billing Export & Marketplace Billing:** These mechanisms handle post-hoc aggregation and B2B SaaS invoicing. ABDS is fundamentally different; it requires pre-flight, real-time transactional gateway locking before inference occurs.
* **Domain-Wide Delegation:** Allows an administrative identity to delegate comprehensive authority to a service account. This is a binary, high-trust enterprise action, whereas ABDS mandates strict, user-controlled, non-binary resource caps in a low-trust consumer ecosystem.

---

## 8. Spec Integration Guidance

To formalize these recommendations for the next ABDS repository update, the following categorizations apply (utilizing RFC 2119 terminology):

* **MUST:**
* Implement the core protocol as an OAuth 2.0 extension profile.
* Use `429 Too Many Requests` for quota exhaustion and restrict `402 Payment Required` exclusively to lapsed subscription states.
* Format the `model_scope` JWT claim as an array of strings.


* **SHOULD:**
* Support DPoP (RFC 9449) token binding for all execution token endpoints.
* Mandate the BFF (Backend-for-Frontend) proxy pattern with opaque session cookies for all web applications to prevent token exfiltration.


* **MAY:**
* Allow Resource Servers (Providers) to explicitly require DPoP signatures for high-tier or unbounded agentic models.


* **FUTURE WORK (v0.3 Profile):**
* Formally specify the Optimistic Reservation and Final Settlement workflow for streaming, long-running, multimodal, batch, and agentic compute paradigms.
