import { FastifyReply, FastifyRequest } from "fastify";

export default class HealthController {
  async getHealth(req: FastifyRequest, rep: FastifyReply) {
    return { success: true, message: "pong" };
  }
}
