import jsonfile from 'jsonfile';
import fs from 'fs-extra';

import {DbDao, TableName} from '../daos/Db/DbDao';
import UserDao from '../daos/User/UserDao';
import QuizDao from '../daos/Quiz/QuizDao';
import ScoreDao from '../daos/Score/ScoreDao';

import {hashPwd} from '../shared/functions';
import {Statistic} from '../entities/Statistic';
import {Question} from '../entities/Question';

const DB_PATH = './database';
const QUIZZES_PATH = './src/init/quizzes.json';
const SCORES_PATH = './src/init/scores.json';

void (async () => {
  await fs.promises.rmdir(DB_PATH, {recursive: true});

  const initialUsers = [
    {
      'username': 'user1',
      'pwdHash': hashPwd('user1')
    },
    {
      'username': 'user2',
      'pwdHash': hashPwd('user2')
    }
  ];

  const dbDao = new DbDao();
  const userDao = new UserDao();
  const quizDao = new QuizDao();
  const scoreDao = new ScoreDao();

  await dbDao.createTable(TableName.USERS);
  await initialUsers.forEach(user => userDao.add(user.username, user.pwdHash));

  // const users = await userDao.getAll();
  // console.log(users);

  await dbDao.createTable(TableName.QUIZZES);
  const initialQuizzes = await jsonfile.readFile(QUIZZES_PATH);
  initialQuizzes.forEach((quiz: { name: string; questions: Question; }) => quizDao.add(quiz.name, JSON.stringify(quiz.questions)));

  // const quizzes = await quizDao.getAll();
  // console.log(quizzes);

  await dbDao.createTable(TableName.SCORES);
  const initialScores = await jsonfile.readFile(SCORES_PATH);
  initialScores.forEach((score: { quizId: number; userId: number; result: number; statistics: Statistic[] }) => scoreDao.add(score.quizId, score.userId, score.result, JSON.stringify(score.statistics)));

  // const scores = await scoreDao.getAll();
  // console.log(scores);
})();


