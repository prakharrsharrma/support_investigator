import z from "zod";
import {
  InvestigationResultReason,
  InvestigationResultStatus,
} from "./tickets.types";

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

const investigateTicketResponseSchema = z.object({
  ticketId: z.string().min(1),
  investigation: z.string().min(1),
  status: z.enum(InvestigationResultStatus),
  reason: z.enum(InvestigationResultReason),
});

export const ticketInvestigationValidationSchema = {
  body: investigateTicketRequestSchema,
  response: {
    200: investigateTicketResponseSchema,
  },
};
