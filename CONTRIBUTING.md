# Contributing to ABDS

This proposal needs community input to become a standard. There are several ways to contribute depending on your background.

## Ways to Contribute

### Share Your Story (Most Important Right Now)

Open an Issue titled **"My use case: [app name]"** and describe:
- What app you built or tried to build
- How the current billing model affected your decision
- What ABDS would have changed for you

A collection of real use cases is the strongest possible argument to present to AI providers. If 200 developers document the same problem, it becomes impossible to dismiss.

### Improve the Technical Specification

The [SPEC.md](SPEC.md) is a draft and needs rigorous review. Specific areas needing input:

- Token refresh flow (not yet specified)
- Handling of multi-model subscriptions (e.g. a user subscribed to a bundle)
- B2B variant — where an organization delegates quota to employee apps
- Security review of the consent screen requirements
- Edge cases in quota accounting (concurrent requests, partial failures)

Submit improvements as Pull Requests against `SPEC.md`.

### Build a Reference Implementation

The most powerful contribution would be a mock implementation showing:
- A sample AI provider authorization server with ABDS endpoints
- A sample Consumer Application implementing the full flow
- Test cases covering quota exhaustion, revocation, and error states

This makes the standard concrete and reviewable rather than theoretical.

### Spread the Proposal

- Star this repository (signals demand to AI companies monitoring GitHub)
- Share on Hacker News, Reddit (r/MachineLearning, r/LocalLLaMA), X/Twitter
- Tag @AnthropicAI, @OpenAI, @GoogleDeepMind in posts about ABDS
- Reference this repo in discussions about AI developer ecosystem gaps

### AI Agent Contributions

See [AI_CONTRIBUTIONS/README.md](AI_CONTRIBUTIONS/README.md) for how AI systems can contribute analysis, critiques, and implementation suggestions.

## Code of Conduct

This is a technical standards proposal. Contributions should be substantive, specific, and constructive. Personal attacks, spam, and off-topic discussion will be removed.

## Governance

Currently maintained by [@MJohnstonAI](https://github.com/MJohnstonAI). As the proposal gains traction, governance will move toward a working group model with representatives from multiple stakeholders.
