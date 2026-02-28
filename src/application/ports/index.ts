export interface IJwtokenService {
  sign(payload: object): string;
}

export interface ICryptService {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
