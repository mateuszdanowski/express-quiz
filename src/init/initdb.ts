import fs from 'fs-extra';

import {hashPwd} from '../shared/functions';
import {DbDao, TableName} from '../daos/Db/DbDao';
import UserDao from '../daos/User/UserDao';

void (async () => {
  await fs.promises.rmdir('database', {recursive: true});

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
  // const quizDao = new QuizDao();

  await dbDao.createTable(TableName.USERS);
  initialUsers.forEach(user => userDao.add(user.username, user.pwdHash));

  // const users = await userDao.getAll();
  // console.log(users);

  await dbDao.createTable(TableName.QUIZZES);
  // initialQuizzes.forEach(quiz => quizDao.add(quiz.name, quiz.content));

  await dbDao.createTable(TableName.SCORES);
  // initialScores.forEach(score => scoreDao.add(score.quiz_id, score.result));
})();


