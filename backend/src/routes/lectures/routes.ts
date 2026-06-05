import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';
import { ZodAny } from 'zod';

const router = express.Router();

router.route('/:lectureId/videos').get(async (req: Request, res: Response) => {
  try {
    const lectureId = req.params.lectureId;

    if (typeof lectureId !== 'string') {
      return res.status(401).json({ message: 'Invalid lecture ID parameter' });
    }
    if (/^\d+$/.test(lectureId) === false) {
      return res.status(401).json({ message: 'Invalid lecture ID paramater' });
    }

    const data: db.SelectLectureVideo[] = await db.getLectureVideos(
      Number(lectureId),
    );

    return res
      .status(200)
      .json({ message: 'Found lecture videos', data: data });
  } catch (err: any) {
    return res.status(500).send();
  }
});

export default router;
