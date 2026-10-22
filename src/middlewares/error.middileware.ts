import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  const statusCode =
    error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

  return reply.code(statusCode).send({
    message: statusCode >= 500 ? "Internal Server Error" : error.message,
  });
}
