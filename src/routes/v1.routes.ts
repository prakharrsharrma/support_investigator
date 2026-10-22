import { FastifyInstance } from "fastify";
import { healtRoutes } from "../modules/health/health.routes";

export async function v1Routes(app: FastifyInstance) {
  app.register(healtRoutes, { prefix: "/health" });
}
