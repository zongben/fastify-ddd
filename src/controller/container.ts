import { diContainer } from "@fastify/awilix";
import {
  makeCryptService,
  makeJwtokenService,
} from "../infra/services/index.js";
import { makeUserRepository } from "../infra/repositories/user.repository.js";
import { makeAuthUseCases } from "../application/use-cases/auth/index.js";
import { makeAuthController } from "./auth.controller.js";
import { JWT } from "@fastify/jwt";
import { makePrisma } from "../shared/prisma.js";
import { asFunction, asValue } from "awilix/lib/resolvers.js";
import { makeUserController } from "./user.controller.js";

export const initContainer = (deps: { url: string; jwt: JWT }) => {
  const { url, jwt } = deps;

  diContainer.register({
    db: asValue(makePrisma({ url })),
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
