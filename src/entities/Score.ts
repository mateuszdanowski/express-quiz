import {Statistic} from '@entities/Statistic';


export interface IScore {
  id: number;
  quizId: number;
  userId: number;
  result: number;
  statistics: Statistic[];
}

export class Score implements IScore {

  public id: number;
  public quizId: number;
  public userId: number;
  public result: number;
  public statistics: Statistic[];


  constructor(
      idOrScore?: number | IScore,
      quizId?: number,
      userId?: number,
      result?: number,
      statistics?: Statistic[],
  ) {
    if (typeof idOrScore === 'number' || typeof idOrScore === 'undefined') {
      this.id = idOrScore || -1;
      this.quizId = quizId || -1;
      this.userId = userId || -1;
      this.result = result || -1;
      this.statistics = statistics || [];
    } else {
      this.id = idOrScore.id;
      this.quizId = idOrScore.quizId;
      this.userId = idOrScore.userId;
      this.result = idOrScore.result;
      this.statistics = idOrScore.statistics;
    }
  }

}
