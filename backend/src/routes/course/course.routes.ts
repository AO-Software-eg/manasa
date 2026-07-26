import express, { type Request, type Response, type Router } from 'express';


import * as controller from './course.controller.ts';

const router: Router = express.Router();

router.route('/').get(express.json(), controller.getCourses);
router.route('/:courseId').get(express.json(), controller.getCourse);   
router.route('/:courseId/lectures').get(express.json(), controller.getCourseLectures);

export default router;
