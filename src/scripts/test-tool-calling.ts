import { gemini } from "../ai/gemini/gemini.client";
import { getOrderDeclaration } from "../tools/order/order.declaration";
import { executeTool } from "../tools/tools.executor";

async function main() {
  const response = await gemini.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: "Tell me the status of ORD-123.",
    config: {
      tools: [
        {
          functionDeclarations: [getOrderDeclaration],
        },
      ],
    },
  });

  const calls = response.functionCalls ?? [];

  for (const call of calls) {
    if (!call.name) {
      throw new Error("Missing tool name");
    }

    const result = await executeTool(call.name, call.args);

    console.log("Tool:", call.name);
    console.log("Result:", result);
  }
}

main().catch(console.error);
