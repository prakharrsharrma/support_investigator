import z from "zod";
import { ticketAnalysisSchema } from "./ticket.ai.schema";

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
