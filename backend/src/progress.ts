import * as db from './database.ts';

export type UserCourseProgress = {
  progressPercentage: number;
  solvedExamCount: number;
  examCount: number;
  lectureCount: number;
  finishedLectureCount: number;
  examProgressPercentage: number;
};

export function getUserProgress(
  lectures: db.RelationUserLectures,
): UserCourseProgress {
  let examCount = 0;
  let solvedExamCount = 0;
  let lectureCount = 0;
  let finishedLectureCount = 0;

  for (const lecture of lectures) {
    lectureCount++;

    let examsDone = true;
    for (const exam of lecture.exams) {
      examCount++;
      if (exam.examSubmissions.length) {
        solvedExamCount++;
      } else {
        examsDone = false;
      }
    }

    if (examsDone) {
      finishedLectureCount++;
    }
  }

  return {
    solvedExamCount: solvedExamCount,
    examCount: examCount,
    examProgressPercentage: (solvedExamCount / examCount) * 100,

    lectureCount: lectureCount,
    finishedLectureCount: finishedLectureCount,
    progressPercentage: (finishedLectureCount / lectureCount) * 100,
  };
}
