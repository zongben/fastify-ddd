import { v7 } from "uuid";
import type { IUserRepository } from "../../../../infra/user.repository.js";
import { Password, User } from "../../../../domain/user.domain.js";
import { ErrorResponse, OkResponse } from "../../../service.response.js";
import { ERROR_CODES } from "../../../error.code.js";

export type RegisterCommand = {
  account: string;
  password: string;
  username: string;
};

export class RegisterService {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(command: RegisterCommand) {
    const isUserExists =
      (await this.userRepository.getUserByAccount(command.account)) !== null;

    if (isUserExists) {
      return new ErrorResponse(ERROR_CODES.ACCOUNT_IS_USED);
    }

    const user = new User({
      id: v7(),
      account: command.account,
      password: Password.create(command.password),
      username: command.username,
    });
    await this.userRepository.createUser(user);
    return new OkResponse(user);
  }
}
