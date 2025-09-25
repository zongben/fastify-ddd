import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";
import { ServiceFactory } from "../appLayer/service.factory.js";

export class Routes {
  private constructor(
    private fastify: FastifyInstance,
    private serviceFactory: ServiceFactory,
  ) {}

  #authRoutes() {
    const authController = new AuthController(this.serviceFactory);
    this.fastify.register(authController.plugin, {
      prefix: "/auth",
    });
  }

  static register(fastify: FastifyInstance, serviceFactory: ServiceFactory) {
    const routes = new Routes(fastify, serviceFactory);
    routes.#authRoutes();
  }
}
