import {Question} from '../entities/./Question';


export interface IQuiz {
  id: number;
  name: string;
  questions: Question[];
}


export class Quiz implements IQuiz {

  public id: number;
  public name: string;
  public questions: Question[];


  constructor(
      id?: number,
      name?: string,
      questions?: Question[],
  ) {
    this.id = id || -1;
    this.name = name || '';
    this.questions = questions || [];
  }
}
