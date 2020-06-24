import {Question} from '@entities/Question';

export interface IStatistic {
  question: Question;
  usersAnswer: number;
  timeSpent: number;
}

export class Statistic implements IStatistic {

  public question: Question;
  public usersAnswer: number;
  public timeSpent: number;


  constructor(
      question?: Question,
      usersAnswer?: number,
      timeSpent?: number,
  ) {
    this.question = question || {id: -1, statement: '', answer: '', penalty: -1};
    this.usersAnswer = usersAnswer || -1;
    this.timeSpent = timeSpent || -1;
  }
}
