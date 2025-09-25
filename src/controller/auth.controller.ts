import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "./base.controller.js";

export class AuthController extends BaseController {
  #login = async (_req: FastifyRequest, _reply: FastifyReply) => {
    return {
      hello: "world",
    };
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", this.#login);
  }
}
