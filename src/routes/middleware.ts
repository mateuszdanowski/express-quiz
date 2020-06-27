import {Request, Response, NextFunction} from 'express';

function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function checkNotAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return res.redirect('/quiz');
  }
  next();
}

export {checkAuth, checkNotAuth};
