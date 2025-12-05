import { JWT } from "@fastify/jwt";
import { IUserRepository } from "../../../../../infra/user.repository.js";
import { err, ok } from "../../../../../shared/result.js";
import { crypt } from "../../../../../utils/index.js";
import { ERROR_CODES } from "../../../../error.code.js";

export type LoginCommand = {
  account: string;
  password: string;
};

export type LoginError = ERROR_CODES.LOGIN_FAILED;

export const makeLoginHandler = (deps: { userRepository: IUserRepository, jwt: JWT }) => {
  const { userRepository, jwt } = deps;
  return async (command: LoginCommand) => {
    const { account, password } = command;

    const user = await userRepository.getUserByAccount(account);
    if (user == null || !crypt.compare(password, user.hashedPwd)) {
      return err<LoginError>(ERROR_CODES.LOGIN_FAILED);
    }

    var token = jwt.sign({
      id: user.id,
      account: user.account,
    })

    return ok({ token });
  };
};
