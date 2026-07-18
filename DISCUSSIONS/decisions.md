# Design Decisions Log

This document records decisions that have been made in the ABDS proposal and the reasoning behind them.

---

## D1: Extend OAuth 2.0 Rather Than Define a New Protocol

**Decision:** ABDS extends OAuth 2.0 rather than defining a new authentication protocol from scratch.

**Rationale:** OAuth 2.0 has mature libraries, deployment experience, security analysis, and extensibility mechanisms. Profiling it lets ABDS focus on metered-resource authorization rather than inventing a new credential protocol.

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

## D4: Sensitive Credentials Must Not Be Exposed to Untrusted Clients

**Decision:** Backend-mediated token handling is the default for consumer applications. Direct public-client execution is permitted only when the Provider explicitly supports it with suitably short-lived, audience-restricted, sender-constrained credentials and an equivalent risk profile.

**Rationale:** An ABDS credential can consume a user's or Sponsor's scarce allowance. Browser storage, mobile application packages, and logs are common extraction paths. The standard should define the required security outcome without making one network topology the only compliant architecture.

---

## D5: ABDS Is Defined As An Open Standard, Not a Vendor Feature

**Decision:** ABDS is proposed as an open, cross-vendor standard with an MIT license.

**Rationale:** A proprietary implementation by one AI provider would solve the problem partially but create new fragmentation. Developers would need different flows for each provider. An open standard enables developer portability and focuses vendor competition on model quality rather than billing model lock-in.

---

## D6: The Core Model Is Payer-Neutral

**Decision:** ABDS separates the Resource User, Beneficiary, Funding Principal, Economic Authorizer, Client, and Provider.

**Rationale:** User-funded quota is only one instance of the underlying problem. Employers, universities, governments, donors, foundations, membership organizations, Provider promotions, and developers may also fund bounded usage. The same grant, token, and ledger model can support these cases without assuming that the user is always the payer.

**Considered alternative:** Keep ABDS limited to user subscriptions and create an unrelated Sponsor protocol. Rejected because it would duplicate the core grant and accounting semantics.

---

## D7: Structured Economic Policy Uses Rich Authorization Requests

**Decision:** ABDS v0.4 uses OAuth 2.0 Rich Authorization Requests as the preferred carrier for cap, period, model, operation, funding offer, and overage policy.

**Rationale:** OAuth scopes are intentionally coarse and cannot safely represent a growing structured economic policy. RFC 9396 provides a standards-track mechanism intended for fine-grained authorization details.

**Considered alternative:** Continue adding custom top-level query parameters such as `quota_cap` and `model_scope`. Rejected as less interoperable and harder to validate.

---

## D8: Funding Does Not Grant Data Access

**Decision:** Sponsor funding does not authorize Sponsor access to prompts, outputs, files, conversations, or user identity.

**Rationale:** Economic sponsorship and data disclosure are separate decisions. Conflating them would turn an access mechanism into a surveillance mechanism and undermine user trust.

---

## D9: No Silent Payer Substitution

**Decision:** When an authorized funding source becomes unavailable, ABDS must stop, use another already-authorized source, or obtain fresh authorization.

**Rationale:** Silently charging a user or developer after Sponsor exhaustion breaks the economic consent shown to every party.
