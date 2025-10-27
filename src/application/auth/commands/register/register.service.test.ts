import { userRepository } from "../../../../infra/user.repository.js";
import { assert, beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterCommand, registerService } from "./register.service.js";
import { Password, User } from "../../../../domain/user.domain.js";
import { ERROR_CODES } from "../../../error.code.js";
import { matchResult } from "../../../service.response.js";

let mockUserRepository: ReturnType<typeof userRepository>;

describe("RegisterService", () => {
  beforeEach(() => {
    mockUserRepository = {} as ReturnType<typeof userRepository>;
  });

  test("When user is exists", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({} as User);

    const service = registerService({
      userRepository: mockUserRepository,
    });
    const result = await service({} as RegisterCommand);

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

    const service = registerService({
      userRepository: mockUserRepository,
    });
    const result = await service({
      account: "account",
      username: "username",
      password: "password",
    } as RegisterCommand);

    expect(result.isSuccess).toEqual(true);

    matchResult(result, {
      ok: (v) => {
        expect(v).instanceof(User);
        expect(v.password).toEqual(Password.fromHash(v.password.hash));
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: () => {
          assert.fail("Should not reach ACCOUNT_IS_USED");
        },
      },
    });
  });
});
