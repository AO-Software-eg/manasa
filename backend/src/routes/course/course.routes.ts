import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './course.controller.ts';

const router = express.Router();

router.route('/').get(controller.getCourses);
router.route('/:courseId').get(controller.getCourse);
router.route('/:courseId/lectures').get(controller.getCourseLectures);

export default router;
