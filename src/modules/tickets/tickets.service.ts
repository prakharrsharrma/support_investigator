import { Content, GenerateContentParameters } from "@google/genai";
import z from "zod";
import { gemini } from "../../ai/gemini/gemini.client";
import { executeTool } from "../../tools/tools.executor";
import { toolRegistry } from "../../tools/tools.registry";
import { ticketAnalysisSchema } from "./ticket.schema";
import { investigationInstructions } from "./tickets.prompts";

export default class TicketsService {
  async analyseTicket(message: string) {
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        Analyze the following customer support ticket.

        Extract the issue type, order ID, customer intent,
        and summarize the complaint.

        List only information essential for the next step.
        Draft a polite customer response.

        Do not invent missing details.
        Do not claim any investigation has been performed.
        Do not promise refunds or resolutions.

        Customer ticket:
        ${message}
        `,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(ticketAnalysisSchema),
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return ticketAnalysisSchema.parse(JSON.parse(response.text));
  }

  // ----- Investigation Service -----
  async investigateTicket(message: string) {
    const model = "gemini-3.5-flash-lite";

    const contents: Content[] = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const llmConfig: GenerateContentParameters["config"] = {
      tools: [
        {
          functionDeclarations: Object.values(toolRegistry).map(
            (tool) => tool.declaration,
          ),
        },
      ],
      systemInstruction: investigationInstructions,
    };

    const llmResponse = await gemini.models.generateContent({
      model,
      contents,
      config: llmConfig,
    });

    const toolCalls = llmResponse.functionCalls ?? [];

    if (toolCalls.length === 0) {
      console.log("Gemini:", llmResponse.text);
      return;
    }

    const modelContent = llmResponse.candidates?.[0]?.content;

    if (!modelContent) {
      throw new Error("Missing model response content");
    }

    // llm's response added to convo
    contents.push(modelContent);

    const toolResults = [];

    for (const call of toolCalls) {
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

    // BE tool call results added to the convo
    contents.push({
      role: "user",
      parts: toolResults,
    });

    const finalResponse = await gemini.models.generateContent({
      model,
      contents,
      config: {
        ...llmConfig,
        systemInstruction:
          "Answer only using the provided tool results. " +
          "Do not invent shipment details or delivery dates.",
      },
    });

    if (finalResponse.functionCalls?.length) {
      console.log("Additional tool calls requested. Stopping demo.");
      return;
    }

    return finalResponse.text;
  }
}
