import Fastify from "fastify";
import { Routes } from "./controller/routes";
import fastifyEnv from "@fastify/env";
import type { Env } from "./controller/env";
import mongodb from "@fastify/mongodb";
import { ServiceFactory } from "./application/service.factory";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { initMongoIndexes } from "./infra/schema/collections";

async function bootstrap() {
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
        NODE_ENV: {
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

  fastify.after(async () => {
    initMongoIndexes(fastify);
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
      routes.jwtAuthRoutes(instance);
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
}

bootstrap();
