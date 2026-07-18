# ABDS OpenAI Build Week 2026 Submission Strategy

> Documentation-only competition plan reviewed against the official rules on 18 July 2026.

## Executive Verdict

ABDS has a strong and unusual idea, a credible technical foundation, and a polished standards brief. The repository in its current form is not yet a competitive Build Week submission because the challenge requires a working, consistently runnable project with a coherent product experience. A specification and slide deck alone would likely fail the functionality requirement and score poorly on technological implementation and design.

The best competition strategy is to keep ABDS as the protocol thesis and present a small working product that makes the thesis visible.

## Recommended Entry

### Track

**Developer Tools**

### Product

**ABDS Studio - a runnable sandbox for designing, simulating, and testing payer-neutral AI delegation**

### One-line pitch

> ABDS Studio lets developers simulate AI usage paid by a user, employer, sponsor, or provider - with explicit consent, hard budgets, short-lived grants, and a provider-authoritative ledger.

### Why this is the strongest framing

- It turns the existing standards work into a testable developer product.
- It makes the sponsor-funded idea the memorable differentiator.
- Judges can understand the complete flow in under three minutes.
- A mock provider is sufficient to demonstrate the protocol without implying that OpenAI or another provider already supports ABDS.
- It gives Codex and GPT-5.6 a visible role in implementation, test generation, threat-model evaluation, and protocol critique.

## What the Runnable Demonstration Should Show

The minimum coherent demonstration is one end-to-end NatureGuard scenario:

1. A sponsor creates a NatureGuard funding program with a total budget, per-user cap, allowed model class, and end date.
2. A user opens NatureGuard and sees provider-controlled consent explaining who pays and what the sponsor can see.
3. The user authorizes the grant.
4. NatureGuard performs a simulated AI request using a short-lived execution token.
5. The provider ledger debits the sponsor program, not the user or developer.
6. The user views usage and revokes the grant.
7. A final request demonstrates a hard stop after revocation or budget exhaustion.

The demo should use simulated AI units and a mock provider unless a real provider explicitly supports the required delegated billing flow. Do not present fabricated provider endpoints as real integrations.

## Three Presentation Options

### Option A - ABDS Studio

**Track:** Developer Tools  
**Recommendation:** Best option

Present ABDS as a protocol workbench with:

- sponsor, user, and provider views,
- consent-screen generator,
- grant and token inspector,
- live usage ledger,
- revocation and exhaustion tests,
- downloadable conformance report, and
- NatureGuard as the example Client.

This option aligns most directly with the repository and gives judges something concrete to test.

### Option B - Sponsored AI Gateway

**Track:** Work and Productivity

Present a control plane that lets a nonprofit, employer, or university fund approved AI tools for a community. The product experience centers on program creation, policy, aggregate reporting, and privacy-safe funding.

This has a clearer buyer but requires more administrative product surface. It is a good future commercial direction, but harder to finish convincingly within Build Week.

### Option C - NatureGuard

**Track:** Apps for Your Life

Present a consumer nature assistant where conservation sponsors fund public AI usage. ABDS becomes the invisible infrastructure behind the app.

This is emotionally legible and visually demonstrable, but judges may primarily evaluate the nature app and miss the infrastructure innovation. Choose it only if NatureGuard itself can be a polished, genuinely useful product.

## Judging-Criteria Strategy

| Criterion | What ABDS must demonstrate |
|---|---|
| **Technological Implementation** | A working, non-trivial grant lifecycle; policy enforcement; ledger updates; revocation; tests; clear Codex/GPT-5.6 contribution record. |
| **Design** | One coherent journey across sponsor setup, user consent, AI use, and user control. Avoid presenting disconnected admin dashboards. |
| **Potential Impact** | A specific claim: sponsor-funded AI can make useful applications accessible without shifting unpredictable inference costs to users or small developers. |
| **Quality of the Idea** | The payer, user, developer, and provider are separate roles; funding becomes an explicit, revocable protocol decision. |

## Three-Minute Demo Storyboard

### 0:00-0:20 - The problem

Show one sentence:

> Consumer AI usually forces the developer, the user, or an awkward credit system to pay.

Then introduce the fourth option:

> With ABDS, an authorized sponsor can fund bounded usage.

### 0:20-0:50 - Sponsor program

Create the Green Earth Foundation program:

- NatureGuard only,
- 10,000 total units,
- 100 units per user,
- economy text and vision models,
- no overage,
- aggregate reporting only.

### 0:50-1:20 - User consent

Open NatureGuard as a new user. Highlight:

- Sponsor identity,
- "You will not be charged,"
- exact allowance,
- sponsor data visibility,
- program end date, and
- revoke control.

### 1:20-1:55 - Funded execution

Authorize the grant and run one NatureGuard request. Show the request moving through:

```text
Grant -> short-lived token -> provider enforcement -> sponsor ledger
```

Show the user's personal allowance unchanged.

### 1:55-2:20 - Safety behavior

Revoke the grant or exhaust the per-user cap. Demonstrate a hard stop with no silent fallback charge.

### 2:20-2:45 - Why it matters

Show the payer-neutral model:

```text
User | Organization | Sponsor | Provider promotion
                    |
              ABDS grant
                    |
                 AI use
```

### 2:45-3:00 - Codex and GPT-5.6

Show the dated work added during Build Week:

- specification generalization,
- threat scenarios,
- generated tests,
- implementation and review iterations, and
- the `/feedback` Codex session ID.

## Suggested Devpost Description

### Inspiration

Consumer AI products face a structural billing problem. Small developers either absorb unpredictable inference costs, build their own credit system, or ask ordinary users to bring API keys. We asked a broader question: why must the user or developer always be the payer?

### What it does

ABDS Studio demonstrates a payer-neutral delegation protocol for AI usage. A user, employer, sponsor, provider promotion, or developer can fund a bounded grant. The AI provider remains the enforcement authority through provider-side grant records, short-lived execution tokens, a usage ledger, explicit consent, and immediate revocation.

The NatureGuard scenario shows a conservation foundation funding public use of an AI nature assistant. The user sees exactly who pays, what the limit is, and what information the sponsor can access. When funding ends, usage stops rather than silently charging another party.

### How it works

ABDS profiles modern OAuth patterns for metered AI resources. Structured authorization details describe model, operation, period, and cap. The provider creates a grant bound to the Client, Beneficiary, and funding source. Execution tokens reference the grant but never contain mutable quota state. The provider ledger is authoritative.

### How we used Codex and GPT-5.6

Use this section only after implementation and replace general statements with dated, verifiable examples. Link the relevant commit history and provide the required `/feedback` session ID.

### Challenges

The difficult part was separating identity, consent, funding authority, execution credentials, and usage accounting without leaking sponsor balances or user content. Sponsor funding also required a hard rule against silent payer substitution.

### Accomplishments

- Generalized ABDS from user-funded quota to payer-neutral delegation.
- Added a sponsored-funding profile and privacy model.
- Demonstrated the full lifecycle from sponsor policy to revocation.
- Kept mutable budget state out of execution tokens.
- Mapped the design to OAuth Rich Authorization Requests and current OAuth security guidance.

### What is next

Seek review from OAuth specialists, AI provider platform teams, API-security engineers, nonprofits, and developers building high-impact consumer applications.

## Repository Changes Needed Before Submission

The official rules allow an existing project only when it is meaningfully extended during the submission period, and only the new work is evaluated. The submission therefore needs:

- a working project added between 13 and 21 July 2026,
- dated commits distinguishing pre-existing material from Build Week additions,
- a README section documenting specific Codex and GPT-5.6 collaboration,
- setup and testing instructions,
- a free working demo, test account, or local sandbox,
- a public YouTube demo under three minutes,
- a repository judges can access,
- the `/feedback` Codex session ID where most core functionality was built, and
- no claims that an AI provider supports ABDS unless that integration is real and authorized.

## Current Asset Review

The existing 19-slide executive/technical deck is polished and technically serious, but it is too long and too architecture-heavy for the competition demo. It also predates the payer-neutral and sponsor-funded model.

For Build Week:

- use the existing deck as background material for technical reviewers,
- do not narrate it slide by slide in the video,
- create a six- or seven-frame demo story around NatureGuard,
- lead with the sponsor-funded outcome,
- show one architecture diagram at most, and
- end on the working product and measurable next step, not the standards roadmap.

## Official Sources

- [OpenAI Build Week overview](https://openai.com/build-week/)
- [OpenAI Build Week Devpost page](https://openai.devpost.com/)
- [OpenAI Build Week official rules](https://openai.devpost.com/rules)

The official deadline is 21 July 2026 at 5:00 PM Pacific Time, which is 2:00 AM South Africa Standard Time on 22 July 2026. The rules and Devpost page remain the controlling sources.
