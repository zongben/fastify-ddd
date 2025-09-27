import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BaseController, Reply } from "./base.controller.js";
import type { ServiceFactory } from "../application/service.factory.js";
import { RegisterSchema } from "../contract/auth/register.js";
import type {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/base.contract.js";

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
    reply: FastifyReplyTypeBox<typeof RegisterSchema>,
  ) => {
    const { account, password, username } = req.body;

    const service = this.serviceFactory.createRegisterService();
    const result = await service.handle({
      account,
      password,
      username,
    });

    if (result.isSuccess) {
      const { id, account } = result.data;
      return Reply.OK(reply, {
        id,
        account,
      });
    }

    return Reply.Conflict(reply, result.code);
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", this.#login);
    fastify.post("/register", { schema: RegisterSchema }, this.#register);
  }
}
