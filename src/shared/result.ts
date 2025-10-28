export type OkResult<T> = {
  isSuccess: true;
  data: T;
};

export type ErrorResult<E> = {
  isSuccess: false;
  error: E;
};

export type OneOf<T, E> = OkResult<T> | ErrorResult<E>;

export const ok = <T>(data: T): OkResult<T> => ({ isSuccess: true, data });
export const err = <E>(error: E): ErrorResult<E> => ({
  isSuccess: false,
  error,
});

export const matchResult = <T, E extends string | number | symbol, R>(
  result: OneOf<T, E>,
  handlers: {
    ok: (value: T) => R;
    err: Record<E, (error: E) => R>;
  },
): R => {
  if (result.isSuccess) {
    return handlers.ok(result.data);
  }
  const handler = handlers.err[result.error];
  return handler(result.error);
};
