import express from 'express';
import authRouter from './auth/auth.routes.ts';
import coursesRouter from './courses/routes.ts';
import userRouter from './user/user.routes.ts';
import videosRouter from './videos/routes.ts';
import examsRouter from './exams/routes.ts';
import lecturesRouter from './lectures/routes.ts';
import paymentRouter from './payment/routes.ts';

const router = express.Router();

router.use('/payment', paymentRouter);
router.use('/courses', coursesRouter);
router.use('/videos', videosRouter);
router.use('/lectures', lecturesRouter);
router.use('/exams', examsRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
