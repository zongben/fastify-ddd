import { IUserRepository } from "../../../../infra/user.repository.js";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterCommand, RegisterService } from "./register.service.js";
import { User } from "../../../../domain/user.domain.js";
import { ERROR_CODES } from "../../../error.code.js";

let mockUserRepository: IUserRepository;

describe("RegisterService", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("When user is exists", async () => {
    mockUserRepository.getUserByAccount = vi.fn().mockResolvedValue({} as User);

    const service = new RegisterService(mockUserRepository);
    const result = await service.handle({} as RegisterCommand);

    expect(result.isSuccess).toEqual(false);
    if (!result.isSuccess) {
      expect(result.error).toEqual(ERROR_CODES.ACCOUNT_IS_USED);
    }
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
  });
});
