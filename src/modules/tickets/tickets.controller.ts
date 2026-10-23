import { FastifyReply, FastifyRequest } from "fastify";
import { TAnalyseTicketRequest } from "./ticket.schema";
import TicketsService from "./tickets.service";

export default class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  async analyzeTicket(
    request: FastifyRequest<{ Body: TAnalyseTicketRequest }>,
    reply: FastifyReply,
  ) {
    const { ticketId, message } = request.body;

    try {
      const analysis = await this.ticketsService.analyseTicket(message);

      return reply.code(200).send({
        ticketId,
        analysis,
      });
    } catch (error) {
      request.log.error({ err: error }, "Ticket analysis failed");

      return reply.code(502).send({
        error: "Ticket analysis service unavailable",
      });
    }
  }

  async investigate(
    request: FastifyRequest<{ Body: TAnalyseTicketRequest }>,
    reply: FastifyReply,
  ) {
    const { ticketId, message } = request.body;

    try {
      const investigation =
        await this.ticketsService.investigateTicket(message);

      return reply.code(200).send({
        ticketId,
        investigation,
      });
    } catch (error) {
      request.log.error({ err: error }, "Ticket investigation failed");

      return reply.code(502).send({
        error: "Ticket investigation service unavailable",
      });
    }
  }
}
