import { type FastifyMongoObject } from "@fastify/mongodb";
import { UserRepository } from "../infra/user.repository.js";
import { LoginService } from "./login/login.service.js";
import { RegisterService } from "./register/register.service.js";

export class ServiceFactory {
  constructor(private readonly mongo: FastifyMongoObject) {}

  #createUserRepository() {
    return new UserRepository(this.mongo);
  }

  createRegisterService() {
    return new RegisterService(this.#createUserRepository());
  }

  createLoginService() {
    return new LoginService();
  }
}
