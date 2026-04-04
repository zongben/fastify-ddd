import { makeRegisterHandler } from "./commands/register.handler.js";
import { makeLoginHandler } from "./commands/login.handler.js";
import { IUserRepository } from "../../persistences.js";
import { IJwtokenService, ICryptService } from "../../ports.js";

export const makeAuthUseCases = (deps: {
  userRepository: IUserRepository;
  jwtokenService: IJwtokenService;
  cryptService: ICryptService;
}) => ({
  register: makeRegisterHandler(deps),
  login: makeLoginHandler(deps),
});

export type AuthUseCases = ReturnType<typeof makeAuthUseCases>;
