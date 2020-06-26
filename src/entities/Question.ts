export interface IQuestion {
  statement: string;
  answer: string;
  penalty: number;
}


export class Question implements IQuestion {

  public statement: string;
  public answer: string;
  public penalty: number;


  constructor(
      statement?: string,
      answer?: string,
      penalty?: number,
  ) {
    this.statement = statement || '';
    this.answer = answer || '';
    this.penalty = penalty || -1;
  }
}
