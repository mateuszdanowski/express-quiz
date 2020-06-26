import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import session from 'express-session'

// tslint:disable-next-line:no-var-requires
const SQLiteStore = require('connect-sqlite3')(session);

import express, {Request, Response, NextFunction} from 'express';
import {BAD_REQUEST} from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';
import {cookieProps} from '@shared/constants';
import QuizDao from '@daos/Quiz/QuizDao';
import ScoreDao from '@daos/Score/ScoreDao';

// Init express
const app = express();


/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieProps.secret));
app.use(session({
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore(),
  secret: cookieProps.secret!,
  cookie: {maxAge: 10 * 60 * 1000}
}));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});


/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const quizDao = new QuizDao();
const scoreDao = new ScoreDao();

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('/', (req: Request, res: Response) => {
  res.sendFile('login.html', {root: viewsDir});
});

app.get('/quiz', (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('quiz.html', {root: viewsDir});
  }
});

app.get('/addQuiz', (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('addQuiz.html', {root: viewsDir});
  }
});

app.get('/password', (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('password.html', {root: viewsDir});
  }
});

app.get('/scores', (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('scores.html', {root: viewsDir});
  }
});

app.get('/play', async (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    // console.log(req.session);
    const userId = req.session!.userId;
    const quizId = Number(req.query.quizId);
    // console.log(quizId, userId);
    const isFinished = (await scoreDao.getForQuizAndUser(quizId, userId)).length > 0;
    // console.log(isFinished);
    if (isFinished) {
      res.redirect('/quiz');
    }
    req.session!.quizId = quizId;
    const quiz = await quizDao.getOneById(quizId);
    res.sendFile('play.html', {root: viewsDir, quiz});
  }
});


// Export express instance
export default app;
