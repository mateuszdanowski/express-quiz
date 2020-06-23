// Strings
export const paramMissingError = 'One or more of the required parameters was missing.';
export const loginFailedErr = 'Login failed';
export const userNotFoundErr = 'User not found';
export const invalidPasswordErr = 'Invalid password'
export const passwordsDoNotMatchErr = 'Passwords do not match!';
export const invalidJson = 'Invalid JSON';
export const quizContentLengthErr = 'Invalid length of quiz content';
export const quizContentFieldMissingErr = 'Some fields are missing in quiz content';

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = Object.freeze({
  key: 'ExpressGeneratorTs',
  secret: process.env.COOKIE_SECRET,
  options: {
    httpOnly: true,
    signed: true,
    path: (process.env.COOKIE_PATH),
    maxAge: Number(process.env.COOKIE_EXP),
    domain: (process.env.COOKIE_DOMAIN),
    secure: (process.env.SECURE_COOKIE === 'true'),
  },
});
