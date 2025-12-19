import { describe, expect, test } from "vitest";
import { makeUser, makeUserEntity } from "./user.domain.js";
import { uuid } from "../../utils/index.js";

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
