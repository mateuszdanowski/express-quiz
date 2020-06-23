import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';

import ScoreDao from '@daos/Score/ScoreDao';
import {paramMissingError} from '@shared/constants';
import {adminMW} from './middleware';


// Init shared
const router = Router().use(adminMW);
const scoreDao = new ScoreDao();


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
  const {score} = req.body;
  if (!score) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // TODO

  // Add new score
  await scoreDao.add(score.quizId, score.result);
  return res.status(CREATED).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
