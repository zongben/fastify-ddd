import type { IService } from "../service.interface.js";

export class LoginService implements IService {
  constructor() {}

  handle(account: string) {
    console.log(`login: ${account}`);
  }
}
