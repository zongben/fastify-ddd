import {
  registerErrorHandler,
  registerPreValidation,
  RegisterSchema,
} from "../contract/auth/register.js";
import { LoginSchema } from "../contract/auth/login.js";
import { FastifyInstance } from "fastify";
import { matchResult } from "../shared/result.js";
import {
  FastifyReplyTypeBox,
  FastifyRequestTypeBox,
} from "../contract/index.js";
import { errResponse, OkResponse } from "../contract/responses.js";
import { AuthUseCases } from "../application/use-cases/auth/index.js";

export const makeAuthController = (deps: { uc: AuthUseCases }) => {
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
          OkResponse(reply, {
            token: v.token
          })
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
          OkResponse(reply, {
            id,
            account,
          });
        },
        err: errResponse(reply),
      });
    },
  };
};

export type AuthController = ReturnType<typeof makeAuthController>;

export const makeAuthRoutes =
  (auth: AuthController) => (fastify: FastifyInstance) => {
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
