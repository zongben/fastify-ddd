import { FastifyMongoObject } from "@fastify/mongodb";
import { UserRepository } from "./user.repository.js";

export class RepositoryFactory {
  constructor(private readonly mongo: FastifyMongoObject) {}

  createUserRepository() {
    return new UserRepository(this.mongo);
  }
}
