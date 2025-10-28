import { ERROR_CODES } from "../../../../error.code.js";
import { IUserRepository } from "../../../../../infra/user.repository.js";
import { err, ok } from "../../../../../shared/result.js";
import { User } from "../../../../../domain/user.domain.js";
import { uuid, crypto } from "../../../../../utils/index.js";

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

    const user = User.create({
      id: uuid(),
      account: command.account,
      hashedPwd: crypto.hash(command.password),
      username: command.username,
    });
    await userRepository.createUser(user);
    return ok(user);
  };
};
