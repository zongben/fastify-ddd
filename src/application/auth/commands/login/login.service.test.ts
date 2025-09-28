import { Password, User } from "../../../../domain/user.domain";
import { IUserRepository } from "../../../../infra/user.repository";
import { ERROR_CODES } from "../../../error.code";
import { LoginCommand, LoginService } from "./login.service";

let mockUserRepository: IUserRepository;

describe("LoginService", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("When user not found", async () => {
    mockUserRepository.getUserByAccount = jest.fn().mockResolvedValue(null);

    const service = new LoginService(mockUserRepository);
    const result = await service.handle({} as LoginCommand);

    expect(result.isSuccess).toEqual(false);
    if (!result.isSuccess) {
      expect(result.error).toEqual(ERROR_CODES.LOGIN_FAILED);
    }
  });

  test("When password is wrong", async () => {
    const mockUser = new User({
      id: "",
      account: "",
      password: Password.create("some_password"),
      username: "",
    });
    mockUserRepository.getUserByAccount = jest.fn().mockResolvedValue(mockUser);

    const service = new LoginService(mockUserRepository);
    const result = await service.handle({
      password: "worng_password",
    } as LoginCommand);

    expect(mockUserRepository.getUserByAccount).not.toBeNull();
    expect(result.isSuccess).toEqual(false);
    if (!result.isSuccess) {
      expect(result.error).toEqual(ERROR_CODES.LOGIN_FAILED);
    }
  });

  test("Success", async () => {
    const mockUser = new User({
      id: "",
      account: "",
      password: Password.create("some_password"),
      username: "",
    });
    mockUserRepository.getUserByAccount = jest.fn().mockResolvedValue(mockUser);

    const service = new LoginService(mockUserRepository);
    const result = await service.handle({
      password: "some_password",
    } as LoginCommand);

    expect(mockUserRepository.getUserByAccount).not.toBeNull();
    expect(result.isSuccess).toEqual(true);
    if (result.isSuccess) {
      expect(result.data).toEqual(mockUser);
    }
  });
});
