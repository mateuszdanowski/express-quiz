import passport from 'passport';
import bcrypt from 'bcrypt';

import UserDao from '../daos/User/UserDao';

const userDao = new UserDao();

// tslint:disable-next-line:no-var-requires
const LocalStrategy = require('passport-local').Strategy;

// tslint:disable-next-line:no-shadowed-variable
function initialize(passport: passport.PassportStatic) {

  // tslint:disable-next-line:ban-types
  const authUser = async (username: string, password: string, done: Function) => {

    const user = await userDao.getOne(username);
    if (!user) {
      return done(null, false);
    }

    try {
      console.log(password, user.pwdHash);
      if (await bcrypt.compare(password, user.pwdHash)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e);
    }

  }
  passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'}, authUser));

  // tslint:disable-next-line:ban-types
  passport.serializeUser((user: { id: number, username: string, password: string }, done: Function) => {
    done(null, user.id);
  });

  // tslint:disable-next-line:ban-types
  passport.deserializeUser(async (id: number, done: Function) => {
    return done(null, await userDao.getOneById(id));
  });
}

export {initialize};
