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
