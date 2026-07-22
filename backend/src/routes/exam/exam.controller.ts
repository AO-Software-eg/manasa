import { type Request, type Response } from 'express';

import * as service from './exam.service.ts';
import * as validation from './exam.validation.ts';

import { isNumberParameter, getUserPayload } from '../util.ts';

export async function getExam(req: Request, res: Response) {
  const payload = getUserPayload(req);
  const { examId } = req.params;

  if (!isNumberParameter(examId)) {
    return res.status(400).send();
  }

  const exam = await service.getExam(Number(examId), payload.id);

  return res.status(200).json(exam);
}

export async function submitExam(req: Request, res: Response) {
  const payload = getUserPayload(req);
  validation.examSubmissionSchema.parse(req.body);

  const grade = await service.submitExam(req.body, payload.id);

  return res.status(200).json(grade);
}
