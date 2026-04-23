export type User = {
  id: string;
  account: string;
  hashedPwd: string;
  username: string;
};

export const makeUser = (props: {
  id: string;
  account: string;
  hashedPwd: string;
  username: string;
}): User => {
  const user = {
    ...props,
  };
  return user;
};

export const makeUserEntity = (user: User) => {
  return {
    value: () => user,
    changeUserName: (username: string) => {
      return makeUserEntity(
        makeUser({
          ...user,
          username,
        }),
      );
    },
  };
};
