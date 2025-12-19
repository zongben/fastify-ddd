export type OkResult<T> = {
  ok: true;
  data: T;
};

export type ErrorResult<E, U = unknown> = {
  ok: false;
  error: {
    code: E;
    meta?: U;
  };
};

export type OneOf<T, E> = OkResult<T> | ErrorResult<E>;

export const ok = <T>(data: T): OkResult<T> => ({ ok: true, data });
export const err = <E>(code: E, meta?: unknown): ErrorResult<E> => ({
  ok: false,
  error: {
    code,
    meta,
  },
});

export const matchResult = <T, E extends string | number | symbol, R>(
  result: OneOf<T, E>,
  handlers: {
    ok: (value: T) => R;
    err: Record<E, (code: E, meta?: unknown) => R>;
  },
): R => {
  if (result.ok) {
    return handlers.ok(result.data);
  }
  const handler = handlers.err[result.error.code];
  return handler(result.error.code, result.error.meta);
};
