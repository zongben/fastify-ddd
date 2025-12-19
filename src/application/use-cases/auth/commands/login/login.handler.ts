import { ITokenService } from "../../../../../services/token.service.js";
import { err, ok } from "../../../../../shared/result.js";
import { crypt } from "../../../../../utils/index.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { IUserRepository } from "../../../../persistences/index.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export type LoginError = ERROR_CODES.LOGIN_FAILED;

export const makeLoginHandler = (deps: {
  userRepository: IUserRepository;
  tokenService: ITokenService;
}) => {
  const { userRepository, tokenService } = deps;
  return async (command: LoginCommand) => {
    const { account, password } = command;

    const user = await userRepository.getUserByAccount(account);
    if (user == null || !(await crypt.compare(password, user.hashedPwd))) {
      return err<LoginError>(ERROR_CODES.LOGIN_FAILED);
    }

    var token = tokenService.sign({
      id: user.id,
      account: user.account,
    });

    return ok({ token });
  };
};
