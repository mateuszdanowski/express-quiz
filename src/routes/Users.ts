import {Request, Response, Router} from 'express';
import {BAD_REQUEST, OK} from 'http-status-codes';

import UserDao from '../daos/User/UserDao';
import {invalidPasswordErr, paramMissingError, passwordsDoNotMatchErr, userNotFoundErr} from '../shared/constants';
import {comparePass, hashPwd} from '../shared/functions';


// Init shared
const router = Router();
const userDao = new UserDao();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const users = await userDao.getAll();
  return res.status(OK).json({users});
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.post('/update', async (req: Request, res: Response) => {
  // Check Parameters
  const {passwordUpdateData} = req.body;
  if (!passwordUpdateData) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Check if passwords match
  if (passwordUpdateData.newPass !== passwordUpdateData.newPassConfirmation) {
    return res.status(BAD_REQUEST).json({
      error: passwordsDoNotMatchErr,
    });
  }
  // Fetch user's id
  const userId = req.session!.passport.user;
  // Fetch user
  const user = await userDao.getOneById(userId);
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: userNotFoundErr,
    });
  }
  // Check if the entered password is correct
  if (!comparePass(passwordUpdateData.currentPass, user.pwdHash)) {
    return res.status(BAD_REQUEST).json({
      error: invalidPasswordErr,
    });
  }
  // Update password
  await userDao.updatePwd(user.username, hashPwd(passwordUpdateData.newPass));
  return res.status(OK).json({});
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
