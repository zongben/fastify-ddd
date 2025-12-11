import { UserSchema } from "./schema/user.js";
import { COLLECTIONS } from "./schema/collections.js";
import { makeUser, User } from "../domain/user/user.domain.js";
import { MongoDb } from "../shared/mongo.js";
import { IUserRepository } from "../application/persistences/index.js";

export const makeUserRepository = (deps: { db: MongoDb }): IUserRepository => {
  const { db } = deps;

  return {
    createUser: async (user: User) => {
      const users = db.collection<UserSchema>(COLLECTIONS.USERS);
      await users.insertOne({
        _id: user.id,
        account: user.account,
        password: user.hashedPwd,
        username: user.username,
      });
      return user;
    },
    getUserByAccount: async (account: string) => {
      const users = db.collection<UserSchema>(COLLECTIONS.USERS);
      const user = await users.findOne({
        account,
      });

      if (!user) return null;

      return makeUser({
        id: user._id,
        account: user.account,
        hashedPwd: user.password,
        username: user.username,
      });
    },
  };
};
