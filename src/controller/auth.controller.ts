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
import { matchResult } from "../application/service.response.js";
import { ERROR_CODES } from "../application/error.code.js";

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

    return matchResult(result, {
      ok: (v) => {
        return Reply.OK<LoginReply>(reply, {
          token: this.jwt.sign({
            id: v.id,
            account: v.account,
          }),
        });
      },
      err: {
        [ERROR_CODES.LOGIN_FAILED]: (e) => {
          return Reply.Unauthorized(reply, e);
        },
      },
    });
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

    return matchResult(result, {
      ok: (v) => {
        const { id, account } = v;
        return Reply.OK<RegisterReply>(reply, {
          id,
          account,
        });
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: (e) => {
          return Reply.Conflict(reply, e);
        },
      },
    });
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", { schema: LoginSchema }, this.#login);
    fastify.post("/register", { schema: RegisterSchema }, this.#register);
  }
}
