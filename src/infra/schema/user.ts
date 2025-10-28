import { FastifyMongoObject } from "@fastify/mongodb";
import { COLLECTIONS } from "./collections.js";

export type UserSchema = {
  _id: string;
  account: string;
  password: string;
  username: string;
};

export const createUserIndex = async (mongo: FastifyMongoObject) => {
  const users = mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
  await users?.createIndex({ account: 1 }, { unique: true });
};
