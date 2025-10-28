import { type FastifyInstance, type FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { Err, OK } from "../contract/index.js";

const okResponse = <T>(data: T): OK<T> => {
  return {
    messageCode: "SUCCESS",
    data,
  };
};

const errResponse = (msg: string): Err => {
  return {
    messageCode: msg,
  };
};

declare module "fastify" {
  interface FastifyReply {
    OK<T>(data: T): FastifyReply;
    Conflict(msg: string): FastifyReply;
    Unauthorized(msg: string): FastifyReply;
  }
}

export const replyHttpPlugin = fp((instance: FastifyInstance) => {
  instance.decorateReply("OK", function <T>(this: FastifyReply, data: T) {
    return this.status(200).send(okResponse(data));
  });

  instance.decorateReply(
    "Conflict",
    function (this: FastifyReply, msg: string) {
      return this.status(409).send(errResponse(msg));
    },
  );

  instance.decorateReply(
    "Unauthorized",
    function (this: FastifyReply, msg: string) {
      return this.status(401).send(errResponse(msg));
    },
  );
});
