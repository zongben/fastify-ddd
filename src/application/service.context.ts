import { makeRegisterHandler } from "./auth/commands/register/register.handler.js";
import { makeLoginHandler } from "./auth/commands/login/login.handler.js";
import { RepositoryContext } from "../infra/repository.context.js";
import { IUserRepository } from "../infra/user.repository.js";

const authHandlers = (deps: { userRepository: IUserRepository }) => ({
  register: makeRegisterHandler(deps),
  login: makeLoginHandler(deps),
});

export const serviceContext = (deps: { repoCtx: RepositoryContext }) => {
  const { repoCtx } = deps;

  return {
    auth: authHandlers({ userRepository: repoCtx.userRepository }),
  };
};

export type ServiceContext = ReturnType<typeof serviceContext>;
