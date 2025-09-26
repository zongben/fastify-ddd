import bcrypt from "bcrypt";

export class Password {
  private constructor(readonly hash: string) {}

  static create(plain: string): Password {
    const hash = bcrypt.hashSync(plain, 10);
    return new Password(hash);
  }

  static fromHash(hash: string) {
    return new Password(hash);
  }

  matches(plain: string): boolean {
    return bcrypt.compareSync(plain, this.hash);
  }
}

export class User {
  readonly id: string;
  readonly account: string;
  readonly password: Password;
  readonly username: string;

  constructor(props: {
    id: string;
    account: string;
    password: Password;
    username: string;
  }) {
    this.id = props.id;
    this.account = props.account;
    this.password = props.password;
    this.username = props.username;
  }
}
