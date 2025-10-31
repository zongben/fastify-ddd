import { ERROR_CODES } from "../../../../error.code.js";
import { IUserRepository } from "../../../../../infra/user.repository.js";
import { err, ok } from "../../../../../shared/result.js";
import { crypt, uuid } from "../../../../../utils/index.js";
import { makeUser } from "../../../../../domain/user/user.domain.js";

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

    const user = makeUser({
      id: uuid(),
      account: command.account,
      hashedPwd: crypt.hash(command.password),
      username: command.username,
    });
    await userRepository.createUser(user);
    return ok(user);
  };
};
