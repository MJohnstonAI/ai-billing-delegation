# ABDS Rationale and Economic Case

## The Developer's Dilemma

Every developer who has tried to build a consumer AI app on Claude, GPT-4, or Gemini has hit the same wall. The API billing model is designed for B2B — a business pays per token, passes the cost to their customers through their product pricing, and manages the margin.

This breaks completely for consumer apps in the following ways:

### 1. Unlimited Financial Exposure

A developer with 10,000 daily active users making 5 queries each at $0.001/query faces $50/day in API costs — $1,500/month — before earning a single dollar. If the app goes viral and hits 100,000 users overnight, that bill becomes $15,000/month instantly. The developer has no mechanism to cap this exposure except building their own credit/billing system, which is weeks of engineering work before a single user can be served.

### 2. The Key Exposure Attack Vector

To make API calls from a mobile app, the API key must exist somewhere on the client or on a server the client calls. Client-side storage means the key can be extracted from the APK or IPA. Server-side proxy means a determined attacker can reverse-engineer the endpoint and hammer it with free requests. Neither approach is secure without substantial rate-limiting infrastructure.

### 3. BYOK Is Not a Consumer Solution

Bring Your Own Key works for developer tools — products like Cursor and Windsurf succeed with it because their users are developers who already have API keys and understand token costs. For a music taste app or entertainment curator, asking a user to "get an API key from Anthropic and paste it here" is a complete non-starter. The user has no idea what that means and no desire to find out.

### 4. The Credit System Tax

The industry workaround is to build a credit/paywall system: charge users $2.99 for 200 queries, track balances in a database, deduct per call, handle top-ups via in-app purchase. This works but it adds 2–3 weeks of engineering to every consumer AI app, 15–30% platform fees on all revenue, and significant ongoing operational overhead. It is a tax on consumer AI app development that does not exist in any comparable ecosystem.

## The Spotify Precedent

When Spotify introduced its API in 2014, it could have required third-party apps to pay per stream. Instead, it implemented OAuth delegation: third-party apps request the user's permission to use their Spotify account, and stream costs are billed against the user's subscription.

The result was an explosion of third-party Spotify clients, integrations, and music tools that grew the value of the Spotify ecosystem without costing developers anything. The developer builds freely; the user's subscription covers the usage they authorized.

**This is exactly the model AI providers should adopt.**

## The Economic Case for AI Providers

At first glance, ABDS appears to threaten AI provider revenue by reducing developer API billing. In practice, the opposite is likely true.

### Underutilised Quota

Research across SaaS subscription models consistently shows that most users consume 15–25% of their included quota. A Claude Pro subscriber paying $20/month who uses Claude for occasional writing assistance leaves 75–85% of their quota idle every month. ABDS allows that user to put idle quota to work in apps they choose — with their explicit consent and control. The provider loses nothing; they have already been paid.

### Developer Ecosystem Expansion

The primary barrier to consumer AI app development today is financial risk. Remove that barrier, and the number of consumer AI apps built on any given provider's platform grows dramatically. More apps mean more users. More users mean more subscriptions. More subscriptions mean more revenue. The developer ecosystem is a growth multiplier, not a revenue competitor.

### First-Mover Competitive Advantage

The AI provider that implements ABDS first will capture a generation of consumer app developers. Developer loyalty in platform ecosystems is high and switching costs are real. The provider that solves this problem owns the consumer app layer of the AI ecosystem. This is worth far more than the marginal API billing revenue from developers who currently absorb costs reluctantly.

### The Open Banking Parallel

Open banking regulations in the EU (PSD2) and UK required banks to provide API access so that third-party apps could use customer account data with customer consent. Banks resisted, argued it would cannibalize revenue, and were ultimately required to comply. The result was an explosion of fintech innovation that expanded the overall market. AI providers have an opportunity to get ahead of equivalent regulatory pressure by implementing voluntary standards now.

## Why This Must Be A Standard, Not A Proprietary Feature

If Anthropic implements ABDS but OpenAI does not, developers face fragmentation: they must implement different billing delegation flows for each provider their app might use. This defeats much of the purpose.

ABDS must be an open, cross-provider standard — similar to OAuth 2.0 itself — so that:

- Developers implement the standard once
- Users have consistent consent and control UX across all AI providers
- Competition among providers focuses on model quality and subscription value, not billing model lock-in

The governance model for ABDS should follow OAuth 2.0's path: an initial open proposal, community refinement, and eventual adoption as an IETF or industry working group standard.

## Conclusion

ABDS is not a niche developer request. It is a missing infrastructure layer that is currently suppressing an entire category of software — consumer AI applications. The solution exists in proven form (OAuth 2.0), the economic model is net positive for providers, and the first mover gains a decisive ecosystem advantage. The only question is which provider moves first.
