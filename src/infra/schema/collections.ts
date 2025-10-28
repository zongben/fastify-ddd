import { FastifyMongoObject } from "@fastify/mongodb";
import { createUserIndex } from "./user.js";

export enum COLLECTIONS {
  USERS = "users",
}

export const initMongoIndexes = async (mongo: FastifyMongoObject) => {
  await createUserIndex(mongo);
};
