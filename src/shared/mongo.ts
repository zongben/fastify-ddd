import { FastifyMongoObject } from "@fastify/mongodb";

export type MongoDb = ReturnType<typeof makeMongoDb>;

export const makeMongoDb = (mongo: FastifyMongoObject) => {
  if (!mongo.db) {
    throw Error("Mongo Db doesn't init.");
  }
  return mongo.db;
};
