import { assert, beforeEach, describe, expect, test, vi } from "vitest";
import { matchResult } from "../../../../../shared/result.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { IUserRepository } from "../../../../persistences.js";
import { User } from "../../../../../domain/user.domain.js";
import { ICryptService } from "../../../../ports.js";
import { makeRegisterHandler, RegisterCommand } from "../register.handler.js";

let mockUserRepository: IUserRepository;
let mockCryptService: ICryptService;

describe("RegisterHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
    mockCryptService = {} as ICryptService;
  });

  test("When user is exists", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({} as User);

    const handler = makeRegisterHandler({
      userRepository: mockUserRepository,
      cryptService: mockCryptService,
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
    mockCryptService.hash = vi.fn().mockResolvedValue("hashedPwd");

    const handler = makeRegisterHandler({
      userRepository: mockUserRepository,
      cryptService: mockCryptService,
    });
    const result = await handler({
      account: "account",
      username: "username",
      password: "password",
    } as RegisterCommand);

    matchResult(result, {
      ok: (v) => {
        assert.ok(v);
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: () => {
          assert.fail("Should not reach ACCOUNT_IS_USED");
        },
      },
    });
  });
});
