import { makeRegisterHandler } from "./auth/commands/register/register.handler.js";
import { makeLoginHandler } from "./auth/commands/login/login.handler.js";
import { IUserRepository } from "../../infra/user.repository.js";
import { RepositoryContext } from "../../infra/repository.context.js";

const makeAuthUseCases = (deps: { userRepository: IUserRepository }) => ({
  register: makeRegisterHandler(deps),
  login: makeLoginHandler(deps),
});

export const makeUseCaseContext = (deps: { repoCtx: RepositoryContext }) => {
  const { repoCtx } = deps;

  return {
    auth: makeAuthUseCases({ userRepository: repoCtx.userRepository }),
  };
};

export type UseCaseContext = ReturnType<typeof makeUseCaseContext>;
export type AuthUseCases = ReturnType<typeof makeAuthUseCases>;
