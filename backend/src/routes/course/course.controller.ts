import { type Request, type Response } from 'express';

import * as service from './course.service.ts';

import { isNumberParameter, getUserPayload } from '../util.ts';

export async function getCourses(req: Request, res: Response) {
  const courses = await service.getCourses();

  return res.status(200).json({ data: courses });
}

export async function getCourse(req: Request, res: Response) {
  const { courseId } = req.params;

  if (!isNumberParameter(courseId)) {
    return res.status(400).send();
  }

  const course = await service.getCourse(Number(courseId));

  return res.status(200).json({ data: course });
}

export async function getCourseLectures(req: Request, res: Response) {
  const { courseId } = req.params;

  if (!isNumberParameter(courseId)) {
    return res.status(400).send();
  }

  const payload = getUserPayload(req);

  const lectures = await service.getCourseLectures(
    Number(courseId),
    payload.id,
  );

  return res.status(200).json({ data: lectures });
}
