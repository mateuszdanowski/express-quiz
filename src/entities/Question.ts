export interface IQuestion {
  id: number;
  statement: string;
  answer: string;
  penalty: number;
}


export class Question implements IQuestion {

  public id: number;
  public statement: string;
  public answer: string;
  public penalty: number;


  constructor(
      id?: number,
      statement?: string,
      answer?: string,
      penalty?: number,
  ) {
    this.id = id || -1;
    this.statement = statement || '';
    this.answer = answer || '';
    this.penalty = penalty || -1;
  }
}
