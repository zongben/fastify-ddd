import { createUserIndex } from "./user.js";
import { MongoDb } from "../../shared/mongo.js";

export enum COLLECTIONS {
  USERS = "users",
}

export const initMongoIndexes = async (db: MongoDb) => {
  await createUserIndex(db);
};
