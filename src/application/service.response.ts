export class OkResponse<T> {
  isSuccess = true;
  data: T | undefined;

  constructor(data?: T) {
    this.data = data;
  }
}

export class ErrorResponse {
  isSuccess = false;
  code: string;

  constructor(code: string) {
    this.code = code;
  }
}
