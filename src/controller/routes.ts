import { type FastifyInstance } from "fastify";
import { makeUserRoutes } from "./user.controller.js";
import { makeAuthRoutes } from "./auth.controller.js";

const anonymousRoutes = (fastify: FastifyInstance) => {
  makeAuthRoutes(fastify);
};

const jwtAuthRoutes = (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", async (req) => {
    await req.jwtVerify();
  });
  makeUserRoutes(fastify);
};

export const registerApiRoutes = (fastify: FastifyInstance) => {
  fastify.register(anonymousRoutes);
  fastify.register(jwtAuthRoutes);
};
