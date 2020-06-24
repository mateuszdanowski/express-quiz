import {IQuiz} from '@entities/Quiz';

export interface IQuizWithFinishInfo extends IQuiz {
  finished: boolean;
}

