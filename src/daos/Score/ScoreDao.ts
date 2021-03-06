import {IScore} from '../../entities/Score';
import {DbDao} from '../Db/DbDao';


export interface IScoreDao {
  getOne: (id: number) => Promise<IScore | null>;
  getForQuizAndUser: (quizId: number, userId: number) => Promise<IScore[]>
  getAllForUser: (userId: number) => Promise<IScore[]>;
  getAll: () => Promise<IScore[]>;
  add: (quizId: number, userId: number, result: number, statistics: string) => Promise<void>;
}

class ScoreDao extends DbDao implements IScoreDao {


  /**
   * @param id
   */
  public async getOne(id: number): Promise<IScore | null> {
    try {
      const stmt = 'SELECT * FROM scores WHERE id = ?';
      const score = await super.promisifiedGet(stmt, [id]);
      return score !== undefined ? score : null;
    } catch (err) {
      throw err;
    }
  }


  /**
   * @param userId
   */
  public async getAllForUser(userId: number): Promise<IScore[]> {
    try {
      const stmt = 'SELECT * FROM scores WHERE userId = ?';
      const scores = await super.promisifiedAll(stmt, [userId]);
      return scores !== undefined ? scores : [];
    } catch (err) {
      throw err;
    }
  }


  /**
   * @param quizId
   * @param userId
   */
  public async getForQuizAndUser(quizId: number, userId: number): Promise<IScore[]> {
    try {
      const stmt = 'SELECT * FROM scores WHERE quizId = ? AND userId = ?';
      const scores = await super.promisifiedAll(stmt, [quizId, userId]);
      return scores !== undefined ? scores : [];
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   */
  public async getAll(): Promise<IScore[]> {
    try {
      const stmt = 'SELECT * FROM scores';
      const scores = await super.promisifiedAll(stmt);
      return scores !== undefined ? scores : [];
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   * @param quizId
   * @param userId
   * @param result
   * @param statistics
   */
  public async add(quizId: number, userId: number, result: number, statistics: string): Promise<void> {
    try {
      const stmt = 'INSERT INTO scores (quizId, userId, result, statistics) VALUES (?, ?, ?, ?)'
      await super.promisifiedRun(stmt, [quizId, userId, result, statistics]);
    } catch (err) {
      throw err;
    }
  }
}

export default ScoreDao;
