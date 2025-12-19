import { Validator } from "typebox/compile";
import { v7 } from "uuid";

export const uuid = () => {
  return v7();
};

export const assertValid = (validator: Validator, value: unknown) => {
  if (!validator.Check(value)) {
    throw Error(JSON.stringify(validator.Errors(value)));
  }
};
