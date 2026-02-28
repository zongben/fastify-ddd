import { err, ok } from "../../../../../shared/result.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { IUserRepository } from "../../../../persistences/index.js";
import { ICryptService, IJwtokenService } from "../../../../ports/index.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export type LoginError = ERROR_CODES.LOGIN_FAILED;

export const makeLoginHandler = (deps: {
  userRepository: IUserRepository;
  jwtokenService: IJwtokenService;
  cryptService: ICryptService;
}) => {
  const { userRepository, jwtokenService, cryptService } = deps;

  return async (command: LoginCommand) => {
    const { account, password } = command;

    const user = await userRepository.getUserByAccount(account);
    if (
      user == null ||
      !(await cryptService.compare(password, user.hashedPwd))
    ) {
      return err<LoginError>(ERROR_CODES.LOGIN_FAILED);
    }

    var token = jwtokenService.sign({
      id: user.id,
      account: user.account,
    });

    return ok({ token });
  };
};
