import {IQuiz} from '../../entities/Quiz';
import {DbDao} from '../Db/DbDao';


export interface IQuizDao {
  getOne: (name: string) => Promise<IQuiz | null>;
  getOneById: (id: number) => Promise<IQuiz | null>;
  getAll: () => Promise<IQuiz[]>;
  add: (name: string, questions: string) => Promise<void>;
}

class QuizDao extends DbDao implements IQuizDao {


  /**
   * @param name
   */
  public async getOne(name: string): Promise<IQuiz | null> {
    try {
      const stmt = 'SELECT * FROM quizzes WHERE name = ?';
      const quiz = await super.promisifiedGet(stmt, [name]);
      return quiz !== undefined ? quiz : null;
    } catch (err) {
      throw err;
    }
  }


  /**
   * @param id
   */
  public async getOneById(id: number): Promise<IQuiz | null> {
    try {
      const stmt = 'SELECT * FROM quizzes WHERE id = ?';
      const quiz = await super.promisifiedGet(stmt, [id]);
      if (quiz !== undefined) {
        quiz.questions = JSON.parse(quiz.questions);
      }
      return quiz !== undefined ? quiz : null;
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   */
  public async getAll(): Promise<IQuiz[]> {
    try {
      const stmt = 'SELECT * FROM quizzes';
      const quizzes = await super.promisifiedAll(stmt);
      return quizzes !== undefined ? quizzes : [];
    } catch (err) {
      throw err;
    }
  }


  /**
   *
   * @param name
   * @param questions
   */
  public async add(name: string, questions: string): Promise<void> {
    try {
      const stmt = 'INSERT INTO quizzes (name, questions) VALUES (?, ?)'
      await super.promisifiedRun(stmt, [name, questions]);
    } catch (err) {
      throw err;
    }
  }
}

export default QuizDao;
