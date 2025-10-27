import { type FastifyInstance, type FastifyReply } from "fastify";
import fp from "fastify-plugin";

class OkResponse<T> {
  messageCode: string = "SUCCESSED";
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

class ErrorResponse {
  messageCode: string;

  constructor(messageCode: string) {
    this.messageCode = messageCode;
  }
}

declare module "fastify" {
  interface FastifyReply {
    OK<T = any>(data: T): FastifyReply;
    Conflict(messageCode: string): FastifyReply;
    Unauthorized(messageCode: string): FastifyReply;
  }
}

export const replyPlugin = fp((instance: FastifyInstance) => {
  instance.decorateReply("OK", function <T>(this: FastifyReply, data: T) {
    return this.status(200).send(new OkResponse(data));
  });

  instance.decorateReply(
    "Conflict",
    function (this: FastifyReply, messageCode: string) {
      return this.status(409).send(new ErrorResponse(messageCode));
    },
  );

  instance.decorateReply(
    "Unauthorized",
    function (this: FastifyReply, messageCode: string) {
      return this.status(401).send(new ErrorResponse(messageCode));
    },
  );
});
