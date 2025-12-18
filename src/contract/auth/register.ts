import Type, { type Static } from "typebox";
import { AuthSchema } from "./auth.contract.js";
import { ERROR_CODES } from "../../application/error.code.js";
import {
  FastifyRequestTypeBox,
  makeErrSchema,
  makeOkSchema,
} from "../index.js";
import { HookHandlerDoneFunction } from "fastify";

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

export const registerPreValidation = (
  req: FastifyRequestTypeBox<typeof RegisterSchema>,
  _: any,
  done: HookHandlerDoneFunction,
) => {
  if (req.body.account && typeof req.body.account === "string") {
    req.body.account = req.body.account.trim();
  }
  if (req.body.password && typeof req.body.password === "string") {
    req.body.password = req.body.password.trim();
  }
  if (req.body.username && typeof req.body.username === "string") {
    req.body.username = req.body.username.trim();
  }
  done();
};
