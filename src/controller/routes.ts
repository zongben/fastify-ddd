import { type FastifyInstance } from "fastify";
import { makeUserRoutes } from "./user.controller.js";
import { AuthController, makeAuthRoutes } from "./auth.controller.js";
import { Container } from "./di.js";

const anonymousRoutes =
  (deps: { auth: AuthController }) => (fastify: FastifyInstance) => {
    const { auth } = deps;
    makeAuthRoutes(auth)(fastify);
  };

const jwtAuthRoutes = () => (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", async (req) => {
    await req.jwtVerify();
  });
  makeUserRoutes()(fastify);
};

export const registerRoutes =
  (deps: { container: Container }) => (fastify: FastifyInstance) => {
    const { container } = deps;

    fastify.register(
      anonymousRoutes({
        auth: container.authController,
      }),
    );
    fastify.register(jwtAuthRoutes());
  };
