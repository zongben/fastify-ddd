import { type FastifyMongoObject } from "@fastify/mongodb";
import { Password, User } from "../domain/user.domain.js";
import { COLLECTIONS, type UserSchema } from "./schema/collections.js";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  getUserByAccount(account: string): Promise<User | null>;
}

export class UserRepository {
  constructor(private readonly mongo: FastifyMongoObject) {}

  async createUser(user: User): Promise<User> {
    const users = this.mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
    await users?.insertOne({
      _id: user.id,
      account: user.account,
      password: user.password.hash,
      username: user.username,
    });
    return user;
  }

  async getUserByAccount(account: string): Promise<User | null> {
    const users = this.mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
    const user = await users?.findOne({
      account,
    });

    if (!user) return null;

    return new User({
      id: user._id,
      account: user.account,
      password: Password.fromHash(user.password),
      username: user.username,
    });
  }
}
