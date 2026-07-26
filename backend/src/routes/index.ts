import express from 'express';
import authRouter from './auth/auth.routes.ts';
import coursesRouter from './course/course.routes.ts';
import userRouter from './user/user.routes.ts';
import videoRouter from './video/video.routes.ts';
import examsRouter from './exam/exam.routes.ts';
import lecturesRouter from './lecture/lecture.routes.ts';
import paymentRouter from './payment/payment.routes.ts';
import { type Router } from 'express';

const router: Router = express.Router();

router.use('/payment', paymentRouter);
router.use('/course', coursesRouter);
router.use('/video', videoRouter);
router.use('/lecture', lecturesRouter);
router.use('/exam', examsRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
