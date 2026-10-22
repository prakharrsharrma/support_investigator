import { FastifyInstance } from "fastify";
import HealthController from "./health.controller";

export async function healtRoutes(app: FastifyInstance) {
  const healthController = new HealthController();
  app.get("/", healthController.getHealth);
}
