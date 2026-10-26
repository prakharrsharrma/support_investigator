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

const analyseTicketResponseSchema = z.object({
  ticketId: z.string().min(1),
  analysis: ticketAnalysisSchema,
});

const analyseTicketRequestSchema = z.object({
  ticketId: z.string("Please provide the ticket ID!").min(1),
  message: z.string("Message is required!").min(3),
});

export type TAnalyseTicketRequest = z.infer<typeof analyseTicketRequestSchema>;
export type TAnalyseTicketResponse = z.infer<
  typeof analyseTicketResponseSchema
>;

export const ticketValidationSchema = {
  body: analyseTicketRequestSchema,
  response: {
    200: analyseTicketResponseSchema,
  },
};

// Investigation

const investigateTicketRequestSchema = z.object({
  ticketId: z.string("Please provide the ticket ID!").min(1),
  message: z.string("Message is required!").min(3),
});

export const investigationFindingsSchema = z
  .object({
    findings: z.array(
      z.object({
        statement: z.string(),
        source: z.enum(["getOrder", "getShipment", "searchPolicy"]),
        referenceId: z.string(),
      }),
    ),
    missingInformation: z.array(z.string()),
    refundEligibility: z.enum(["eligible", "ineligible", "undetermined"]),
    recommendedNextAction: z.string(),
  })
  .strict();

export const investigationResponseSchema = z.discriminatedUnion("reason", [
  investigationFindingsSchema.extend({
    ticketId: z.string(),
    status: z.literal("completed"),
    reason: z.literal("model_finished"),
  }),

  investigationFindingsSchema.extend({
    ticketId: z.string(),
    status: z.literal("incomplete"),
    reason: z.literal("step_limit"),
  }),

  z
    .object({
      ticketId: z.string(),
      status: z.literal("incomplete"),
      reason: z.literal("timeout"),
      message: z.string(),
    })
    .strict(),
]);

export const ticketInvestigationValidationSchema = {
  body: investigateTicketRequestSchema,
  response: {
    200: investigationResponseSchema,
  },
};

export type InvestigationFindings = z.infer<typeof investigationFindingsSchema>;
export type InvestigationFindingsResponse = z.infer<
  typeof investigationResponseSchema
>;
