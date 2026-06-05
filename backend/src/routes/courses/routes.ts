import express, { type Request, type Response } from 'express';
import * as db from '../../database.ts';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response) => {
  try {
    const courses: db.SelectCourse[] = await db.getAllCourses();
    return res
      .status(200)
      .json({ message: 'Courses retrieval successful', data: courses });
  } catch (err: any) {
    console.log(err);
    return res.status(500).send();
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
    const course: db.SelectCourse = await db.getCourseById(Number(courseId));

    return res.status(200).json({ message: 'Found course', data: course });
  } catch (err: any) {
    console.log(err);

    if (err instanceof db.RowNotFoundError) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(500).send();
  }
});

router.route('/:courseId/lectures').get(async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    if (typeof courseId !== 'string') {
      return res.status(401).json({ message: 'Invalid course ID paramater' });
    }
    if (/^\d+$/.test(courseId) === false) {
      return res.status(401).json({ message: 'Invalid course ID paramater' });
    }

    const lectures: db.SelectLecture[] = await db.getCourseLectures(
      Number(courseId),
    );

    return res
      .status(200)
      .json({ message: 'Found course lectures', data: lectures });
  } catch (err: any) {
    console.log(err);

    if (err instanceof db.RowNotFoundError) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(500).send();
  }
});

export default router;
