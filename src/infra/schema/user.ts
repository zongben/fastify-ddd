import { COLLECTIONS } from "./collections.js";
import { MongoDb } from "../../shared/mongo.js";

export type UserSchema = {
  _id: string;
  account: string;
  password: string;
  username: string;
};

export const createUserIndex = async (db: MongoDb) => {
  const users = db.collection<UserSchema>(COLLECTIONS.USERS);
  await users.createIndex({ account: 1 }, { unique: true });
};
