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

export const makeAuthController = (deps: { authUseCases: AuthUseCases }) => {
  const { authUseCases } = deps;

  return {
    login: async (
      req: FastifyRequestTypeBox<typeof LoginSchema>,
      reply: FastifyReplyTypeBox<typeof LoginSchema>,
    ) => {
      const { account, password } = req.body;

      const result = await authUseCases.login({
        account,
        password,
      });
      matchResult(result, {
        ok: (v) => {
          OkResponse(reply, {
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

      const result = await authUseCases.register({
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

export const makeAuthRoutes = (fastify: FastifyInstance) => {
  const authController = fastify.diContainer.resolve(
    "authController",
  ) as AuthController;

  fastify.register(
    (instance) => {
      instance.post("/login", { schema: LoginSchema }, authController.login);
      instance.post(
        "/register",
        {
          schema: RegisterSchema,
          preValidation: registerPreValidation,
          errorHandler: registerErrorHandler,
        },
        authController.register,
      );
    },
    { prefix: "/auth" },
  );
};
