import { LoginService } from "./login/login.service.js";
import type { IService } from "./service.interface.js";

export class ServiceFactory {
  constructor() {}

  createLoginService(): IService {
    const service = new LoginService();
    return service;
  }
}
