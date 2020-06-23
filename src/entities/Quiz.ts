import {QuizContent} from '@entities/QuizContent';


export interface IQuiz {
  id: number;
  name: string;
  content: QuizContent[];
}


export class Quiz implements IQuiz {

  public id: number;
  public name: string;
  public content: QuizContent[];


  constructor(
      nameOrQuiz?: string | IQuiz,
      id?: number,
      content?: QuizContent[],
  ) {
    if (typeof nameOrQuiz === 'string' || typeof nameOrQuiz === 'undefined') {
      this.name = nameOrQuiz || '';
      this.id = id || -1;
      this.content = content || [];
    } else {
      this.name = nameOrQuiz.name;
      this.id = nameOrQuiz.id;
      this.content = nameOrQuiz.content;
    }
  }
}
