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
      usernameOrUser?: string | IUser,
      pwdHash?: string,
      id?: number,
  ) {
    if (typeof usernameOrUser === 'string' || typeof usernameOrUser === 'undefined') {
      this.username = usernameOrUser || '';
      this.pwdHash = pwdHash || '';
      this.id = id || -1;
    } else {
      this.username = usernameOrUser.username;
      this.pwdHash = usernameOrUser.pwdHash;
      this.id = usernameOrUser.id;
    }
  }
}
