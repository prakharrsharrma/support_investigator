import { FastifyReply, FastifyRequest } from "fastify";

export default class TicketsController {
  async analyzeTicket(req: FastifyRequest, rep: FastifyReply) {
    return {
      ticketId: "TKT-001",
      analysis: {
        issueType: "delivery_issue",
        orderId: "ORD-123",
        summary:
          "Customer reports that order ORD-123 has not arrived after 10 days.",
        customerIntent: "request_refund",
        missingInformation: [],
        suggestedReply:
          "I'm sorry your order hasn't arrived. We'll need to verify the delivery status and refund eligibility before confirming a refund.",
      },
    };
  }
}
