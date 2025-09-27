import type { FastifyInstance } from "fastify";
import { BaseController, Reply } from "./base.controller.js";
import type { ServiceFactory } from "../application/service.factory.js";
import {
  RegisterSchema,
  type RegisterReply,
} from "../contract/auth/register.js";
import type {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/base.contract.js";
import { LoginSchema, type LoginReply } from "../contract/auth/login.js";
import type { JWT } from "@fastify/jwt";

export class AuthController extends BaseController {
  constructor(
    private readonly serviceFactory: ServiceFactory,
    private readonly jwt: JWT,
  ) {
    super();
  }

  #login = async (
    req: FastifyRequestTypeBox<typeof LoginSchema>,
    reply: FastifyReplyTypeBox<typeof LoginSchema>,
  ) => {
    const { account, password } = req.body;

    const service = this.serviceFactory.createLoginService();
    const result = await service.handle({
      account,
      password,
    });

    if (result.isSuccess) {
      const user = result.data;
      return Reply.OK<LoginReply>(reply, {
        token: this.jwt.sign({
          id: user.id,
          account: user.account,
        }),
      });
    }

    return Reply.Unauthorized(reply, result.code);
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
      return Reply.OK<RegisterReply>(reply, {
        id,
        account,
      });
    }

    return Reply.Conflict(reply, result.code);
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", { schema: LoginSchema }, this.#login);
    fastify.post("/register", { schema: RegisterSchema }, this.#register);
  }
}
