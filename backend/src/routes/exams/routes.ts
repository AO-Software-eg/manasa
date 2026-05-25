import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';

const router = express.Router();

router.route('/:examId').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { examId } = req.params;

  try {
    const data = await db.getExamQuestions(Number(examId));
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);

    if (err instanceof db.RowNotFoundError) {
      res.status(404).json({ message: 'Exam not found' });
    } else {
      res.status(500);
    }
  }
});

export default router;
