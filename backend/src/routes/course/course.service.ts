import * as db from '../../database.ts';
import * as util from '../util.ts';
import * as err from '../error.ts';

export async function getCourses() {
  return await db.getAllCourses();
}

export async function getCourse(courseId: number) {
  return await db.getCourseById(Number(courseId));
}

export async function getCourseLectures(courseId: number, userId: number) {
  const enrolled = await db.isUserEnrolled(userId, courseId);

  if (!enrolled) {
    throw new err.UserUnauthorizedError();
  }

  return await db.getCourseLectures(courseId);
}
