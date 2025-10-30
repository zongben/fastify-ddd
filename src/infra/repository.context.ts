import { makeUserRepository } from "./user.repository.js";
import { MongoDb } from "../shared/mongo.js";

export const makeRepositoryContext = (deps: { db: MongoDb }) => {
  return {
    userRepository: makeUserRepository(deps),
  };
};

export type RepositoryContext = ReturnType<typeof makeRepositoryContext>;
