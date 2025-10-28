import { type FastifyMongoObject } from "@fastify/mongodb";
import { UserSchema } from "./schema/user.js";
import { COLLECTIONS } from "./schema/collections.js";
import { createUser, User } from "../domain/user/user.domain.js";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  getUserByAccount(account: string): Promise<User | null>;
}

export const makeUserRepository = (deps: {
  mongo: FastifyMongoObject;
}): IUserRepository => {
  const { mongo } = deps;

  return {
    createUser: async (user: User) => {
      const users = mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
      await users?.insertOne({
        _id: user.id,
        account: user.account,
        password: user.hashedPwd,
        username: user.username,
      });
      return user;
    },
    getUserByAccount: async (account: string) => {
      const users = mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
      const user = await users?.findOne({
        account,
      });

      if (!user) return null;

      return createUser({
        id: user._id,
        account: user.account,
        hashedPwd: user.password,
        username: user.username,
      });
    },
  };
};
