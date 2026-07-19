import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import * as db from '../../database.ts';
import * as auth from '../../auth.ts';
import * as gr from '../../grade.ts';
import * as schema from '../../validation.ts';
import { ZodError } from 'zod';

const router = express.Router();

router
  .route('/submit')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    try {
      if (!req.is('application/json')) {
        return res.status(415).send();
      }

      if (!req.cookies.user_token) {
        return res
          .status(401)
          .json({ message: 'Unauthorized, user is not logged in' });
      }

      // Validate exam submission
      schema.examSubmissionSchema.parse(req.body);
      const data: schema.examSubmissionData = req.body;

      const exam = await db.getExam(data.examId);
      const lecture = await db.getLecture(exam.lectureId);

      if (!(await db.isUserEnrolled(data.studentId, lecture.courseId))) {
        return res.status(401).json({
          message: 'Unathorized, user does not have access to this course',
        });
      }

      const grade: gr.Grade = await gr.gradeExam(data);

      // Add exam submission
      const submission: db.InsertExamSubmission = {
        studentId: data.studentId,
        examId: exam.id,
        grade: grade.grade,
        questionCount: grade.questionCount,
      };
      const submissionId: number = await db.addExamSubmission(submission);

      // Add submitted answers
      const answerSubmissions: db.InsertAnswerSubmission[] = data.answers.map(
        (answer) => ({
          studentId: data.studentId,
          examSubmissionId: submissionId,
          questionId: answer.questionId,
          choiceId: answer.choiceId,
        }),
      );
      await db.addAnswerSubmissions(answerSubmissions);

      return res.status(200).json(grade);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res
          .status(422)
          .json({ message: 'Invalid exam submission data' });
      }
      return res.status(500).send();
    }
  });

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
