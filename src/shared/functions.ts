import bcrypt from 'bcrypt';
import {pwdSaltRounds} from './constants';

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export function hashPwd(pwd: string) {
  return bcrypt.hashSync(pwd, pwdSaltRounds);
}

export function comparePass(pwd: string, pwdHash: string) {
  return bcrypt.compareSync(pwd, pwdHash);
}
