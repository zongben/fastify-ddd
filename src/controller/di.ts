import { makeAuthUseCases } from "../application/use-cases/auth/index.js";
import { makeRepositories } from "../infra/repositories/index.js";
import { makeCryptService, makeTokenService } from "../infra/services/index.js";
import { DbClient } from "../shared/prisma.js";
import { makeAuthController } from "./auth.controller.js";
import { JWT } from "@fastify/jwt";
import { makeUserController } from "./user.controller.js";

export const makeContainer = (deps: { jwt: JWT; db: DbClient }) => {
  const { jwt, db } = deps;

  const tokenService = makeTokenService(jwt);
  const cryptService = makeCryptService();

  const repo = makeRepositories({
    db,
  });

  const useCases = {
    authUseCase: makeAuthUseCases({
      userRepository: repo.userRepository,
      tokenService,
      cryptService,
    }),
  };

  const controllers = {
    AuthController: makeAuthController({
      uc: useCases.authUseCase,
    }),
    UserController: makeUserController(),
  };

  return {
    get<T extends keyof typeof controllers>(
      key: T,
    ): (typeof controllers)[T] {
      return controllers[key];
    },
  };
};

export type Container = ReturnType<typeof makeContainer>;
