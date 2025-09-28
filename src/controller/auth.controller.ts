import type { FastifyInstance } from "fastify";
import { BaseController } from "./base.controller";
import type { ServiceFactory } from "../application/service.factory";
import { RegisterSchema, type RegisterReply } from "../contract/auth/register";
import type {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/base.contract";
import { LoginSchema, type LoginReply } from "../contract/auth/login";
import type { JWT } from "@fastify/jwt";
import { matchResult } from "../application/service.response";
import { ERROR_CODES } from "../application/error.code";

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
        return reply.OK<LoginReply>({
          token: this.jwt.sign({
            id: v.id,
            account: v.account,
          }),
        });
      },
      err: {
        [ERROR_CODES.LOGIN_FAILED]: (e) => {
          return reply.Unauthorized(e);
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
        return reply.OK<RegisterReply>({
          id,
          account,
        });
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: (e) => {
          return reply.Conflict(e);
        },
      },
    });
  };

  protected routes(fastify: FastifyInstance): void {
    fastify.post("/login", { schema: LoginSchema }, this.#login);
    fastify.post("/register", { schema: RegisterSchema }, this.#register);
  }
}
