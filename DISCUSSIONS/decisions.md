# Design Decisions Log

This document records decisions that have been made in the ABDS proposal and the reasoning behind them.

---

## D1: Extend OAuth 2.0 Rather Than Define a New Protocol

**Decision:** ABDS extends OAuth 2.0 rather than defining a new authentication protocol from scratch.

**Rationale:** OAuth 2.0 is universally understood by developers and already implemented by all major AI providers for their existing authentication flows. Extending it means developers need to learn only the ABDS-specific scopes and claims, not an entirely new protocol. It also means ABDS can leverage existing OAuth libraries, tooling, and security analysis.

**Considered alternative:** A new purpose-built protocol with AI-specific primitives. Rejected due to adoption friction and the difficulty of competing with established standards.

---

## D2: User-Controlled Quota Caps Are Mandatory

**Decision:** The ABDS consent screen MUST allow users to set their own quota cap, overriding the app's requested amount.

**Rationale:** User trust and control are prerequisites for adoption. If users cannot cap how much of their subscription an app can consume, they will not authorize delegation. The Spotify model works because users trust they will not be charged extra — ABDS must provide the equivalent guarantee.

---

## D3: Model Scoping Is Optional

**Decision:** `model_scope` is an optional parameter. Apps may request delegation without restricting which models can be used.

**Rationale:** Requiring model scoping adds friction for simple apps. Advanced apps that want to restrict costs to cheaper models (e.g. Haiku rather than Opus) can use it. The default (no model_scope) allows any model the user's subscription includes.

---

## D4: All API Calls Must Go Through a Backend Proxy

**Decision:** The ABDS spec requires that delegation tokens never be stored or used client-side in mobile applications. All API calls must be proxied through the Consumer Application's backend.

**Rationale:** A delegation token grants access to a user's subscription quota. If exposed client-side, it could be extracted and used by a third party to exhaust the user's quota. This is a more serious harm than a developer's API key being stolen.

---

## D5: ABDS Is Defined As An Open Standard, Not a Vendor Feature

**Decision:** ABDS is proposed as an open, cross-vendor standard with an MIT license.

**Rationale:** A proprietary implementation by one AI provider would solve the problem partially but create new fragmentation. Developers would need different flows for each provider. An open standard enables developer portability and focuses vendor competition on model quality rather than billing model lock-in.
