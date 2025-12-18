import {
  Type,
  type TSchema,
  type TypeBoxTypeProvider,
} from "@fastify/type-provider-typebox";
import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
} from "fastify";
import { ERROR_CODES } from "../application/error.code.js";

export type FastifyTypeBox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export type FastifyRequestTypeBox<TSchema extends FastifySchema> =
  FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression,
    TSchema,
    TypeBoxTypeProvider
  >;

export type FastifyReplyTypeBox<TSchema extends FastifySchema> = FastifyReply<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>;

export const makeOkSchema = <T extends TSchema>(data: T) => {
  return Type.Object({
    data,
  } as OK<T>);
};

export const makeErrSchema = (codes: ERROR_CODES[]) => {
  return Type.Object({
    code: Type.Union(codes.map((err) => Type.String({ default: err }))),
    message: Type.String(),
  });
};

export type OK<T> = {
  data: T;
};

export type Err = {
  code: string;
  message: string;
};
