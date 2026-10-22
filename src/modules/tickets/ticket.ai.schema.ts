import z from "zod";

export const ticketAnalysisSchema = z.object({
  issueType: z.string().min(1),
  orderId: z.string().min(1).nullable(),
  summary: z.string().min(1),
  customerIntent: z.string().min(1),
  missingInformation: z.array(z.string()),
  suggestedReply: z.string().min(1),
});
