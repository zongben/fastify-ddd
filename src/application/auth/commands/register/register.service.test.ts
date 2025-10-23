import { IUserRepository } from "../../../../infra/user.repository.js";
import { assert, beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterCommand, RegisterService } from "./register.service.js";
import { Password, User } from "../../../../domain/user.domain.js";
import { ERROR_CODES } from "../../../error.code.js";
import { matchResult } from "../../../service.response.js";

let mockUserRepository: IUserRepository;

describe("RegisterService", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("When user is exists", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({} as User);

    const service = new RegisterService(mockUserRepository);
    const result = await service.handle({} as RegisterCommand);

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

    const service = new RegisterService(mockUserRepository);
    const result = await service.handle({
      account: "account",
      username: "username",
      password: "password",
    } as RegisterCommand);

    expect(result.isSuccess).toEqual(true);

    matchResult(result, {
      ok: (v) => {
        expect(v).instanceof(User);
        expect(v.password).toEqual(Password.fromHash(v.password.hash))
      },
      err: {
        [ERROR_CODES.ACCOUNT_IS_USED]: () => {
          assert.fail("Should not reach ACCOUNT_IS_USED");
        },
      },
    });
  });
});
