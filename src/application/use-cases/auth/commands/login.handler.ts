import { err, ok } from "../../../../shared/result.js";
import { ERROR_CODES } from "../../../error.code.js";
import { IUserRepository } from "../../../persistences.js";
import { IJwtokenService, ICryptService } from "../../../ports.js";

export type LoginCommand = {
  account: string;
  password: string;
};

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
      return err(ERROR_CODES.LOGIN_FAILED);
    }

    var token = jwtokenService.sign({
      id: user.id,
      account: user.account,
    });

    return ok({ token });
  };
};
