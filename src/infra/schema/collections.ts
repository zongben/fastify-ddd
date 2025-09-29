import { FastifyMongoObject } from "@fastify/mongodb";

export enum COLLECTIONS {
  USERS = "users",
}

export type UserSchema = {
  _id: string;
  account: string;
  password: string;
  username: string;
};

const createUserIndex = async (mongo: FastifyMongoObject) => {
  const users = mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
  await users?.createIndex({ account: 1 }, { unique: true });
};

export const initMongoIndexes = async (mongo: FastifyMongoObject) => {
  await createUserIndex(mongo);
};
