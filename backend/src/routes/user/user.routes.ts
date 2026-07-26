import express, { type Request, type Response, type Router } from 'express';

import * as controller from './user.controller.ts';

const router: Router = express.Router();

router.route('/me').get(controller.getMe);
router.route('/balance').get(controller.getBalance);

router.route('/enroll').post(express.json(), controller.enrollCourse);
router.route('/enrollments').get(express.json(), controller.getEnrollments);

router.route('/grades').get(express.json(), controller.getGrades);
router.route('/grades/:examId').get(express.json(), controller.getExamGrades);

router.route('/progress/:courseId').get(express.json(), controller.getCourseProgress);

export default router;
