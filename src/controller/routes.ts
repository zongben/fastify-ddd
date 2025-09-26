import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";
import { ServiceFactory } from "../appLayer/service.factory.js";

export class Routes {
  private constructor(private serviceFactory: ServiceFactory) {}

  #registerAuthRoutes(fastify: FastifyInstance) {
    const authController = new AuthController(this.serviceFactory);
    fastify.register(authController.plugin, { prefix: "/auth" });
  }

  anonymousRoutes(fastify: FastifyInstance) {
    this.#registerAuthRoutes(fastify);
  }

  static create(serviceFactory: ServiceFactory) {
    return new Routes(serviceFactory);
  }
}
