import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "./base.controller.js";
import type { ServiceFactory } from "../application/service.factory.js";
import { registerSchema } from "../contract/auth/register.js";

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

  #register = async (req: FastifyRequest, reply: FastifyReply) => {
    const { account, password, username } = req.body;

    const service = this.serviceFactory.createRegisterService();
    // service.handle({
    //   account
    // });
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", this.#login);
    fastify.post("/register", { schema: registerSchema }, this.#register);
  }
}
