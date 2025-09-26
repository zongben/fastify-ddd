import { S } from "fluent-json-schema";

export const registerBodySchema = S.object()
  .prop("account", S.string().required())
  .prop("password", S.string().required())
  .prop("username", S.string().required());

export const registerSchema = {
  body: registerBodySchema,
};
