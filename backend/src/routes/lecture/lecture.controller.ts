import { type Request, type Response } from 'express';

import * as service from './lecture.service.ts';

import { isNumberParameter, getUserPayload } from '../util.ts';

export async function getLectureVideos(req: Request, res: Response) {
  const { lectureId } = req.params;
  if (!isNumberParameter(lectureId)) {
    return res.status(400).send();
  }

  const payload = getUserPayload(req);

  const data = await service.getLectureVideos(Number(lectureId), payload.id);

  return res.status(200).json(data);
}
