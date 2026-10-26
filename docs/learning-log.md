# Learning Log

## 01 — Structured Outputs and LLM Reliability

### Objective

Learn how to transform unstructured customer support tickets into predictable, validated JSON using an LLM.

### What I implemented

- Integrated Google's Gemini API using the official `@google/genai` SDK.
- Defined the expected AI response using Zod.
- Used JSON Schema to constrain the model's output.
- Validated generated responses using `ticketAnalysisSchema.parse()`.
- Tested different scenarios: delayed shipments, missing order IDs, and damaged products.

### Key learnings

**1. Structured output does not guarantee correctness**

Even when an LLM returns schema-valid JSON, the information can be inaccurate, unnecessary, or misleading.

**2. Schema constraints improve consistency**

Initially, Gemini generated inconsistent classifications such as `shipping delay` and `Damaged Product`.

Using `z.enum()` restricted classifications to predefined values such as `delivery_issue` and `damaged_product`.

**3. Prompt engineering significantly influences behavior**

Initially, the model requested unnecessary information and sometimes implied that an investigation had already started.

After refining the prompt, the model:

- Requested only essential missing information.
- Avoided claiming actions it hadn't performed.
- Produced more consistent classifications and customer replies.

**4. Missing data should never be invented**

When an order ID was absent, Gemini returned `null` and included `orderId` in `missingInformation`.

### Observations

The refined prompt produced:

```json
{
  "issueType": "delivery_issue",
  "orderId": null,
  "summary": "The customer's package is delayed and they are requesting help.",
  "customerIntent": "Get assistance regarding a delayed package",
  "missingInformation": ["orderId"],
  "suggestedReply": "Could you please provide your order ID so we can look into this for you?"
}
```

### Takeaway

**Reliable AI applications require more than successful LLM API calls.**

Schema validation improves structural reliability, while clear prompts and business-level checks help improve semantic accuracy.

Neither guarantees factual correctness. Additional testing and safeguards are necessary.

### Next Step

Integrate the Gemini analysis into the existing Fastify `POST /tickets/analyze` endpoint, replacing the hardcoded response.

## 02 — Integrating an LLM with Fastify

### Objective

Integrate Gemini into the existing Fastify API to analyze customer support tickets dynamically.

### What I implemented

- Created `ticket.service.ts` to handle LLM interactions.
- Connected the ticket controller to the analysis service.
- Replaced hardcoded responses with Gemini-generated analysis.
- Validated LLM output using Zod before returning it.
- Added basic error handling for failed LLM requests.

### Key Learnings

**1. Separation of concerns**

- Controller handles HTTP requests and responses.
- Service handles prompts, model interaction, and response validation.
- Gemini client manages SDK initialization.

**2. LLMs are external dependencies**

- Model requests can fail independently of the application.
- Backend errors should be logged without exposing sensitive provider details.

**3. Trust boundaries**

- LLM-generated responses should be treated as untrusted data.
- Schema validation ensures structural correctness, not factual accuracy.

**4. End-to-end GenAI workflow**

`HTTP Request → Fastify Validation → Ticket Service → Gemini → Zod Validation → HTTP Response`

### Outcome

Successfully built a working Fastify endpoint that accepts customer tickets and returns AI-generated, structured analysis.

### Next Learning Goal

Explore tool calling, allowing the LLM to request information from backend functions such as order and shipment lookups.

## 03 — Tool Calling and AI-Driven Ticket Investigation

### Objective

Understand how an LLM interacts with backend functions to retrieve real application data and produce evidence-based responses.

### What I implemented

- Created synthetic order data and a `getOrder()` lookup function.
- Defined Gemini function declarations describing available tools.
- Built a tool registry mapping declarations, Zod schemas, and implementations.
- Implemented a tool executor to validate arguments and dispatch function calls.
- Completed the function-calling cycle by returning tool results to Gemini.
- Integrated the workflow into Fastify through `POST /tickets/investigate`.

### Key Learnings

**1. Tool Calling vs Tool Execution**

- Gemini decides which tool to request and generates its arguments.
- The backend validates and executes the actual TypeScript function.
- An LLM cannot directly access our backend functions simply because we declare them.

**2. Tool Registry Pattern**

- Centralizes available tools, their schemas, and implementations.
- Avoids growing `switch` statements.
- Makes adding future tools like `getShipment()` and `searchPolicy()` easier.
- Provides an explicit allowlist of functions the LLM can request.

**3. Function Calling Lifecycle**

`User → Gemini → Function Call → Tool Executor → Backend Function → Tool Result → Gemini → Final Response`

- Gemini's initial response may contain a `functionCall` instead of text.
- Tool results are returned using `functionResponse`.
- Conversation history must be preserved across model requests.
- This is a single-round tool-calling workflow, not yet an autonomous agent loop.

**4. Separation of Concerns**

- Controller handles HTTP communication.
- Ticket service coordinates LLM interaction and tool execution.
- Tool executor validates arguments and dispatches functions.
- Individual tools contain business logic.

Separation of concerns is about responsibilities, not necessarily separate files.

**5. Tool Results Don't Guarantee Correct Reasoning**

During testing, Gemini correctly retrieved an order marked as `delivered` but incorrectly implied that an automatic refund could not be processed.

This revealed an important limitation:

- Retrieved data provides evidence, not necessarily a complete business decision.
- Order status alone cannot determine refund eligibility.
- Prompt improvements can reduce unsupported conclusions but cannot guarantee their elimination.
- Business decisions require additional evidence, explicit policies, and backend safeguards.

### Outcome

Successfully implemented an end-to-end, tool-enabled Fastify API that:

1. Accepts a customer support ticket.
2. Lets Gemini request an order lookup.
3. Validates and executes the requested backend function.
4. Returns the result to Gemini.
5. Generates an investigation response using retrieved order data.

### Current Limitations

- Only `getOrder()` is available.
- Investigation supports one round of tool execution.
- Refund eligibility cannot yet be determined.
- Customer-level authorization is not implemented.
- Responses are not yet constrained by a dedicated investigation output schema.

### Next Learning Goal

Introduce shipment and refund-policy lookups, enabling Gemini to investigate tickets using multiple sources of evidence before recommending a resolution.

## 04 — Building a Bounded Agentic Investigation Loop

### Objective

Move beyond single-round tool calling and build an agent capable of investigating support tickets across multiple steps, while keeping execution under backend control.

### What I Implemented

- Added `getShipment()` alongside the existing `getOrder()` tool.
- Extended the tool registry to support multiple tools with different argument schemas.
- Introduced a typed registration helper to preserve TypeScript safety.
- Refactored the investigation service into a multi-step agent loop.
- Implemented tool-round limits and natural termination.
- Added a separate final response generation phase.
- Introduced investigation status and termination reasons.
- Added an investigation deadline using `AbortSignal.timeout()`.

### Key Learnings

**1. Tool Calling vs Agentic Behavior**

Tool calling allows an LLM to request a backend function.

Agentic behavior emerges when the model repeatedly evaluates retrieved evidence and decides what action to take next.

Our agent demonstrated this by:

- Calling `getOrder("ORD-123")`.
- Discovering shipment ID `SHP-123`.
- Calling `getShipment("SHP-123")`.
- Combining both results into an investigation summary.

The backend controls the execution loop; the LLM selects the next tool.

**2. Understanding the Agent Loop**

The investigation follows this pattern:

`LLM → Tool Request → Backend Execution → Tool Result → LLM → Repeat or Finish`

Conversation history is preserved across iterations so the model can use previously retrieved evidence.

**3. Why Agents Need Stopping Conditions**

An LLM may continue requesting tools even when further investigation is unnecessary or impossible.

We introduced three safeguards:

- **Natural termination:** Stop when the model returns a final response without requesting tools.
- **Step limit:** Restrict the maximum number of tool-execution rounds.
- **Timeout:** Set an overall investigation deadline.

The initial limits are configuration choices, not experimentally optimized values.

**4. Step Limits and Final Response Generation**

Initially, the loop could execute a tool in its final iteration without allowing Gemini to interpret the result.

We improved this by separating the maximum tool-execution rounds from the final response generation.

This ensures that reaching the step limit does not automatically discard the evidence collected.

**5. An Unexpected Function-Calling Problem**

During testing, Gemini continued generating `getShipment()` function calls even when function calling was disabled in the final request.

We resolved the issue in our test by separating investigation from final report generation:

- Investigation retains the conversation history and tool access.
- Final reporting starts a fresh model request using only the original ticket and collected tool evidence.
- The reporting phase does not expose tools.

This taught me that model configuration alone should not be relied upon to enforce execution boundaries.

**6. Explicit Investigation Status**

An investigation that reaches its execution limit should not be presented as fully completed.

We introduced:

- `completed` — The model naturally finished.
- `incomplete` — Execution stopped because of a configured limit or timeout.

Termination reasons help explain why execution ended.

Importantly, a naturally completed agent loop does not guarantee that the underlying customer issue has been resolved.

**7. Timeouts and Cancellation**

Step limits control the number of iterations, but not execution duration.

Using `AbortSignal.timeout()` provides a shared deadline across the investigation.

Important distinctions:

- A deadline can prevent additional work from starting.
- Cancellation must be supported by the operation being executed.
- Aborting an API request does not necessarily stop processing on the provider's servers.

**8. Evidence-Based Reasoning Still Needs Validation**

During testing, Gemini interpreted an amount

## 05 — Structured Investigation Findings and Evidence Validation

### Objective

Improve the reliability of agent-generated investigations by introducing structured findings, evidence references, and backend validation.

### What I Implemented

- Added synthetic refund, delivery, and damage policies.
- Introduced `searchPolicy()` using category-based retrieval.
- Registered the new tool with Gemini.
- Defined a Zod schema for structured investigation findings.
- Separated agent investigation from final report generation.
- Implemented evidence-reference validation.
- Added unit tests and error handling for unsupported references.

### Key Learnings

**1. Retrieval-Augmented Generation (RAG)**

Our policy lookup introduced a simple form of retrieval-augmented generation.

The agent retrieves external policy information and uses it to support its conclusions.

RAG does not necessarily require embeddings or vector databases. Deterministic lookups, keyword searches, and databases can also provide retrieval.

**2. Structured Outputs vs Evidence Validation**

Structured outputs ensure that Gemini returns data matching our expected schema.

However, schema-valid JSON can still contain invented references.

We introduced deterministic validation to ensure every generated `{ source, referenceId }` pair corresponds to a record retrieved during the current investigation.

**3. Evidence References Don't Guarantee Factual Accuracy**

A reference can exist while the statement citing it remains incorrect.

There are two different problems:

- Reference validation: Was the cited record actually retrieved?
- Claim verification: Does the retrieved record support the generated statement?

We implemented reference validation. Claim verification remains future work.

**4. Fail-Closed Behavior**

Rather than silently removing unsupported findings, the backend rejects the investigation report when evidence validation fails.

During testing, we deliberately injected `POL-999`, an unsupported policy reference.

The validator rejected it, and the API returned a controlled error without exposing the invalid findings.

**5. Execution Status vs Business Resolution**

An investigation can finish successfully while refund eligibility remains undetermined.

For example:

- `status: completed`
- `reason: model_finished`
- `refundEligibility: undetermined`

Agent execution completion does not imply that the customer's issue has been resolved.

### Outcome

Implemented structured, schema-validated investigation reports with evidence references checked against actual tool execution results.

Added deterministic unit tests and verified that invalid evidence is rejected at the API boundary.

### Remaining Limitations

- Evidence validation checks reference existence, not claim correctness.
- Policy retrieval uses static category-based filtering.
- Unsupported evidence currently causes the report to fail without automatic recovery.
- Refund eligibility remains dependent on sufficient verified policy and order data.

---

## 06 — Agent Observability and Performance Tracing

### Objective

Understand how to observe agent execution, measure performance, and identify bottlenecks in a multi-step AI workflow.

### What I Implemented

- Created an `InvestigationTrace` interface.
- Recorded total investigation duration.
- Tracked the number and duration of Gemini requests.
- Recorded tool execution names and durations.
- Captured traces using a `finally` block, including failed investigations.
- Instrumented both investigation and structured-report generation.

### Key Learnings

**1. Logging, Tracing, and Evaluation Are Different**

- Logging explains what happened.
- Tracing captures execution steps and their durations.
- Evaluation measures whether the agent behaved correctly and produced accurate results.

We have implemented basic execution tracing. Formal evaluation is still pending.

**2. Instrumentation Must Cover Every Execution Path**

Our initial trace recorded three Gemini calls but missed the final reporting request.

The issue occurred because `generateFindings()` was called from two different termination paths, but only one was instrumented.

We fixed this by moving timing instrumentation into `generateFindings()` itself.

This reinforced an engineering principle: instrument operations close to where they execute.

**3. LLM Calls Are Our Primary Latency Bottleneck**

Our corrected trace recorded:

| Metric                       | Observed Value |
| ---------------------------- | -------------: |
| Total investigation duration |     112,097 ms |
| Gemini requests              |              4 |
| Combined Gemini latency      |     112,091 ms |
| Backend tool executions      |              3 |
| Combined tool execution time |           4 ms |

The observed latency came almost entirely from Gemini requests rather than our synthetic backend tools.

**4. Agentic Workflows Amplify Latency**

A multi-step investigation may require several sequential model requests.

Even if each request succeeds, their accumulated latency can make the API slow.

This introduces trade-offs between investigation depth, latency, token usage, and cost.

**5. Performance Data Needs Repeated Measurements**

Individual investigation runs showed substantial latency variation.

A single trace is useful for debugging but insufficient for making reliable performance claims.

Future measurements should include multiple runs, token usage, and latency percentiles.

### Outcome

Implemented basic application-level observability for the agent investigation workflow.

We can now identify executed tools, count model requests, measure their durations, and locate performance bottlenecks.

### Remaining Limitations

- Token usage and API costs are not yet tracked.
- Traces are logged locally rather than persisted.
- We haven't established p50/p95 latency benchmarks.
- No formal evaluation suite exists yet.
- Our current synchronous API can experience high response latency.

### Next Learning Goal

Introduce model token-usage tracking, followed by a small evaluation suite to measure investigation correctness, tool selection, evidence grounding, and failure handling.
