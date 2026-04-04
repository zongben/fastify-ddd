import { User } from "../domain/user.domain.js";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  getUserByAccount(account: string): Promise<User | null>;
}

