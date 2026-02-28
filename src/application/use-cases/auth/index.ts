import { IUserRepository } from "../../persistences/index.js";
import { ICryptService, IJwtokenService } from "../../ports/index.js";
import { makeLoginHandler } from "./commands/login/login.handler.js";
import { makeRegisterHandler } from "./commands/register/register.handler.js";

export const makeAuthUseCases = (deps: {
  userRepository: IUserRepository;
  jwtokenService: IJwtokenService;
  cryptService: ICryptService;
}) => ({
  register: makeRegisterHandler(deps),
  login: makeLoginHandler(deps),
});

export type AuthUseCases = ReturnType<typeof makeAuthUseCases>;
