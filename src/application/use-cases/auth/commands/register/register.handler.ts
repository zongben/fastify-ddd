import { v7 } from "uuid";
import { ERROR_CODES } from "../../../../error.code.js";
import { IUserRepository } from "../../../../../infra/user.repository.js";
import { err, ok } from "../../../../../shared/result.js";
import { Password, User } from "../../../../../domain/user.domain.js";

export type RegisterCommand = {
  account: string;
  password: string;
  username: string;
};

export type RegisterError = ERROR_CODES.ACCOUNT_IS_USED;

export const makeRegisterHandler = (deps: {
  userRepository: IUserRepository;
}) => {
  const { userRepository } = deps;

  return async (command: RegisterCommand) => {
    const isUserExists = await userRepository.getUserByAccount(command.account);

    if (isUserExists) {
      return err<RegisterError>(ERROR_CODES.ACCOUNT_IS_USED);
    }

    const user = new User({
      id: v7(),
      account: command.account,
      password: Password.create(command.password),
      username: command.username,
    });
    await userRepository.createUser(user);
    return ok(user);
  };
};
