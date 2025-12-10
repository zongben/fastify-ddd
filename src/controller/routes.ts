import { type FastifyInstance } from "fastify";
import { makeUserRoutes } from "./user.controller.js";
import { makeAuthRoutes } from "./auth.controller.js";
import { UseCaseContext } from "../application/use-cases/use-case.context.js";

const anonymousRoutes =
  (deps: { ctx: UseCaseContext }) => (fastify: FastifyInstance) => {
    const { ctx } = deps;
    fastify.register((instance) => {
      makeAuthRoutes({ uc: ctx.auth })(instance);
    });
  };

const jwtAuthRoutes = () => (fastify: FastifyInstance) => {
  fastify.register((instance) => {
    instance.addHook("onRequest", async (req, reply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.status(401).send(err);
      }
    });
    makeUserRoutes()(instance);
  });
};

export const registerRoutes =
  (deps: { ctx: UseCaseContext }) => (fastify: FastifyInstance) => {
    anonymousRoutes(deps)(fastify);
    jwtAuthRoutes()(fastify);
  };
