import { FastifyMongoObject } from "@fastify/mongodb";
import { userRepository } from "./user.repository.js";

export const repositoryContext = (deps: { mongo: FastifyMongoObject }) => {
  return {
    userRepository: userRepository(deps),
  };
};
