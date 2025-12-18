import { FastifyReply } from "fastify";
import { ERROR_CODES } from "../application/error.code.js";

export const errResponse = (reply: FastifyReply) => ({
  [ERROR_CODES.LOGIN_FAILED]: (e: string) =>
    reply.Unauthorized({
      code: e,
      message: "account or password is wrong",
    }),
  [ERROR_CODES.ACCOUNT_IS_USED]: (e: string) =>
    reply.Conflict({
      code: e,
      message: "account is used",
    }),
});
