import { type FastifyInstance } from "fastify";
import { makeUserRoutes } from "./user.controller.js";
import { makeAuthRoutes } from "./auth.controller.js";
import { UseCaseContext } from "../application/use-cases/use-case.context.js";

const anonymousRoutes =
  (deps: { ctx: UseCaseContext }) => (fastify: FastifyInstance) => {
    const { ctx } = deps;
    makeAuthRoutes({ uc: ctx.auth })(fastify);
  };

const jwtAuthRoutes = () => (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", async (req) => {
    await req.jwtVerify();
  });
  makeUserRoutes()(fastify);
};

export const registerRoutes =
  (deps: { ctx: UseCaseContext }) => (fastify: FastifyInstance) => {
    fastify.register(anonymousRoutes(deps));
    fastify.register(jwtAuthRoutes());
  };
