import { beforeEach, describe, expect, test, vi, assert } from "vitest";
import { matchResult } from "../../../../../shared/result.js";
import { ERROR_CODES } from "../../../../error.code.js";
import { User, makeUser } from "../../../../../domain/user.domain.js";
import { IUserRepository } from "../../../../persistences.js";
import { IJwtokenService, ICryptService } from "../../../../ports.js";
import { makeLoginHandler, LoginCommand } from "../login.handler.js";

let mockUserRepository: IUserRepository;
let mockJwtokenService: IJwtokenService;
let mockCryptService: ICryptService;

describe("LoginHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
    mockJwtokenService = {} as IJwtokenService;
    mockCryptService = {} as ICryptService;
  });

  test("When user not found", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(null);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
      jwtokenService: mockJwtokenService,
      cryptService: mockCryptService,
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
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({} as User);
    mockCryptService.compare = vi.fn().mockResolvedValue(false);

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
      jwtokenService: mockJwtokenService,
      cryptService: mockCryptService,
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

  test("Success", async () => {
    const mockUser = makeUser({
      id: "",
      account: "",
      hashedPwd: "",
      username: "",
    });
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue(mockUser);
    mockJwtokenService.sign = vi.fn(() => "token");
    mockCryptService.compare = vi.fn().mockResolvedValue(true)

    const handler = makeLoginHandler({
      userRepository: mockUserRepository,
      jwtokenService: mockJwtokenService,
      cryptService: mockCryptService,
    });
    const result = await handler({} as LoginCommand);

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
