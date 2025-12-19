import { IUserRepository } from "../../application/persistences/index.js";
import { makeUser, User } from "../../domain/user/user.domain.js";
import { DbClient } from "../../shared/prisma.js";

export const makeUserRepository = (deps: { db: DbClient }): IUserRepository => {
  const { db } = deps;

  return {
    createUser: async (user: User) => {
      await db.user.create({
        data: {
          id: user.id,
          account: user.account,
          password: user.hashedPwd,
          username: user.username,
        },
      });
      return user;
    },
    getUserByAccount: async (account: string) => {
      const user = await db.user.findUnique({
        where: {
          account,
        },
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
