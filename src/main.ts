import Fastify from "fastify";
import { Routes } from "./controller/routes.js";
import fastifyEnv from "@fastify/env";
import type { Env } from "./controller/env.js";
import mongodb from "@fastify/mongodb";
import path from "path";
import { fileURLToPath } from "url";
import { ServiceFactory } from "./application/service.factory.js";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(fastifyEnv, {
  schema: {
    type: "object",
    required: ["MONGO_URL", "JWT_KEY"],
    properties: {
      MONGO_URL: {
        type: "string",
      },
      JWT_KEY: {
        type: "string",
      },
    },
  },
  dotenv: {
    path: `${__dirname}/.env.example`,
  },
});

await fastify.register(swagger, {
  openapi: {
    info: {
      title: "fastify-ddd",
      description: "API documentation with Swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "local",
      },
    ],
  },
});

await fastify.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
  },
});

const env = fastify.getEnvs<Env>();

fastify.register(mongodb, {
  forceClose: true,
  url: env.MONGO_URL,
});

fastify.register(jwt, {
  secret: env.JWT_KEY,
  sign: {
    expiresIn: "30d",
  },
});

fastify.register(
  (instance) => {
    const serviceFactory = new ServiceFactory(fastify.mongo);
    const routes = Routes.create(serviceFactory);

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
