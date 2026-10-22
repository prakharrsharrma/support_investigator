import { FastifyInstance } from "fastify";
import TicketsController from "./tickets.controller";
import { ticketValidationSchema } from "./ticket.schema";
import { ZodTypeProvider } from "@fastify/type-provider-zod";

export async function ticketsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();
  const ticketsController = new TicketsController();

  router.post(
    "/analyse",
    { schema: ticketValidationSchema },
    ticketsController.analyzeTicket,
  );
}
