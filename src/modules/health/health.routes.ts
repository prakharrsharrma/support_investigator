import { FastifyInstance } from "fastify";
import HealthController from "./health.controller";

export async function healthRoutes(app: FastifyInstance) {
  const healthController = new HealthController();
  app.get("/", healthController.getHealth);
}
