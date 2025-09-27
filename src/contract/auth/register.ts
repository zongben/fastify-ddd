import Type from "typebox";

const body = Type.Object({
  account: Type.String(),
  password: Type.String(),
  username: Type.String(),
});

export const RegisterSchema = {
  body,
};
