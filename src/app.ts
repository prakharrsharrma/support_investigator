import fastify from "fastify";
import { errorHandler } from "./middlewares/error.middileware";
import { v1Routes } from "./routes/v1.routes";
import { PORT } from "./utils/constants";

const app = fastify({ logger: true });

app.setErrorHandler(errorHandler);

app.register(v1Routes, { prefix: "/api/v1" });

app.listen({ port: PORT }, () => {
  console.log("Server Started at ", PORT);
});
