import { type FastifyInstance } from "fastify";
import { makeUserRoutes } from "./user.controller.js";
import { ServiceContext } from "../application/service.context.js";
import { makeAuthRoutes } from "./auth.controller.js";

const anonymousRoutes =
  (deps: { ctx: ServiceContext }) => (fastify: FastifyInstance) => {
    const { ctx } = deps;
    fastify.register((instance) => {
      makeAuthRoutes({ ctx: ctx.auth })(instance);
    });
  };

const jwtAuthRoutes = () => (fastify: FastifyInstance) => {
  fastify.register((instance) => {
    instance.addHook("onRequest", async (req, reply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });
    makeUserRoutes()(instance);
  });
};

export const registerRoutes =
  (deps: { ctx: ServiceContext }) => (fastify: FastifyInstance) => {
    anonymousRoutes(deps)(fastify);
    jwtAuthRoutes()(fastify);
  };
