import {
  RegisterSchema,
  type RegisterReply,
} from "../contract/auth/register.js";
import { LoginSchema, type LoginReply } from "../contract/auth/login.js";
import type { JWT } from "@fastify/jwt";
import { ERROR_CODES } from "../application/error.code.js";
import { AuthUseCases } from "../application/service.context.js";
import { FastifyInstance } from "fastify";
import { matchResult } from "../shared/result.js";
import {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/index.js";

const makeAuthController = (deps: { uc: AuthUseCases; jwt: JWT }) => {
  const { uc, jwt } = deps;

  return {
    login: async (
      req: FastifyRequestTypeBox<typeof LoginSchema>,
      reply: FastifyReplyTypeBox<typeof LoginSchema>,
    ) => {
      const { account, password } = req.body;

      const result = await uc.login({
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

      const result = await uc.register({
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

export const makeAuthRoutes =
  (deps: { uc: AuthUseCases }) => (fastify: FastifyInstance) => {
    const auth = makeAuthController({
      ...deps,
      jwt: fastify.jwt,
    });
    fastify.register(
      (instance) => {
        instance.post("/login", { schema: LoginSchema }, auth.login);
        instance.post("/register", { schema: RegisterSchema }, auth.register);
      },
      { prefix: "/auth" },
    );
  };
