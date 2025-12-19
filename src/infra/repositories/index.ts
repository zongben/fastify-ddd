import { DbClient } from "../../shared/prisma.js";
import { makeUserRepository } from "./user.repository.js";

export const makeRepositories = (deps: { db: DbClient }) => {
  return {
    userRepository: makeUserRepository(deps),
  };
};
export type Repositories = ReturnType<typeof makeRepositories>;

