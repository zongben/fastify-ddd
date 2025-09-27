import { type FastifyInstance, type FastifyReply } from "fastify";

export abstract class BaseController {
  protected abstract routes(fastify: FastifyInstance): void;

  plugin = async (fastify: FastifyInstance) => {
    this.routes(fastify);
  };
}

export class Reply {
  static OK<T>(reply: FastifyReply, data: T) {
    reply.statusCode = 200;
    return {
      messageCode: "SUCCESS",
      data,
    };
  }

  static Conflict(reply: FastifyReply, messageCode: string) {
    reply.statusCode = 409;
    return {
      messageCode,
    };
  }

  static Unauthorized(reply: FastifyReply, messageCode: string) {
    reply.statusCode = 401;
    return {
      messageCode,
    };
  }
}
