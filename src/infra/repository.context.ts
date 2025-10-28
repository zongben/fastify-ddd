import { FastifyMongoObject } from "@fastify/mongodb";
import { makeUserRepository } from "./user.repository.js";

export const makeRepositoryContext = (deps: { mongo: FastifyMongoObject }) => {
  return {
    userRepository: makeUserRepository(deps),
  };
};

export type RepositoryContext = ReturnType<typeof makeRepositoryContext>;
