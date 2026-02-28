import Fastify, { FastifyError } from "fastify";
import fastifyEnv from "@fastify/env";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { registerApiRoutes } from "./controller/routes.js";
import { replyHttpPlugin } from "./shared/reply.extend.js";
import { Env } from "./infra/env.js";
import { Err } from "./contract/responses.js";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { initContainer } from "./controller/container.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(fastifyEnv, {
  schema: {
    type: "object",
    required: ["DATABASE_URL", "JWT_KEY"],
    properties: {
      DATABASE_URL: {
        type: "string",
      },
      JWT_KEY: {
        type: "string",
      },
    },
  },
  dotenv: {
    path: `${__dirname}/.env`,
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

await fastify.register(jwt, {
  secret: env.JWT_KEY,
  sign: {
    expiresIn: "30d",
  },
});

await fastify.register(fastifyAwilixPlugin);

initContainer({
  url: env.DATABASE_URL,
  jwt: fastify.jwt,
});

await fastify.register(replyHttpPlugin);

fastify.setErrorHandler((err: FastifyError, _, reply) => {
  const statusCode = err.statusCode ?? 500;

  if (statusCode >= 500) {
    fastify.log.error(err);
    return reply.status(statusCode).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    } satisfies Err);
  }

  return reply.status(statusCode).send({
    code: err.code,
    message: err.message,
  } satisfies Err);
});

fastify.setNotFoundHandler((_, reply) => {
  return reply.status(404).send({
    code: "NOT_FOUND",
    message: "Not Found",
  } satisfies Err);
});

await fastify.register(registerApiRoutes, { prefix: "/api" });

fastify.listen({ port: 3000 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${addr}`);
  fastify.log.info(`swagger-ui on ${addr}/docs`);
});
