import { diContainer } from "@fastify/awilix";
import { makeCryptService, makeJwtokenService } from "../infra/services.js";
import { makeUserRepository } from "../infra/repositories/user.repository.js";
import { makeAuthUseCases } from "../application/use-cases/auth/index.js";
import { makeAuthController } from "./auth.controller.js";
import { JWT } from "@fastify/jwt";
import { makeDrizzle } from "../shared/drizzle.js";
import { makeUserController } from "./user.controller.js";
import { asFunction, asValue } from "awilix";

export const initContainer = (deps: { url: string; jwt: JWT }) => {
  const { url, jwt } = deps;

  diContainer.register({
    db: asValue(makeDrizzle({ url })),
  });

  diContainer.register({
    cryptService: asFunction(makeCryptService).singleton(),
    jwtokenService: asValue(makeJwtokenService({ jwt })),
  });

  diContainer.register({
    userRepository: asFunction(makeUserRepository).singleton(),
  });

  diContainer.register({
    authUseCases: asFunction(makeAuthUseCases).singleton(),
  });

  diContainer.register({
    authController: asFunction(makeAuthController).singleton(),
    userController: asFunction(makeUserController).singleton(),
  });
};
