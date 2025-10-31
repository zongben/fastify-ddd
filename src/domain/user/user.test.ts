import { describe, expect, test } from "vitest";
import { makeUser, makeUserEntity } from "./user.domain.js";
import { crypt, uuid } from "../../utils/index.js";

describe("User domain", () => {
  test("ChangeUserName", () => {
    const mockUser = makeUser({
      id: uuid(),
      account: "account",
      hashedPwd: crypt.hash("some_password"),
      username: "username",
    });

    const entity = makeUserEntity(mockUser).changeUserName("new_username");

    expect(entity.value().username).toBe("new_username");
  });
});
