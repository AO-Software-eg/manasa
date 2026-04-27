import express from 'express';
import coursesRouter from './courses/routes.ts';
import userRouter from './user/routes.ts';
import videosRouter from './videos/routes.ts';
import lecturesRouter from './lectures/routes.ts';

const router = express.Router();

router.use('/courses', coursesRouter);
router.use('/videos', videosRouter);
router.use('/lectures', lecturesRouter);
router.use('/', userRouter);

export default router;
