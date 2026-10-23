import type { Content } from "@google/genai";
import { gemini } from "../ai/gemini/gemini.client";
import { executeTool } from "../tools/tools.executor";
import { toolRegistry } from "../tools/tools.registry";

async function main() {
  const model = "gemini-3.5-flash-lite";
  const message = "Where is ORD-999?";

  const config = {
    tools: [
      {
        functionDeclarations: Object.values(toolRegistry).map(
          (tool) => tool.declaration,
        ),
      },
    ],
  };

  // 1. Initial conversation
  const contents: Content[] = [
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  // 2. Ask Gemini
  const response = await gemini.models.generateContent({
    model,
    contents,
    config,
  });

  const calls = response.functionCalls ?? [];

  if (calls.length === 0) {
    console.log("Gemini:", response.text);
    return;
  }

  const modelContent = response.candidates?.[0]?.content;

  if (!modelContent) {
    throw new Error("Missing model response content");
  }

  // 3. Preserve Gemini's function-call message
  contents.push(modelContent);

  // 4. Execute requested tools
  const toolResults = [];

  for (const call of calls) {
    if (!call.name) {
      throw new Error("Missing tool name");
    }

    const result = await executeTool(call.name, call.args);

    console.log("Executed:", call.name);
    console.log("Result:", result);

    toolResults.push({
      functionResponse: {
        name: call.name,
        id: call.id,
        response: { output: result },
      },
    });
  }

  // 5. Append tool results to conversation
  contents.push({
    role: "user",
    parts: toolResults,
  });

  // 6. Send results back to Gemini
  const finalResponse = await gemini.models.generateContent({
    model,
    contents,
    config: {
      ...config,
      systemInstruction:
        "Answer only using the provided tool results. " +
        "Do not invent shipment details or delivery dates.",
    },
  });

  if (finalResponse.functionCalls?.length) {
    console.log("Additional tool calls requested. Stopping demo.");
    return;
  }

  console.log("Final answer:", finalResponse.text);
}

main().catch(console.error);
