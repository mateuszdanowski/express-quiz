import {Router} from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import QuizRouter from './Quizzes';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/quizzes', QuizRouter);

// Export the base-router
export default router;
