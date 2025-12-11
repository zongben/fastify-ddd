import { assert, beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterCommand, makeRegisterHandler } from "./register.handler.js";
import { makeUserRepository } from "../../../../../infra/user.repository.js";
import { matchResult } from "../../../../../shared/result.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { crypt } from "../../../../../utils/index.js";
import { User } from "../../../../../domain/user/user.domain.js";

let mockUserRepository: ReturnType<typeof makeUserRepository>;

describe("RegisterHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as ReturnType<typeof makeUserRepository>;
  });

  test("When user is exists", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({} as User);

    const handler = makeRegisterHandler({
      userRepository: mockUserRepository,
    });
    const result = await handler({} as RegisterCommand);

    matchResult(result, {
      ok: () => {
        assert.fail("Should not success");
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: (e) => {
          expect(e).toEqual(ERROR_CODES.ACCOUNT_IS_USED);
        },
      },
    });
  });

  test("Success", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(null);
    mockUserRepository.createUser = vi.fn();

    const handler = makeRegisterHandler({
      userRepository: mockUserRepository,
    });
    const result = await handler({
      account: "account",
      username: "username",
      password: "password",
    } as RegisterCommand);

    expect(result.ok).toEqual(true);

    matchResult(result, {
      ok: async (v) => {
        expect(await crypt.compare("password", v.hashedPwd)).toBe(true);
        expect(await crypt.compare("wrong", v.hashedPwd)).toBe(false);
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: () => {
          assert.fail("Should not reach ACCOUNT_IS_USED");
        },
      },
    });
  });
});
