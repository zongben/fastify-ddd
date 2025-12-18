import Fastify, { FastifyError } from "fastify";
import fastifyEnv from "@fastify/env";
import type { Env } from "./controller/env.js";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { makeRepositoryContext } from "./infra/repository.context.js";
import { registerRoutes } from "./controller/routes.js";
import { replyHttpPlugin } from "./shared/reply.extend.js";
import { makeUseCaseContext } from "./application/use-cases/use-case.context.js";
import { makeTokenService } from "./services/index.js";
import { makePrisma } from "./shared/prisma.js";

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

fastify.register(jwt, {
  secret: env.JWT_KEY,
  sign: {
    expiresIn: "30d",
  },
});

fastify.register(replyHttpPlugin);

fastify.setErrorHandler((err: FastifyError, _, reply) => {
  reply.status(err.statusCode ?? 500).send({
    code: err.code,
    message: err.message,
  });
});

fastify.register(
  (instance) => {
    const ctx = makeUseCaseContext({
      repoCtx: makeRepositoryContext({ db: makePrisma(env.DATABASE_URL) }),
      tokenService: makeTokenService(instance.jwt),
    });
    registerRoutes({ ctx })(instance);
  },
  { prefix: "/api" },
);

fastify.listen({ port: 3000 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${addr}`);
  fastify.log.info(`swagger-ui on ${addr}/docs`);
});
