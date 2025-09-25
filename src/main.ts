import Fastify from "fastify";
import { Routes } from "./controller/routes.js";

const fastify = Fastify({
  logger: true,
});

Routes.register(fastify);

fastify.listen({ port: 3000 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${addr}`);
});
