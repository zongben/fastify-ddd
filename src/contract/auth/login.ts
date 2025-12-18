import Type, { type Static } from "typebox";
import { AuthSchema } from "./auth.contract.js";
import { ERROR_CODES } from "../../application/error.code.js";
import { makeErrSchema, makeOkSchema } from "../responses.js";

const body = Type.Object({
  account: Type.String({
    minLength: 1,
  }),
  password: Type.String({
    minLength: 1,
  }),
});

const reply = Type.Object({
  token: Type.String(),
});

export type LoginReply = Static<typeof reply>;

export const LoginSchema = {
  ...AuthSchema,
  description: "Login",
  body,
  response: {
    200: makeOkSchema(reply),
    401: makeErrSchema([ERROR_CODES.LOGIN_FAILED]),
  },
};
