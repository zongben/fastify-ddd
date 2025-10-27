import { RegisterService } from "./auth/commands/register/register.service.js";
import { LoginService } from "./auth/commands/login/login.service.js";
import { RepositoryFactory } from "../infra/repository.factory.js";

export class ServiceFactory {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  createRegisterService() {
    return new RegisterService(this.repositoryFactory.createUserRepository());
  }

  createLoginService() {
    return new LoginService(this.repositoryFactory.createUserRepository());
  }
}
