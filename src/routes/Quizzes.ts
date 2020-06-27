import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';

import QuizDao from '../daos/Quiz/QuizDao';
import {
  invalidJson,
  paramMissingError,
  quizQuestionsFieldMissingErr,
  quizQuestionsLengthErr,
  invalidPenaltyValueErr
} from '../shared/constants';
import {checkAuth} from './middleware';
import {Question} from '../entities/Question';
import {IQuizWithFinishInfo} from '../entities/QuizWithFinishInfo';
import ScoreDao from '../daos/Score/ScoreDao';

// Init shared
const router = Router().use(checkAuth);
const quizDao = new QuizDao();
const scoreDao = new ScoreDao();


/******************************************************************************
 *                      Get All Quizzes - "GET /api/quizzes/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const quizzes = await quizDao.getAll();
  return res.status(OK).json({quizzes});
});


/******************************************************************************
 *         Get Current Quiz For User - "GET /api/quizzes/oneForUser"
 ******************************************************************************/

router.get('/oneForUser', async (req: Request, res: Response) => {
  const quiz = await quizDao.getOneById(req.session!.quizId);
  return res.status(OK).json({quiz, sendDataTime: new Date().getTime()});
});


/******************************************************************************
 *      Get All Available Quizzes For User - "GET /api/quizzes/allForUser"
 ******************************************************************************/

router.get('/allForUser', async (req: Request, res: Response) => {
  const userId = req.session!.passport.user;
  const quizzes = await quizDao.getAll();
  const quizzesForUser = await Promise.all(
      quizzes.map(async quiz => {
        const quizWithFinishInfo = quiz as IQuizWithFinishInfo;
        const scoresForQuizAndUser = await scoreDao.getForQuizAndUser(quiz.id, userId);
        quizWithFinishInfo.finished = scoresForQuizAndUser.length > 0;
        return quizWithFinishInfo;
      })
  );

  return res.status(OK).json({quizzesForUser});
});


/******************************************************************************
 *                       Add One - "POST /api/quizzes/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  // Check parameters
  const {quiz} = req.body;
  if (!quiz) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Check if json is of type Question[]
  let questions: Question[];
  try {
    questions = JSON.parse(quiz.questions);
    if (Object.keys(questions).length === 0) {
      return res.status(BAD_REQUEST).json({
        error: quizQuestionsLengthErr,
      });
    }
    const penalties: number[] = [];
    for (const question of questions) {
      for (const field of ['statement', 'answer', 'penalty']) {
        if (!(field in question)) {
          return res.status(BAD_REQUEST).json({
            error: quizQuestionsFieldMissingErr,
          });
        }
      }
      penalties.push(question.penalty);
    }
    const isMinBelowZero = (list: number[]) => {
      return Math.min(...list) < 0;
    };
    if (isMinBelowZero(penalties)) {
      return res.status(BAD_REQUEST).json({
        error: invalidPenaltyValueErr,
      });
    }
    quiz.questions = JSON.stringify(questions);
  } catch (err) {
    return res.status(BAD_REQUEST).json({
      error: invalidJson,
    });
  }
  // Add new quiz
  await quizDao.add(quiz.name, quiz.questions);
  return res.status(CREATED).json({});
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
