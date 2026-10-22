import z from "zod";
import { gemini } from "../../ai/gemini/gemini.client";
import { ticketAnalysisSchema } from "./ticket.ai.schema";

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
}
