import z from "zod";

export const ticketAnalysisSchema = z.object({
  issueType: z.enum([
    "delivery_issue",
    "damaged_product",
    "refund_request",
    "other",
  ]),
  orderId: z.string().min(1).nullable(),
  summary: z.string().min(1),
  customerIntent: z.string().min(1),
  missingInformation: z.array(z.string()),
  suggestedReply: z.string().min(1),
});
