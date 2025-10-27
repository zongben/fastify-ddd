import { FastifyMongoObject } from "@fastify/mongodb";
import { makeUserRepository } from "./user.repository.js";

export type RepositoryContext = ReturnType<typeof repositoryContext>;

export const repositoryContext = (deps: { mongo: FastifyMongoObject }) => {
  return {
    userRepository: makeUserRepository(deps),
  };
};
