import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, OK} from 'http-status-codes';

import QuizDao from '@daos/Quiz/QuizDao';
import {
  invalidJson,
  paramMissingError,
  passwordsDoNotMatchErr, quizContentFieldMissingErr,
  quizContentLengthErr,
  userNotFoundErr
} from '@shared/constants';
import {adminMW} from './middleware';
import {comparePass, hashPwd} from '@shared/functions';
import {IQuizContent} from '@entities/QuizContent';


// Init shared
const router = Router().use(adminMW);
const quizDao = new QuizDao();


/******************************************************************************
 *                      Get All Quizzes - "GET /api/quizzes/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const quizzes = await quizDao.getAll();
  return res.status(OK).json({quizzes});
});


/******************************************************************************
 *                       Add One - "POST /api/quizzes/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  // Check parameters
  const { quiz } = req.body;
  if (!quiz) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Check if json is of type QuizContent
  let quizContent: IQuizContent[];
  try {
    quizContent = JSON.parse(quiz.content);
    // console.log(Object.keys(quizContent).length);
    if (Object.keys(quizContent).length === 0) {
      return res.status(BAD_REQUEST).json({
        error: quizContentLengthErr,
      });
    }
    // console.log(quizContent);
    for (const question of quizContent) {
      // console.log(question);
      for (const field of ['question', 'answers', 'correctAnswer', 'penalty']) {
        if (!(field in question)) {
          // console.log(field);
          return res.status(BAD_REQUEST).json({
            error: quizContentFieldMissingErr,
          });
        }
      }
    }
    quiz.content = JSON.stringify(quizContent);
  } catch (err) {
    return res.status(BAD_REQUEST).json({
      error: invalidJson,
    });
  }

  // Add new quiz
  await quizDao.add(quiz.name, quiz.content);
  return res.status(CREATED).json({});
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
