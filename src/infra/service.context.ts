import { JWT } from "@fastify/jwt";
import { ITokenService } from "../application/services/index.js";

export const makeTokenService = (jwt: JWT): ITokenService => {
  return {
    sign: (payload: object) => {
      return jwt.sign(payload);
    },
  };
};
