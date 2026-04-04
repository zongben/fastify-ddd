import { FastifyReply } from "fastify";
import { ERROR_CODES } from "../application/error.code.js";

export const errResponse = (reply: FastifyReply) => ({
  [ERROR_CODES.LOGIN_FAILED]: (e: string, meta?: unknown) => {
    reply.Unauthorized({
      code: e,
      meta,
      message: "account or password is wrong",
    });
  },
  [ERROR_CODES.ACCOUNT_IS_USED]: (e: string, meta?: unknown) =>
    reply.Conflict({
      code: e,
      meta,
      message: "account is used",
    }),
});
