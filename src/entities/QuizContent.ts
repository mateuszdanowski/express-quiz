export interface IQuizContent {
  question: string;
  answers: string[];
  correctAnswer: string;
  penalty: number;
}

export class QuizContent implements IQuizContent {

  public question: string;
  public answers: string[];
  public correctAnswer: string;
  public penalty: number;


  constructor(
      questionOrQuizContent?: string | IQuizContent,
      answers?: string[],
      correctAnswer?: string,
      penalty?: number,
  ) {
    if (typeof questionOrQuizContent === 'string' || typeof questionOrQuizContent === 'undefined') {
      this.question = questionOrQuizContent || '';
      this.answers = answers || [];
      this.correctAnswer = correctAnswer || '';
      this.penalty = penalty || 0;
    } else {
      this.question = questionOrQuizContent.question;
      this.answers = questionOrQuizContent.answers;
      this.correctAnswer = questionOrQuizContent.correctAnswer;
      this.penalty = questionOrQuizContent.penalty;
    }
  }
}
