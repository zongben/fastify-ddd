import {
  RegisterSchema,
  type RegisterReply,
} from "../contract/auth/register.js";
import { LoginSchema, type LoginReply } from "../contract/auth/login.js";
import type { JWT } from "@fastify/jwt";
import { ERROR_CODES } from "../application/error.code.js";
import { FastifyInstance } from "fastify";
import { matchResult } from "../shared/result.js";
import {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/index.js";
import { AuthUseCases } from "../application/use-cases/use-case.context.js";

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
      matchResult(result, {
        ok: (v) => {
          reply.OK<LoginReply>({
            token: jwt.sign({
              id: v.id,
              account: v.account,
            }),
          });
        },
        err: {
          [ERROR_CODES.LOGIN_FAILED]: (e) => {
            reply.Unauthorized(e);
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

      matchResult(result, {
        ok: (v) => {
          const { id, account } = v;
          reply.OK<RegisterReply>({
            id,
            account,
          });
        },
        err: {
          [ERROR_CODES.ACCOUNT_IS_USED]: (e) => {
            reply.Conflict(e);
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
