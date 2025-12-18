import { type FastifyInstance, type FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { Err } from "../contract/responses.js";

declare module "fastify" {
  interface FastifyReply {
    OK<T>(data: T): FastifyReply;
    Conflict(err: Err): FastifyReply;
    Unauthorized(err: Err): FastifyReply;
  }
}

export const replyHttpPlugin = fp((instance: FastifyInstance) => {
  instance.decorateReply("OK", function <T>(this: FastifyReply, data: T) {
    return this.status(200).send({ data });
  });

  instance.decorateReply("Conflict", function (this: FastifyReply, err: Err) {
    return this.status(409).send(err);
  });

  instance.decorateReply(
    "Unauthorized",
    function (this: FastifyReply, err: Err) {
      return this.status(401).send(err);
    },
  );
});
