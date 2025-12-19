import { type FastifyInstance, type FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { Err } from "../contract/responses.js";

declare module "fastify" {
  interface FastifyReply {
    OK<T>(data: T): FastifyReply;
    Created<T>(data: T): FastifyReply;
    NoContent<T>(data: T): FastifyReply;
    BadRequest(err: Err): FastifyReply;
    Unauthorized(err: Err): FastifyReply;
    Forbidden(err: Err): FastifyReply;
    NotFound(err: Err): FastifyReply;
    Conflict(err: Err): FastifyReply;
    Gone(err: Err): FastifyReply;
    Locked(err: Err): FastifyReply;
  }
}

export const replyHttpPlugin = fp((instance: FastifyInstance) => {
  instance.decorateReply("OK", function <T>(this: FastifyReply, data: T) {
    return this.status(200).send({ data });
  });

  instance.decorateReply("Created", function <T>(this: FastifyReply, data: T) {
    return this.status(201).send({ data });
  });

  instance.decorateReply("NoContent", function <
    T,
  >(this: FastifyReply, data: T) {
    return this.status(204).send({ data });
  });

  instance.decorateReply("BadRequest", function (this: FastifyReply, err: Err) {
    return this.status(400).send(err);
  });

  instance.decorateReply(
    "Unauthorized",
    function (this: FastifyReply, err: Err) {
      return this.status(401).send(err);
    },
  );

  instance.decorateReply("Forbidden", function (this: FastifyReply, err: Err) {
    return this.status(403).send(err);
  });

  instance.decorateReply("NotFound", function (this: FastifyReply, err: Err) {
    return this.status(404).send(err);
  });

  instance.decorateReply("Conflict", function (this: FastifyReply, err: Err) {
    return this.status(409).send(err);
  });

  instance.decorateReply("Gone", function (this: FastifyReply, err: Err) {
    return this.status(410).send(err);
  });

  instance.decorateReply("Locked", function (this: FastifyReply, err: Err) {
    return this.status(423).send(err);
  });
});
