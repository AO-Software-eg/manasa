import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './user.controller.ts';

const router = express.Router();

router.route('/me').get(controller.getMe);
router.route('/balance').get(controller.getBalance);

router.route('/enroll').post(bodyParser.json(), controller.enrollCourse);
router.route('/enrollments').get(controller.getEnrollments);

router.route('/grades').get(controller.getGrades);
router.route('/grades/:examId').get(controller.getExamGrades);

router.route('/progress/:courseId').get(controller.getCourseProgress);

export default router;
