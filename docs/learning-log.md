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
