import { registerService } from "./auth/commands/register/register.service.js";
import { loginService } from "./auth/commands/login/login.service.js";
import { repositoryContext } from "../infra/repository.context.js";

export const serviceContext = (deps: {
  repositoryCtx: ReturnType<typeof repositoryContext>;
}) => {
  const { repositoryCtx } = deps;

  return {
    registerService: registerService({
      userRepository: repositoryCtx.userRepository,
    }),
    loginService: loginService({
      userRepository: repositoryCtx.userRepository,
    }),
  };
};
