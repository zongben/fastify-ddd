import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "./base.controller.js";
import type { ServiceFactory } from "../appLayer/service.factory.js";

export class AuthController extends BaseController {
  constructor(private serviceFactory: ServiceFactory) {
    super();
  }

  #login = async (_req: FastifyRequest, _reply: FastifyReply) => {
    const service = this.serviceFactory.createLoginService();
    service.handle("test");
    return {
      hello: "world",
    };
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", this.#login);
  }
}
