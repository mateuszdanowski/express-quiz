import jsonfile from 'jsonfile';
import fs from 'fs-extra';

import {hashPwd} from '../shared/functions';
import {DbDao, TableName} from '../daos/Db/DbDao';
import UserDao from '../daos/User/UserDao';
import QuizDao from '../daos/Quiz/QuizDao';
import {IQuizContent} from '@entities/QuizContent';

const DB_PATH = './database';
const QUIZZES_PATH = './src/init/quizzes.json';

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

  await dbDao.createTable(TableName.USERS);
  initialUsers.forEach(user => userDao.add(user.username, user.pwdHash));

  // const users = await userDao.getAll();
  // console.log(users);

  await dbDao.createTable(TableName.QUIZZES);
  const initialQuizzes = await jsonfile.readFile(QUIZZES_PATH);
  initialQuizzes.forEach((quiz: { name: string; content: IQuizContent; }) => quizDao.add(quiz.name, JSON.stringify(quiz.content)));

  // const quizzes = await quizDao.getAll();
  // console.log(quizzes);

  await dbDao.createTable(TableName.SCORES);
  // initialScores.forEach(score => scoreDao.add(score.quiz_id, score.result));
})();


