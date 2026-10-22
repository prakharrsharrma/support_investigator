import { z } from "zod";
import { gemini } from "../ai/gemini/gemini.client";
import { ticketAnalysisSchema } from "../modules/tickets/ticket.ai.schema";

async function main() {
  const ticket = "My package is delayed and I need help.";

  const response = await gemini.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `
      Analyze the following customer support ticket.

      Extract the issue type, order ID, customer intent,
      and summarize the complaint.

      List any missing information.
      Draft a polite customer response.

      Do not invent missing details or promise refunds.
      If no order ID exists, use null.

      Only report information explicitly provided in the ticket.

      Identify missing information required for the next
      investigation step, not every potentially useful detail.

      Do not claim that you have checked records,
      started an investigation, or performed any action.

      Do not promise refunds or resolutions.

      Customer ticket:
      ${ticket}
    `,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(ticketAnalysisSchema),
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  const analysis = ticketAnalysisSchema.parse(JSON.parse(response.text));

  console.log(analysis);
}

main().catch(console.error);
