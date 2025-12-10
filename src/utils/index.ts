import bcrypt from "bcrypt";
import { v7 } from "uuid";

export const crypt = {
  hash: async (plain: string) => {
    return await bcrypt.hash(plain, 10);
  },
  compare: async (plain: string, hash: string) => {
    return await bcrypt.compare(plain, hash);
  },
};

export const uuid = () => {
  return v7();
};
