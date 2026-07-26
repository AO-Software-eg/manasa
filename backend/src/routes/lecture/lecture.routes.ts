import express, { type Request, type Response, type Router } from 'express';

import * as controller from './lecture.controller.ts';

const router: Router = express.Router();

router.route('/:lectureId/videos').get(express.json(), controller.getLectureVideos);

export default router;
