export type User = Readonly<{
  id: string;
  account: string;
  hashedPwd: string;
  username: string;
}>;

export const makeUser = (props: {
  id: string;
  account: string;
  hashedPwd: string;
  username: string;
}): User => {
  return {
    ...props,
  };
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
