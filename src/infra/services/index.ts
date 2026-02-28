import { JWT } from "@fastify/jwt";
import bcrypt from "bcrypt";
import {
  ICryptService,
  IJwtokenService,
} from "../../application/ports/index.js";

export const makeJwtokenService = (deps: { jwt: JWT }): IJwtokenService => {
  const { jwt } = deps;

  return {
    sign: (payload: object) => {
      return jwt.sign(payload);
    },
  };
};

export const makeCryptService = (): ICryptService => {
  return {
    hash: async (plain: string) => {
      return await bcrypt.hash(plain, 10);
    },
    compare: async (plain: string, hash: string) => {
      return await bcrypt.compare(plain, hash);
    },
  };
};
