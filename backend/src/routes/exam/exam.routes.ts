import express, { type Request, type Response, type Router } from 'express';

import * as controller from './exam.controller.ts';

const router: Router = express.Router();

router.route('/:examId').get(express.json(), controller.getExam);
router.route('/submit').post(express.json(), controller.submitExam);

export default router;
