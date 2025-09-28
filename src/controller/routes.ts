import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import type { ServiceFactory } from "../application/service.factory";
import { UserController } from "./user.controller";

export class Routes {
  private constructor(private serviceFactory: ServiceFactory) {}

  #authRoutes(fastify: FastifyInstance) {
    const authController = new AuthController(this.serviceFactory, fastify.jwt);
    fastify.register(authController.plugin, { prefix: "/auth" });
  }

  #userRoutes(fastify: FastifyInstance) {
    const userController = new UserController();
    fastify.register(userController.plugin, { prefix: "/user" });
  }

  anonymousRoutes(fastify: FastifyInstance) {
    fastify.register(async (instance) => {
      this.#authRoutes(instance);
    });
  }

  jwtAuthRoutes(fastify: FastifyInstance) {
    fastify.register(async (instance) => {
      instance.addHook("onRequest", async (req, reply) => {
        try {
          await req.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      });
      this.#userRoutes(instance);
    });
  }

  static create(serviceFactory: ServiceFactory) {
    return new Routes(serviceFactory);
  }
}
