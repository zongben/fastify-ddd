import Type, { Static } from "typebox";
import { Compile } from "typebox/compile";
import { assertValid } from "../../utils/index.js";

const UserType = Type.ReadonlyType(
  Type.Object({
    id: Type.String(),
    account: Type.String(),
    hashedPwd: Type.String(),
    username: Type.String(),
  }),
);

const userValidator = Compile(UserType);

export type User = Static<typeof UserType>;

export const makeUser = (props: {
  id: string;
  account: string;
  hashedPwd: string;
  username: string;
}): User => {
  const user = {
    ...props,
  };
  assertValid(userValidator, user);
  return user;
};

export const makeUserEntity = (user: User) => {
  return {
    value: () => user,
    changeUserName: (username: string) => {
      return makeUserEntity({
        ...user,
        username,
      });
    },
  };
};
