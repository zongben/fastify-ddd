import { DbClient } from "../shared/prisma.js";
import { makeUserRepository } from "./user.repository.js";

export const makeRepositoryContext = (deps: { db: DbClient }) => {
  return {
    userRepository: makeUserRepository(deps),
  };
};

export type RepositoryContext = ReturnType<typeof makeRepositoryContext>;
