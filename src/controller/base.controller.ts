import { type FastifyInstance } from "fastify";

export abstract class BaseController {
  protected abstract routes(fastify: FastifyInstance): void;

  plugin = async (fastify: FastifyInstance) => {
    this.routes(fastify);
  };
}
