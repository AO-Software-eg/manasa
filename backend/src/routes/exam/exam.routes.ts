import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as controller from './exam.controller.ts';

const router = express.Router();

router.route('/:examId').get(controller.getExam);
router.route('/submit').post(bodyParser.json(), controller.submitExam);

export default router;
