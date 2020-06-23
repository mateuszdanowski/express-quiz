import {IScore} from '@entities/Score';
import {DbDao} from '../Db/DbDao';


export interface IScoreDao {
  getOne: (id: number) => Promise<IScore | null>;
  getAll: () => Promise<IScore[]>;
  add: (quizId: number, result: string) => Promise<void>;
  update: (score: IScore) => Promise<void>;
  delete: (id: number) => Promise<void>;
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
   * @param result
   */
  public async add(quizId: number, result: string): Promise<void> {
    try {
      const stmt = 'INSERT INTO scores (quizId, result) VALUES (?, ?)'
      await super.promisifiedRun(stmt, [quizId, result]);
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   * @param score
   */
  public async update(score: IScore): Promise<void> {
    // TODO
    return {} as any;
  }


  /**
   *
   * @param id
   */
  public async delete(id: number): Promise<void> {
    // TODO
    return {} as any;
  }
}

export default ScoreDao;
