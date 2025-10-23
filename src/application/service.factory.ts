import { type FastifyMongoObject } from "@fastify/mongodb";
import { UserRepository } from "../infra/user.repository.js";
import { RegisterService } from "./auth/commands/register/register.service.js";
import { LoginService } from "./auth/commands/login/login.service.js";

export class ServiceFactory {
  constructor(private readonly mongo: FastifyMongoObject) {}

  #createUserRepository() {
    return new UserRepository(this.mongo);
  }

  createRegisterService() {
    return new RegisterService(this.#createUserRepository());
  }

  createLoginService() {
    return new LoginService(this.#createUserRepository());
  }
}
