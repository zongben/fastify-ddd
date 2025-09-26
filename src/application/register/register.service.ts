import { v7 } from "uuid";
import { Password, User } from "../../domain/user.domain.js";
import type { IUserRepository } from "../../infra/user.repository.js";
import type { IService } from "../service.interface.js";

export class RegisterService implements IService {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(req: { account: string; password: string; username: string }) {
    const user = new User({
      id: v7(),
      account: req.account,
      password: Password.create(req.password),
      username: req.username,
    });
    await this.userRepository.createUser(user);
    return user;
  }
}
