import { eq } from "drizzle-orm";
import { IUserRepository } from "../../application/persistences.js";
import { makeUser, User } from "../../domain/user.domain.js";
import { DbClient } from "../../shared/drizzle.js";
import { usersTable } from "../db/schema.js";

export const makeUserRepository = (deps: { db: DbClient }): IUserRepository => {
  const { db } = deps;

  return {
    createUser: async (user: User) => {
      await db.insert(usersTable).values({
        id: user.id,
        account: user.account,
        password: user.hashedPwd,
        username: user.username,
      });
      return user;
    },
    getUserByAccount: async (account: string) => {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.account, account),
      });

      if (!user) return null;

      return makeUser({
        id: user.id,
        account: user.account,
        hashedPwd: user.password,
        username: user.username,
      });
    },
  };
};
