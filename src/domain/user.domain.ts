import { crypto } from "../utils/index.js";

export type User = Readonly<{
  id: string;
  account: string;
  hashedPwd: string;
  username: string;
}>;

export const User = {
  create: (props: {
    id: string;
    account: string;
    hashedPwd: string;
    username: string;
  }): User => {
    return {
      ...props,
    };
  },
  validPassword: (user: User, plain: string): boolean => {
    return crypto.compare(plain, user.hashedPwd);
  },
};
