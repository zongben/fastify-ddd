import { ERROR_CODES } from "../../../error.code.js";
import { IUserRepository } from "../../../../infra/user.repository.js";
import { err, ok } from "../../../../shared/result.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export type LoginError = ERROR_CODES.LOGIN_FAILED;

export const makeLoginHandler = (deps: { userRepository: IUserRepository }) => {
  const { userRepository } = deps;

  return async (command: LoginCommand) => {
    const { account, password } = command;

    const user = await userRepository.getUserByAccount(account);
    if (user == null || !user.password.matches(password)) {
      return err<LoginError>(ERROR_CODES.LOGIN_FAILED);
    }

    return ok(user);
  };
};
