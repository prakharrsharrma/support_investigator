# Support Ticket Investigator

A learning-focused backend project exploring **Generative AI, tool calling, and agentic AI** using Node.js, TypeScript, and Fastify.

The goal is to build an AI-powered support ticket investigator incrementally while understanding the underlying concepts rather than relying on AI frameworks to handle everything.

## What Does It Do?

Imagine a customer submits the following ticket:

> My order ORD-123 hasn't arrived yet. Can I get a refund?

The application will eventually be capable of:

1. Understanding and classifying the customer's issue.
2. Extracting relevant details, such as the order ID.
3. Investigating order, shipment, and policy information.
4. Identifying missing information.
5. Recommending a resolution based on available evidence.
6. Drafting a customer-facing response.

**The application will not automatically issue refunds.** Consequential actions will require approval.

## Tech Stack

- Node.js
- TypeScript
- Fastify
- JSON Schema for request validation
- LLM provider: To be decided (OpenAI / Ollama)

## Learning Roadmap

### V1 — Generative AI

**Status: In Progress**

Learn how to integrate an LLM into a backend application.

- [x] Set up Fastify server.
- [x] Implement health-check endpoint.
- [x] Define support ticket input schema.
- [x] Validate incoming ticket requests.
- [ ] Select and integrate an LLM provider.
- [ ] Extract structured information from tickets.
- [ ] Classify support issues.
- [ ] Generate ticket summaries.
- [ ] Draft customer responses.
- [ ] Validate structured LLM outputs.
- [ ] Handle missing information without inventing details.

### V2 — Tool Calling

**Status: Planned**

Learn how LLMs interact with backend functions.

Planned tools:

- `getOrder()`
- `getShipment()`
- `searchPolicy()`
- `checkIncidents()`

The LLM requests tool execution, but the backend remains responsible for validation, authorization, and execution.

### V3 — Agentic Investigation

**Status: Planned**

Introduce a bounded investigation loop where the LLM can:

- Decide which information to retrieve next.
- Use results from previous tool calls.
- Identify missing information.
- Recommend a resolution supported by evidence.

### V4 — Reliability and Evaluation

**Status: Planned**

- Evaluation cases.
- Execution traces.
- Latency and token usage tracking.
- Error handling and timeouts.
- Safeguards against prompt injection.
- Approval before consequential actions.

## Architecture

The architecture will evolve as new concepts are introduced.

Initially, the application will follow a simple flow:

```text
Customer Ticket
      |
      v
Fastify API
      |
      v
Request Validation
      |
      v
LLM Integration (Upcoming)
      |
      v
Structured Analysis (Upcoming)
```

Potential future improvement: a provider-independent LLM interface using **Adapter and Factory patterns**, allowing different LLM implementations without coupling application logic to a specific provider.

This design has been discussed but is not yet implemented.

## Development Approach

This project follows an incremental, learning-first approach:

1. Understand a concept.
2. Implement the smallest working version.
3. Test the behavior.
4. Document the design decisions.
5. Commit progress to GitHub.
6. Move to the next concept.

No agent orchestration framework, vector database, or multi-agent architecture is required initially.

## Current State

The Fastify server and basic ticket request validation are working.

**Next milestone:** Integrate the first LLM provider and generate schema-validated support ticket analysis.

## Learning Log

| Milestone                   | Learning                                                            |
| --------------------------- | ------------------------------------------------------------------- |
| Fastify setup               | Server initialization and health checks                             |
| Ticket input validation     | Defining and validating API request contracts                       |
| LLM architecture discussion | Understanding provider abstraction and the Adapter/Factory patterns |
| First LLM integration       | Upcoming                                                            |

---

_This project is being developed incrementally to document practical learning in Generative AI and agentic systems._
