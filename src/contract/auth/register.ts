import Type, { type Static } from "typebox";
import { OkResponse, ErrorResponse } from "../base.contract.js";
import { AuthSchema } from "./auth.contract.js";
import { ERROR_CODES } from "../../application/error.code.js";

const body = Type.Object({
  account: Type.String(),
  password: Type.String(),
  username: Type.String(),
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
    200: OkResponse(reply),
    409: ErrorResponse(ERROR_CODES.ACCOUNT_IS_USED),
  },
};
