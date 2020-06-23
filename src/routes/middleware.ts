import {Request, Response, NextFunction} from 'express';
import {UNAUTHORIZED} from 'http-status-codes';

import {cookieProps} from '@shared/constants';
import {JwtService} from '@shared/JwtService';


const jwtService = new JwtService();


// Middleware to verify if user is an admin
export const adminMW = async (req: Request, res: Response, next: NextFunction) => {
  next();
  // return res.status(UNAUTHORIZED).json({
  //   error: 'JWT not present in signed cookie.'
  // });
};
