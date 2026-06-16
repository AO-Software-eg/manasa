import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';
import * as validation from '../../validation.ts';
import * as auth from '../../auth.ts';
import cookieParser from 'cookie-parser';
import z, { date, ZodError } from 'zod';
import bodyParser from 'body-parser';
import { hashPassword, verifyPassword } from '../../hash.ts';

const router = express.Router();

router
  .route('/users/:userId/grades/:examId')
  .get(async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const examId = req.params.examId;

      if (typeof userId !== 'string') {
        return res.status(401).json({ message: 'Invalid user ID paramater' });
      }
      if (/^\d+$/.test(userId) === false) {
        return res.status(401).json({ message: 'Invalid user ID paramater' });
      }

      if (typeof examId !== 'string') {
        return res.status(401).json({ message: 'Invalid exam ID paramater' });
      }
      if (/^\d+$/.test(examId) === false) {
        return res.status(401).json({ message: 'Invalid exam ID paramater' });
      }

      if (!(await db.isUserFoundById(Number(userId)))) {
        return res
          .status(404)
          .json({ message: `User with id ${userId} does not exist` });
      }
      if (!(await db.isExamFound(Number(examId)))) {
        return res
          .status(404)
          .json({ message: `Exam with id ${examId} does not exist` });
      }

      const submission = await db.getExamSubmissions(
        Number(userId),
        Number(examId),
      );
      return res.status(200).json(submission);
    } catch (err: any) {
      console.log(err);
      if (err instanceof db.RowNotFoundError) {
        return res.status(404).send();
      }

      return res.status(500).send();
    }
  });

router
  .route('/users/:userId/grades')
  .get(async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (typeof userId !== 'string') {
        return res.status(401).json({ message: 'Invalid user ID paramater' });
      }
      if (/^\d+$/.test(userId) === false) {
        return res.status(401).json({ message: 'Invalid user ID paramater' });
      }

      if (!(await db.isUserFoundById(Number(userId)))) {
        return res
          .status(404)
          .json({ message: `User with id ${userId} does not exist` });
      }

      const submissions: db.SelectExamSubmission[] =
        await db.getStudentExamSubmissions(Number(userId));

      return res.status(200).json(submissions);
    } catch (err: any) {
      console.log(err);
      if (err instanceof db.RowNotFoundError) {
        return res.status(404).send();
      }

      return res.status(500).send();
    }
  });

router
  .route('/users/enroll')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      return res.status(415).send();
    }

    try {
      const data = req.body;
      validation.enrollSchema.parse(data);

      await db.addCourseEnrollment(data);
      return res.status(201).json({
        message: 'Enrollment created',
      });
    } catch (err: any) {
      console.log(err);
      if (err instanceof ZodError) {
        console.log(err);
        return res.status(400).send();
      } else {
        return res.status(500).json({
          message: err instanceof Error ? err.message : 'حدث خطأ ما !',
        });
      }
    }
  });

// TODO(omar): check if the user exists
router
  .route('/users/:userId/enrollments')
  .get(async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (typeof userId !== 'string') {
        return res.status(401).json({ message: 'Invalid user ID paramater' });
      }
      if (/^\d+$/.test(userId) === false) {
        return res.status(401).json({ message: 'Invalid user ID paramater' });
      }

      const enrollments = await db.getCourseEnrollments(Number(userId));

      return res.status(200).json(enrollments);
    } catch (err: any) {
      res.status(500).send();
    }
  });

router
  .route('/signup')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      return res.status(415).send();
    }

    try {
      const data = req.body;
      validation.signupSchema.parse(data);

      const userExists: boolean = await db.isUserFound(data.email);
      if (userExists) {
        return res.status(400).json({
          message: 'المستخدم موجود بالفعل',
        });
      }

      const passwordHash = await hashPassword(data.password);
      const user: db.InsertUser = {
        email: data.email,
        name: data.name,
        studentPhone: data.studentPhone,
        parentPhone: data.parentPhone,
        specialization: data.specialization,
        governorate: data.governorate,
        year: data.YearCombo,
        password: passwordHash,
      };

      await db.insertUser(user);
      return res.status(200).send();
    } catch (err: any) {
      console.log(err);
      if (err instanceof ZodError) {
        return res.status(400).send();
      } else {
        return res.status(500).json({
          message: err instanceof Error ? err.message : 'حدث خطأ ما !',
        });
      }
    }
  });

router
  .route('/login')
  .post(bodyParser.json(), async (req: Request, res: Response) => {
    if (!req.is('application/json')) {
      return res.status(415).send();
    }

    try {
      const data = req.body;
      validation.loginSchema.parse(data);

      const user: db.SelectUser = await db.getUserByEmail(data.email);

      if ((await verifyPassword(user.password, data.password)) == false) {
        return res.status(400).json({
          message: 'كلمة سر غير صحيحه',
        });
      }

      const token = auth.signToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      res.cookie('user_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV == 'production',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'بيانات غير صحيحه',
        });
      } else if (err instanceof db.RowNotFoundError) {
        return res.status(404).json({
          message: 'المستخدم غير موجود',
        });
      } else {
        console.log(err);
        return res.status(500).json({
          message: err instanceof Error ? err.message : 'حدث خطأ ما !',
        });
      }
    }

    return res.status(200).send();
  });

router.route('/logout').post(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).json({ message: 'لا يوجد حساب مسجل' });
  }

  res.cookie('user_token', '', {
    expires: new Date(0),
    path: '/',
  });

  return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
});

router.route('/me').get(async (req: Request, res: Response) => {
  if (!req.cookies.user_token) {
    return res.status(401).send(); // end the request , return was not added
  }

  try {
    const payload = auth.verifyToken(req.cookies.user_token);
    if (!payload.email) {
      return res.status(500).json({ message: 'Email not found in token' });
    }

    const user: db.SelectUser = await db.getUserByEmail(payload.email);
    if (user.password) {
      user.password = '';
    }

    return res.status(200).json(user);
  } catch (err: any) {
    if (err instanceof db.RowNotFoundError) {
      res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    return res.status(500).send();
  }
});

export default router;
