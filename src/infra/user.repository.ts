import { type FastifyMongoObject } from "@fastify/mongodb";
import { Password, User } from "../domain/user.domain.js";
import { COLLECTIONS, type UserSchema } from "./schema/collections.js";

export const userRepository = (deps: { mongo: FastifyMongoObject }) => {
  const { mongo } = deps;

  return {
    createUser: async (user: User) => {
      const users = mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
      await users?.insertOne({
        _id: user.id,
        account: user.account,
        password: user.password.hash,
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

      return new User({
        id: user._id,
        account: user.account,
        password: Password.fromHash(user.password),
        username: user.username,
      });
    },
  };
};
