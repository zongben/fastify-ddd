import type { FastifyInstance, FastifyRequest } from "fastify";
import { BaseController } from "./base.controller.js";

export class UserController extends BaseController {
  #getUser = async (req: FastifyRequest) => {
    const a = req.user;
    console.log(a);
    return "test";
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.get("/", this.#getUser);
  }
}
