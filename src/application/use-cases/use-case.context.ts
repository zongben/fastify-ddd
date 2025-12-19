import { makeRegisterHandler } from "./auth/commands/register/register.handler.js";
import { makeLoginHandler } from "./auth/commands/login/login.handler.js";
import { RepositoryContext } from "../../infra/repository.context.js";
import { IUserRepository } from "../persistences/index.js";
import { ITokenService } from "../services/index.js";

const makeAuthUseCases = (deps: { userRepository: IUserRepository, tokenService: ITokenService }) => ({
  register: makeRegisterHandler(deps),
  login: makeLoginHandler(deps),
});

export const makeUseCaseContext = (deps: { repoCtx: RepositoryContext, tokenService: ITokenService }) => {
  const { repoCtx, tokenService } = deps;

  return {
    auth: makeAuthUseCases({ userRepository: repoCtx.userRepository, tokenService }),
  };
};

export type UseCaseContext = ReturnType<typeof makeUseCaseContext>;
export type AuthUseCases = ReturnType<typeof makeAuthUseCases>;
