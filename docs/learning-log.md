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
