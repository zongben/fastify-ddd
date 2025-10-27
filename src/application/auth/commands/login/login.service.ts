import { ERROR_CODES } from "../../../error.code.js";
import { ErrorReturn, OkReturn } from "../../../service.response.js";
import { userRepository } from "../../../../infra/user.repository.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export type LoginError = ERROR_CODES.LOGIN_FAILED;

export const loginService = (deps: {
  userRepository: ReturnType<typeof userRepository>;
}) => {
  const { userRepository } = deps;

  return async (command: LoginCommand) => {
    const { account, password } = command;

    const user = await userRepository.getUserByAccount(account);
    if (user == null || !user.password.matches(password)) {
      return new ErrorReturn<LoginError>(ERROR_CODES.LOGIN_FAILED);
    }

    return new OkReturn(user);
  };
};
