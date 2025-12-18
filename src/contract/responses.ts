import { FastifyReply } from "fastify";
import { ERROR_CODES } from "../application/error.code.js";
import { TSchema, Type } from "@fastify/type-provider-typebox";

export const makeOkSchema = <T extends TSchema>(data: T) => {
  return Type.Object({
    data,
  } as OK<T>);
};

export const makeErrSchema = (codes: ERROR_CODES[]) => {
  return Type.Object({
    code: Type.Union(codes.map((err) => Type.String({ default: err }))),
    message: Type.String(),
  });
};

export type OK<T> = {
  data: T;
};

export type Err = {
  code: string;
  message: string;
};

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
