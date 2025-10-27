import { Password, User } from "../../../../domain/user.domain.js";
import { userRepository } from "../../../../infra/user.repository.js";
import { ERROR_CODES } from "../../../error.code.js";
import { matchResult } from "../../../service.response.js";
import { LoginCommand, loginService } from "./login.service.js";
import { beforeEach, describe, expect, test, vi, assert } from "vitest";

let mockUserRepository: ReturnType<typeof userRepository>;

describe("LoginService", () => {
  beforeEach(() => {
    mockUserRepository = {} as ReturnType<typeof userRepository>;
  });

  test("When user not found", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(null);

    const service = loginService({
      userRepository: mockUserRepository,
    });
    const result = await service({} as LoginCommand);

    matchResult(result, {
      ok: () => {
        assert.fail("Should not success");
      },
      err: {
        [ERROR_CODES.LOGIN_FAILED]: (e) => {
          expect(e).toEqual(ERROR_CODES.LOGIN_FAILED);
        },
      },
    });
  });

  test("When password is wrong", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({
      password: Password.create("some_password"),
    } as User);

    const service = loginService({
      userRepository: mockUserRepository,
    });
    const result = await service({
      password: "worng_password",
    } as LoginCommand);

    matchResult(result, {
      ok: () => {
        assert.fail("Should not success");
      },
      err: {
        [ERROR_CODES.LOGIN_FAILED]: (e) => {
          expect(e).toEqual(ERROR_CODES.LOGIN_FAILED);
        },
      },
    });
  });

  test("Success", async () => {
    const mockUser = new User({
      id: "",
      account: "",
      password: Password.create("some_password"),
      username: "",
    });
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(mockUser);

    const service = loginService({
      userRepository: mockUserRepository,
    });
    const result = await service({
      password: "some_password",
    } as LoginCommand);

    matchResult(result, {
      ok: (v) => {
        expect(v).toEqual(mockUser);
      },
      err: {
        [ERROR_CODES.LOGIN_FAILED]: () => {
          assert.fail("Should not reach LOGIN_FAILED");
        },
      },
    });
  });
});
