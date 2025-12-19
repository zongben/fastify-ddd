import {
  registerErrorHandler,
  registerPreValidation,
  RegisterSchema,
  type RegisterReply,
} from "../contract/auth/register.js";
import { LoginSchema, type LoginReply } from "../contract/auth/login.js";
import { FastifyInstance } from "fastify";
import { matchResult } from "../shared/result.js";
import {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/index.js";
import { errResponse } from "../contract/responses.js";
import { AuthUseCases } from "../application/use-cases/auth/index.js";

const makeAuthController = (deps: { uc: AuthUseCases }) => {
  const { uc } = deps;

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
          return reply.OK<LoginReply>({
            token: v.token,
          });
        },
        err: errResponse(reply),
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
          return reply.OK<RegisterReply>({
            id,
            account,
          });
        },
        err: errResponse(reply),
      });
    },
  };
};

export const makeAuthRoutes =
  (deps: { uc: AuthUseCases }) => (fastify: FastifyInstance) => {
    const auth = makeAuthController({
      ...deps,
    });
    fastify.register(
      (instance) => {
        instance.post("/login", { schema: LoginSchema }, auth.login);
        instance.post(
          "/register",
          {
            schema: RegisterSchema,
            preValidation: registerPreValidation,
            errorHandler: registerErrorHandler,
          },
          auth.register,
        );
      },
      { prefix: "/auth" },
    );
  };
