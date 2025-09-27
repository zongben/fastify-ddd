export enum COLLECTIONS {
  USERS = "users",
}

export type UserSchema = {
  _id: string;
  account: string;
  password: string;
  username: string;
};
