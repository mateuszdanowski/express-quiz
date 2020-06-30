import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import session from 'express-session'
import csurf from 'csurf';

// tslint:disable-next-line:no-var-requires
const SQLiteStore = require('connect-sqlite3')(session);

import express, {Request, Response, NextFunction} from 'express';
import {BAD_REQUEST} from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import {cookieProps} from '../src/shared/constants';
import QuizDao from '../src/daos/Quiz/QuizDao';
import ScoreDao from '../src/daos/Score/ScoreDao';
import {initialize} from '../src/shared/passport-config';
import passport from 'passport';
import {checkAuth, checkNotAuth} from './routes/middleware';


// Init express
const app = express();

// Init passport
initialize(passport);


/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieProps.secret));
// app.use(csurf({cookie: true}));
app.use(session({
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore(),
  secret: cookieProps.secret!,
  cookie: {maxAge: 10 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());

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
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});


/************************************************************************************
 *                              Manage login/logout
 ***********************************************************************************/

app.post('/login', checkNotAuth, passport.authenticate('local', {
  successRedirect: '/quiz',
  failureRedirect: '/',
  failureFlash: false
}));

app.get('/logout', checkAuth, (req: Request, res: Response) => {
  req!.session!.destroy(() => {
    req.signedCookies['connect.sid'] = '';
    req.logOut();
    return res.redirect('/');
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

app.get('/', csurf({cookie: true}), (req: Request, res: Response) => {
  res.cookie('csrfToken', req.csrfToken(), {secure: true});
  res.sendFile('login.html', {root: viewsDir});
});

app.get('/quiz', csurf({cookie: true}), checkAuth, (req: Request, res: Response) => {
  res.cookie('csrfToken', req.csrfToken(), {secure: true});
  res.sendFile('quiz.html', {root: viewsDir});
});

app.get('/addQuiz', csurf({cookie: true}), checkAuth, (req: Request, res: Response) => {
  res.cookie('csrfToken', req.csrfToken(), {secure: true});
  res.sendFile('addQuiz.html', {root: viewsDir});
});

app.get('/password', csurf({cookie: true}), checkAuth, (req: Request, res: Response) => {
  res.cookie('csrfToken', req.csrfToken(), {secure: true});
  res.sendFile('password.html', {root: viewsDir});
});

app.get('/scores', checkAuth, (req: Request, res: Response) => {
  // res.cookie('csrfToken', req.csrfToken(), {secure: true});
  res.sendFile('scores.html', {root: viewsDir});
});

app.get('/play', csurf({cookie: true}), checkAuth, async (req: Request, res: Response) => {
  const userId = req.session!.passport.user;
  const quizId = Number(req.query.quizId);
  const isFinished = (await scoreDao.getForQuizAndUser(quizId, userId)).length > 0;
  if (isFinished) {
    res.redirect('/quiz');
  }
  req.session!.quizId = quizId;
  const quiz = await quizDao.getOneById(quizId);
  res.cookie('csrfToken', req.csrfToken(), {secure: true});
  res.sendFile('play.html', {root: viewsDir, quiz});
});


// Export express instance
export default app;
