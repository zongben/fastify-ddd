import { FastifyReply } from "fastify";
import { ERROR_CODES } from "../application/error.code.js";

export const handleError = (reply: FastifyReply) => ({
  [ERROR_CODES.LOGIN_FAILED]: (e: string) => reply.Unauthorized(e),
  [ERROR_CODES.ACCOUNT_IS_USED]: (e: string) => reply.Conflict(e),
});
