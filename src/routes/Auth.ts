import bcrypt from 'bcrypt';
import {Request, Response, Router} from 'express';
import {BAD_REQUEST, OK, UNAUTHORIZED} from 'http-status-codes';

import UserDao from '@daos/User/UserDao';
import {JwtService} from '@shared/JwtService';
import {paramMissingError, loginFailedErr, cookieProps} from '@shared/constants';


const router = Router();
const userDao = new UserDao();
const jwtService = new JwtService();


/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
  // Check username and password present
  const {username, password} = req.body;
  if (!(username && password)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Fetch user
  const user = await userDao.getOne(username);
  if (!user) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Check password
  const pwdPassed = await bcrypt.compare(password, user.pwdHash);
  if (!pwdPassed) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Setup session
  req.session!.username = user.username;

  // Setup Admin Cookie
  const jwt = await jwtService.getJwt({
    id: user.id,
    role: 0,
  });
  const {key, options} = cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(OK).end();
});


/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', async (req: Request, res: Response) => {
  const {key, options} = cookieProps;
  res.clearCookie(key, options);
  req.session!.destroy(() => {
    return res.status(OK).end();
  });
});


/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
