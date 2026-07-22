import * as db from '../../database.ts';
import * as validation from './user.validation.ts';

import * as progress from '../../progress.ts';

export async function getMe(userPayload: any) {
  const user: db.SelectUser = await db.getUserById(userPayload.id);
  if (user.password) {
    user.password = '';
  } else {
    throw new Error("Couldn't find password field to remove in SelectUser");
  }

  return user;
}

export async function getBalance(userPayload: any) {
  return await db.getBalance(userPayload.id);
}

export async function enrollCourse(
  userPayload: any,
  data: validation.enrollData,
) {
  const enrollment: db.InsertCourseEnrollment = {
    studentId: userPayload.id,
    courseId: data.courseId,
  };

  await db.addCourseEnrollment(enrollment);
}

export async function getEnrollments(userPayload: any) {
  return await db.getCourseEnrollments(userPayload.id);
}

export async function getGrades(userPayload: any) {
  return await db.getStudentExamSubmissions(userPayload.id);
}

export async function getExamGrades(userPayload: any, examId: number) {
  return await db.getExamSubmissions(userPayload.id, examId);
}

export async function getCourseProgress(userPayload: any, courseId: number) {
  const lectures: db.RelationUserLectures = await db.getUserLectures(
    Number(userPayload.id),
    Number(courseId),
  );

  const data: progress.UserCourseProgress = progress.getUserProgress(lectures);

  return data;
}
