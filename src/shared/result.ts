export type OkResult<T> = {
  ok: true;
  data: T;
};

export type ErrorResult<E> = {
  ok: false;
  error: E;
};

export type OneOf<T, E> = OkResult<T> | ErrorResult<E>;

export const ok = <T>(data: T): OkResult<T> => ({ ok: true, data });
export const err = <E>(error: E): ErrorResult<E> => ({
  ok: false,
  error,
});

export const matchResult = <T, E extends string | number | symbol, R>(
  result: OneOf<T, E>,
  handlers: {
    ok: (value: T) => R;
    err: Record<E, (error: E) => R>;
  },
): R => {
  if (result.ok) {
    return handlers.ok(result.data);
  }
  const handler = handlers.err[result.error];
  return handler(result.error);
};
