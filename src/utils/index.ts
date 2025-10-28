import bcrypt from "bcrypt";
import { v7 } from "uuid";

export const crypt = {
  hash: (plain: string) => {
    return bcrypt.hashSync(plain, 10);
  },
  compare: (plain: string, hash: string) => {
    return bcrypt.compareSync(plain, hash);
  },
};

export const uuid = () => {
  return v7();
};
