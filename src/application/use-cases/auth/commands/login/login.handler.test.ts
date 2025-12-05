import { beforeEach, describe, expect, test, vi, assert } from "vitest";
import { LoginCommand, makeLoginHandler } from "./login.handler.js";
import { IUserRepository } from "../../../../../infra/user.repository.js";
import { matchResult } from "../../../../../shared/result.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { crypt } from "../../../../../utils/index.js";
import { makeUser, User } from "../../../../../domain/user/user.domain.js";
import { JWT } from "@fastify/jwt";

let mockUserRepository: IUserRepository;
let mockJWT: JWT

describe("LoginService", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
    mockJWT = {} as JWT;
  });

  test("When user not found", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(null);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
      jwt: mockJWT
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
      hashedPwd: crypt.hash("some_password"),
    } as User);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
      jwt: mockJWT
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
    const mockUser = makeUser({
      id: "",
      account: "",
      hashedPwd: crypt.hash("some_password"),
      username: "",
    });
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(mockUser);
    mockJWT.sign = vi.fn(() => "token")

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
      jwt: mockJWT
    });
    const result = await handler({
      password: "some_password",
    } as LoginCommand);

    matchResult(result, {
      ok: (v) => {
        expect(v).toEqual({ token: "token" });
      },
      err: {
        [ERROR_CODES.LOGIN_FAILED]: () => {
          assert.fail("Should not reach LOGIN_FAILED");
        },
      },
    });
  });
});
