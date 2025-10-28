import { beforeEach, describe, expect, test, vi, assert } from "vitest";
import { LoginCommand, makeLoginHandler } from "./login.handler.js";
import { IUserRepository } from "../../../../../infra/user.repository.js";
import { matchResult } from "../../../../../shared/result.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { User } from "../../../../../domain/user.domain.js";
import { crypto } from "../../../../../utils/index.js";

let mockUserRepository: IUserRepository;

describe("LoginService", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("When user not found", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(null);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
    });
    const result = await handler({} as LoginCommand);

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
      hashedPwd: crypto.hash("some_password"),
    } as User);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
    });
    const result = await handler({
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
    const mockUser = User.create({
      id: "",
      account: "",
      hashedPwd: crypto.hash("some_password"),
      username: "",
    });
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(mockUser);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
    });
    const result = await handler({
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
