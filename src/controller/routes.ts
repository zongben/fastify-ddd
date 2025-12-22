import { type FastifyInstance } from "fastify";
import { makeUserRoutes, UserController } from "./user.controller.js";
import { AuthController, makeAuthRoutes } from "./auth.controller.js";
import { Container } from "./di.js";

const anonymousRoutes =
  (deps: { auth: AuthController }) => (fastify: FastifyInstance) => {
    const { auth } = deps;
    makeAuthRoutes(auth)(fastify);
  };

const jwtAuthRoutes =
  (deps: { user: UserController }) => (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (req) => {
      await req.jwtVerify();
    });
    const { user } = deps;
    makeUserRoutes(user)(fastify);
  };

export const registerRoutes =
  (deps: { container: Container }) => (fastify: FastifyInstance) => {
    const { container } = deps;

    fastify.register(
      anonymousRoutes({
        auth: container.get("AuthController"),
      }),
    );
    fastify.register(
      jwtAuthRoutes({
        user: container.get("UserController"),
      }),
    );
  };
