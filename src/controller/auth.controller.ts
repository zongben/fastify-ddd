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
import { serviceContext } from "../application/service.context.js";

export const authController = (deps: {
  serviceCtx: ReturnType<typeof serviceContext>;
  jwt: JWT;
}) => {
  const { serviceCtx, jwt } = deps;

  return {
    login: async (
      req: FastifyRequestTypeBox<typeof LoginSchema>,
      reply: FastifyReplyTypeBox<typeof LoginSchema>,
    ) => {
      const { account, password } = req.body;

      const result = await serviceCtx.loginService({
        account,
        password,
      });
      return matchResult(result, {
        ok: (v) => {
          return reply.OK<LoginReply>({
            token: jwt.sign({
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
    },
    register: async (
      req: FastifyRequestTypeBox<typeof RegisterSchema>,
      reply: FastifyReplyTypeBox<typeof RegisterSchema>,
    ) => {
      const { account, password, username } = req.body;

      const result = await serviceCtx.registerService({
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
    },
  };
};
