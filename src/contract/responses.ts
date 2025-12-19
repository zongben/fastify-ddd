import { FastifyReply } from "fastify";
import { ERROR_CODES } from "../application/error.code.js";
import { TSchema, Type } from "@fastify/type-provider-typebox";

export const makeOkSchema = <T extends TSchema>(data: T) => {
  return Type.Object({
    data,
  });
};

export const makeErrSchema = (codes: ERROR_CODES[]) => {
  return Type.Object({
    code: Type.Union(codes.map((err) => Type.String({ default: err }))),
    meta: Type.Optional(Type.Unknown()),
    message: Type.String(),
  });
};

export type OK<T> = {
  data: T;
};

export type Err = {
  code: string;
  meta?: unknown;
  message: string;
};

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
