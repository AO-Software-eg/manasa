import * as db from '../../database.ts';
import * as util from '../util.ts';
import * as err from '../error.ts';

export async function getLectureVideos(lectureId: number, userId: number) {
  const lecture = await db.getLecture(lectureId);

  if (!(await db.isUserEnrolled(userId, lecture.courseId))) {
    throw new err.UserUnauthorizedError();
  }

  return await db.getLectureVideos(lectureId);
}
