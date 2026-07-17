import { type Request, type Response } from 'express';
import { isNumberParameter, getUserPayload } from '../util.ts';

import * as service from './video.service.ts';

export async function getVideo(req: Request, res: Response) {
  const { videoId } = req.params;

  if (typeof videoId !== 'string') {
    return res.status(400).send();
  }

  const payload = getUserPayload(req);

  const video = await service.getVideo(videoId, payload.id);

  return res.status(200).json(video);
}
