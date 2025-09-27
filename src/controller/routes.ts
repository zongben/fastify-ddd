import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";
import type { ServiceFactory } from "../application/service.factory.js";

export class Routes {
  private constructor(private serviceFactory: ServiceFactory) {}

  #authRoutes(fastify: FastifyInstance) {
    const authController = new AuthController(this.serviceFactory, fastify.jwt);
    fastify.register(authController.plugin, { prefix: "/auth" });
  }

  anonymousRoutes(fastify: FastifyInstance) {
    this.#authRoutes(fastify);
  }

  static create(serviceFactory: ServiceFactory) {
    return new Routes(serviceFactory);
  }
}
