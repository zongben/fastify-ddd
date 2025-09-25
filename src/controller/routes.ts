import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller.js";

export class Routes {
  private constructor(private fastify: FastifyInstance) {}

  #authRoutes() {
    const authController = new AuthController();
    this.fastify.register(authController.plugin, {
      prefix: "/auth",
    });
  }

  static register(fastify: FastifyInstance) {
    const routes = new Routes(fastify);
    routes.#authRoutes();
  }
}
