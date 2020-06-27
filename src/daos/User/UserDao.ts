import {IUser} from '../../entities/User';
import {DbDao} from '../Db/DbDao';


export interface IUserDao {
  getOne: (username: string) => Promise<IUser | null>;
  getOneById: (id: number) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (username: string, pwdHash: string) => Promise<void>;
  updatePwd: (username: string, pwdHash: string) => Promise<void>;
}

class UserDao extends DbDao implements IUserDao {


  /**
   * @param username
   */
  public async getOne(username: string): Promise<IUser | null> {
    try {
      const stmt = 'SELECT * FROM users WHERE username = ?';
      const user = await super.promisifiedGet(stmt, [username]);
      return user !== undefined ? user : null;
    } catch (err) {
      throw err;
    }
  }


  /**
   * @param id
   */
  public async getOneById(id: number): Promise<IUser | null> {
    try {
      const stmt = 'SELECT * FROM users WHERE id = ?';
      const user = await super.promisifiedGet(stmt, [id]);
      return user !== undefined ? user : null;
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   */
  public async getAll(): Promise<IUser[]> {
    try {
      const stmt = 'SELECT * FROM users';
      const users = await super.promisifiedAll(stmt);
      return users !== undefined ? users : [];
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   * @param username
   * @param pwdHash
   */
  public async add(username: string, pwdHash: string): Promise<void> {
    try {
      const stmt = 'INSERT INTO users (username, pwdHash) VALUES (?, ?)';
      await super.promisifiedRun(stmt, [username, pwdHash]);
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   * @param username
   * @param pwdHash
   */
  public async updatePwd(username: string, pwdHash: string): Promise<void> {
    try {
      const stmt = 'UPDATE users SET pwdHash = ? WHERE username = ?';
      await super.promisifiedRun(stmt, [pwdHash, username]);
    } catch (err) {
      throw err;
    }
  }
}

export default UserDao;
