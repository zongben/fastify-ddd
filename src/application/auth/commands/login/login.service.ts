import type { IUserRepository } from "../../../../infra/user.repository.js";
import { ERROR_CODES } from "../../../error.code.js";
import { ErrorResult, OkResult } from "../../../service.response.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export class LoginService {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(command: LoginCommand) {
    const { account, password } = command;

    const user = await this.userRepository.getUserByAccount(account);
    if (user == null || !user.password.matches(password)) {
      return new ErrorResult(ERROR_CODES.LOGIN_FAILED);
    }

    return new OkResult(user);
  }
}
