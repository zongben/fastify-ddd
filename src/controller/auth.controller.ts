import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "./base.controller.js";
import type { ServiceFactory } from "../application/service.factory.js";
import { RegisterSchema } from "../contract/auth/register.js";
import type { FastifyRequestTypeBox } from "../contract/base.contract.js";

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

  #register = async (
    req: FastifyRequestTypeBox<typeof RegisterSchema>,
    reply: FastifyReply,
  ) => {
    const { account, password, username } = req.body;

    const service = this.serviceFactory.createRegisterService();
    const res = await service.handle({
      account,
      password,
      username,
    });

    if (res.isSuccess) {
    }
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", this.#login);
    fastify.post("/register", { schema: RegisterSchema }, this.#register);
  }
}
