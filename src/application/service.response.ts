export class OkResult<T> {
  readonly isSuccess = true;
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class ErrorResult {
  readonly isSuccess = false;
  code: string;

  constructor(code: string) {
    this.code = code;
  }
}
