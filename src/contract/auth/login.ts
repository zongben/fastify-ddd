import Type, { type Static } from "typebox";
import { AuthSchema } from "./auth.contract";
import { ErrorResponse, OkResponse } from "../base.contract";
import { ERROR_CODES } from "../../application/error.code";

const body = Type.Object({
  account: Type.String(),
  password: Type.String(),
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
    200: OkResponse(reply),
    401: ErrorResponse(ERROR_CODES.LOGIN_FAILED),
  },
};
