import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";
import {
  ticketInvestigationValidationSchema,
  ticketValidationSchema,
} from "./ticket.schema";
import TicketsController from "./tickets.controller";
import TicketsService from "./tickets.service";

export async function ticketsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  const ticketsService = new TicketsService();
  const ticketsController = new TicketsController(ticketsService);

  router.post(
    "/analyse",
    { schema: ticketValidationSchema },
    ticketsController.analyzeTicket.bind(ticketsController),
  );

  router.post(
    "/investigate",
    { schema: ticketInvestigationValidationSchema },
    ticketsController.investigate.bind(ticketsController),
  );
}
