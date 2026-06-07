import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';
import * as auth from '../../auth.ts';

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

    const payload = auth.verifyToken(req.cookies.user_token);
    const userId = payload.id;

    const lecture = await db.getLecture(Number(lectureId));

    if (!(await db.isUserEnrolled(userId, lecture.courseId))) {
      return res.status(401).json({
        message: 'Unauthorized, user does not have access to this course',
      });
    }

    const data: db.SelectLectureVideo[] = await db.getLectureVideos(
      Number(lectureId),
    );

    return res
      .status(200)
      .json({ message: 'Found lecture videos', data: data });
  } catch (err: any) {
    console.log(err);

    if (err instanceof db.RowNotFoundError) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    return res.status(500).send();
  }
});

export default router;
