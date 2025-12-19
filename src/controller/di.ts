import { ICryptService, ITokenService } from "../application/ports/index.js";
import { makeAuthUseCases } from "../application/use-cases/auth/index.js";
import { Repositories } from "../infra/repositories/index.js";

export const makeUseCases = (deps: {
  repo: Repositories;
  tokenService: ITokenService;
  cryptService: ICryptService;
}) => {
  const { repo, tokenService, cryptService } = deps;

  return {
    auth: makeAuthUseCases({
      userRepository: repo.userRepository,
      tokenService,
      cryptService,
    }),
  };
};

export type UseCases = ReturnType<typeof makeUseCases>;
