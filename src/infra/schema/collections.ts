import { FastifyInstance } from "fastify";

export enum COLLECTIONS {
  USERS = "users",
}

export type UserSchema = {
  _id: string;
  account: string;
  password: string;
  username: string;
};

const createUserIndex = async (instance: FastifyInstance) => {
  const users = instance.mongo.db?.collection<UserSchema>(COLLECTIONS.USERS);
  await users?.createIndex({ account: 1 }, { unique: true });
};

export const initMongoIndexes = async (instance: FastifyInstance) => {
  await createUserIndex(instance);
};
