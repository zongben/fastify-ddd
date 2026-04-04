import { describe, expect, test } from "vitest";
import { uuid } from "../../utils/index.js";
import { makeUser, makeUserEntity } from "../user.domain.js";

describe("User domain", () => {
  test("ChangeUserName", async () => {
    const mockUser = makeUser({
      id: uuid(),
      account: "account",
      hashedPwd: "hashedPwd",
      username: "username",
    });

    const entity = makeUserEntity(mockUser).changeUserName("new_username");

    expect(entity.value().username).toBe("new_username");
  });
});
