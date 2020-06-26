import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';

import ScoreDao from '@daos/Score/ScoreDao';
import QuizDao from '@daos/Quiz/QuizDao';
import {paramMissingError, quizMissingError} from '@shared/constants';
import {adminMW} from './middleware';
import {Score} from '@entities/Score';
import {Statistic} from '@entities/Statistic';

// Init shared
const router = Router().use(adminMW);
const scoreDao = new ScoreDao();
const quizDao = new QuizDao();

/******************************************************************************
 *                      Get All Scores - "GET /api/scores/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const scores = await scoreDao.getAll();
  return res.status(OK).json({scores});
});


/******************************************************************************
 *                       Add One - "POST /api/scores/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  // Check parameters
  const {scoreData, receivedDataTime} = req.body;
  if (!(scoreData && receivedDataTime)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const elapsedTime = (new Date().getTime()) - receivedDataTime;

  const score = new Score();
  score.quizId = req.session!.quizId;
  score.userId = req.session!.userId;

  const quiz = await quizDao.getOneById(score.quizId);
  if (!quiz) {
    return res.status(BAD_REQUEST).json({
      error: quizMissingError,
    });
  }

  score.result = elapsedTime;
  for (let i = 0; i < scoreData.usersAnswers.length; i++) {
    if (scoreData.usersAnswers[i] !== quiz.questions[i].answer) {
      score.result += quiz.questions[i].penalty * 1000;
    }
  }
  score.result = Math.round((score.result / 1000 + Number.EPSILON) * 10) / 10;

  score.statistics = Array(scoreData.usersAnswers.length);
  for (let i = 0; i < scoreData.usersAnswers.length; i++) {
    score.statistics[i] = new Statistic();
    score.statistics[i].usersAnswer = scoreData.usersAnswers[i];
    score.statistics[i].question = quiz.questions[i];

    const timeSpentInMs = scoreData.timePercentageForEachQuestion[i] * elapsedTime;
    score.statistics[i].timeSpent = Math.round((timeSpentInMs / 1000 + Number.EPSILON) * 10) / 10;
  }

  // Add new score
  await scoreDao.add(score.quizId, score.userId, score.result, JSON.stringify(score.statistics));
  return res.status(CREATED).json({});
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
