export interface IUser {
  id: number;
  username: string;
  pwdHash: string;
}

export class User implements IUser {

  public id: number;
  public username: string;
  public pwdHash: string;


  constructor(
      id?: number,
      username?: string,
      pwdHash?: string,
  ) {
    this.id = id || -1;
    this.username = username || '';
    this.pwdHash = pwdHash || '';
  }
}
