import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './lecture.controller.ts';

const router = express.Router();

router.route('/:lectureId/videos').get(controller.getLectureVideos);

export default router;
