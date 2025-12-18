import Type, { type Static } from "typebox";
import { AuthSchema } from "./auth.contract.js";
import { ERROR_CODES } from "../../application/error.code.js";
import { makeErrSchema, makeOkSchema } from "../index.js";

const body = Type.Object({
  account: Type.String({
    minLength: 1,
  }),
  password: Type.String({
    minLength: 1,
  }),
  username: Type.String({
    minLength: 1,
  }),
});

const reply = Type.Object({
  id: Type.String(),
  account: Type.String(),
});

export type RegisterReply = Static<typeof reply>;

export const RegisterSchema = {
  ...AuthSchema,
  description: "Register a new user",
  body,
  response: {
    200: makeOkSchema(reply),
    409: makeErrSchema([ERROR_CODES.ACCOUNT_IS_USED]),
  },
};
