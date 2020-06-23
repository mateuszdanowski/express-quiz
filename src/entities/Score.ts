export interface IScore {
  id: number;
  quizId: number;
  result: number;
}

export class Score implements IScore {

  public id: number;
  public quizId: number;
  public result: number;


  constructor(
      idOrScore?: number | IScore,
      quizId?: number,
      result?: number,
  ) {
    if (typeof idOrScore === 'number' || typeof idOrScore === 'undefined') {
      this.id = idOrScore || -1;
      this.quizId = quizId || -1;
      this.result = result || 0;
    } else {
      this.id = idOrScore.id;
      this.quizId = idOrScore.quizId;
      this.result = idOrScore.result;
    }
  }
}
