import { FastifyInstance } from "fastify";
import { healthRoutes } from "../modules/health/health.routes";
import { ticketsRoutes } from "../modules/tickets/tickets.routes";

export async function v1Routes(app: FastifyInstance) {
  app.register(healthRoutes, { prefix: "/health" });
  app.register(ticketsRoutes, { prefix: "/tickets" });
}
