import type { IUserRepository } from "../../../../infra/user.repository.js";
import { ERROR_CODES } from "../../../error.code.js";
import { ErrorReturn, OkReturn } from "../../../service.response.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export type LoginError = ERROR_CODES.LOGIN_FAILED;

export class LoginService {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(command: LoginCommand) {
    const { account, password } = command;

    const user = await this.userRepository.getUserByAccount(account);
    if (user == null || !user.password.matches(password)) {
      return new ErrorReturn<LoginError>(ERROR_CODES.LOGIN_FAILED);
    }

    return new OkReturn(user);
  }
}
