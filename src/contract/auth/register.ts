import Type from "typebox";
import { ApiResponse } from "../base.contract.js";

const body = Type.Object({
  account: Type.String(),
  password: Type.String(),
  username: Type.String(),
});

const reply = Type.Object({
  id: Type.String(),
  account: Type.String(),
});

export const RegisterSchema = {
  body,
  response: {
    200: ApiResponse(reply),
  },
};
