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
      id?: number,
      quizId?: number,
      userId?: number,
      result?: number,
      statistics?: Statistic[],
  ) {
    this.id = id || -1;
    this.quizId = quizId || -1;
    this.userId = userId || -1;
    this.result = result || -1;
    this.statistics = statistics || [];
  }
}
