import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';
import * as auth from '../../auth.ts';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

router.route('/:examId').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized, user is not logged in' });
  }

  const { examId } = req.params;

  try {
    const payload = auth.verifyToken(req.cookies.user_token);
    const userId = payload.id;

    const exam = await db.getExam(Number(examId));
    const lecture = await db.getLecture(exam.lectureId);

    if (!(await db.isUserEnrolled(userId, lecture.courseId))) {
      return res.status(401).json({
        message: 'Unathorized, user does not have access to this course',
      });
    }

    const data = await db.getExamQuestions(Number(examId));
    return res.status(200).json(data);
  } catch (err: any) {
    console.log(err);

    if (err instanceof db.RowNotFoundError) {
      return res.status(404).json({ message: 'Exam not found' });
    } else {
      return res.status(500);
    }
  }
});

export default router;
