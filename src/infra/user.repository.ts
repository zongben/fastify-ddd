import { ObjectId, type FastifyMongoObject } from "@fastify/mongodb";
import type { User } from "../domain/user.domain.js";
import { SCHEMA } from "./schema.js";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
}

export class UserRepository {
  constructor(private readonly mongo: FastifyMongoObject) {}

  async createUser(user: User) {
    const users = this.mongo.db?.collection(SCHEMA.USERS);
    await users?.insertOne({
      _id: new ObjectId(user.id),
      account: user.account,
      password: user.password.hash,
      username: user.username,
    });
    return user;
  }
}
