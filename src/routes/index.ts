import {Router} from 'express';
import UserRouter from './Users';
import QuizRouter from './Quizzes';
import ScoreRouter from './Scores';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/quizzes', QuizRouter);
router.use('/scores', ScoreRouter);

// Export the base-router
export default router;
