import Fastify from "fastify";
import { Routes } from "./controller/routes.js";
import { ServiceFactory } from "./appLayer/service.factory.js";

const fastify = Fastify({
  logger: true,
});

const serviceFactory = new ServiceFactory();
Routes.register(fastify, serviceFactory);

fastify.listen({ port: 3000 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${addr}`);
});
