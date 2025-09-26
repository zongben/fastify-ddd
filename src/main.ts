import Fastify from "fastify";
import { Routes } from "./controller/routes.js";
import fastifyEnv from "@fastify/env";
import type { Env } from "./controller/env.js";
import mongodb from "@fastify/mongodb";
import path from "path";
import { fileURLToPath } from "url";
import { ServiceFactory } from "./application/service.factory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyEnv, {
  schema: {
    type: "object",
    required: ["MONGO_URL"],
    properties: {
      MONGO_URL: {
        type: "string",
      },
    },
  },
  dotenv: {
    path: `${__dirname}/.env.example`,
  },
});

const env = fastify.getEnvs<Env>();

fastify.register(mongodb, {
  forceClose: true,
  url: env.MONGO_URL,
});

const serviceFactory = new ServiceFactory(fastify.mongo);
const routes = Routes.create(serviceFactory);

fastify.register(
  (instance) => {
    routes.anonymousRoutes(instance);
  },
  { prefix: "/api" },
);

fastify.listen({ port: 3000 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${addr}`);
});
