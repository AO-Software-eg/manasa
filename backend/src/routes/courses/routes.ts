import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response) => {
  try {
    const courses = await db.getAllCourses();
    return res
      .status(200)
      .json({ message: 'Courses retrieval successful', data: courses });
  } catch (err: any) {
    console.log(err);
    res.status(500).send();
  }
});

router.route('/:courseId').get(async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    if (typeof courseId !== 'string') {
      return res.status(401).json({ message: 'Invalid course ID paramater' });
    }
    if (/^\d+$/.test(courseId) === false) {
      return res.status(401).json({ message: 'Invalid course ID paramater' });
    }
    const course: db.Course | null = await db.getCourseById(Number(courseId));
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    return res.status(200).json({ message: 'Found course', data: course });
  } catch (err: any) {
    console.log(err);
    res.status(500).send();
  }
});

export default router;
