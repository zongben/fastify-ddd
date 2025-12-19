import { type FastifyInstance } from "fastify";
import { makeUserRoutes } from "./user.controller.js";
import { makeAuthRoutes } from "./auth.controller.js";
import { UseCases } from "./di.js";

const anonymousRoutes =
  (deps: { uc: UseCases }) => (fastify: FastifyInstance) => {
    const { uc } = deps;
    makeAuthRoutes({ uc: uc.auth })(fastify);
  };

const jwtAuthRoutes = () => (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", async (req) => {
    await req.jwtVerify();
  });
  makeUserRoutes()(fastify);
};

export const registerRoutes =
  (deps: { uc: UseCases }) => (fastify: FastifyInstance) => {
    fastify.register(anonymousRoutes(deps));
    fastify.register(jwtAuthRoutes());
  };
