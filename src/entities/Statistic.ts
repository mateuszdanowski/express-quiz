import {Question} from '@entities/Question';

export interface IStatistic {
  question: Question;
  usersAnswer: string;
  timeSpent: number;

}

export class Statistic implements IStatistic {

  public question: Question;
  public usersAnswer: string;
  public timeSpent: number;


  constructor(
      question?: Question,
      usersAnswer?: string,
      timeSpent?: number,
  ) {
    this.question = question || {statement: '', answer: '', penalty: -1};
    this.usersAnswer = usersAnswer || '';
    this.timeSpent = timeSpent || -1;
  }
}
