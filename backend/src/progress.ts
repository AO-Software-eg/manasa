import * as db from './database.ts';

export type UserCourseProgress = {
  videoCount: number;
  completedVideoCount: number;
  videoCompletionPercentage: number;

  examCount: number;
  solvedExamCount: number;
  examProgressPercentage: number;

  progressPercentage: number;
  lectureCount: number;
  finishedLectureCount: number;
};

export function getUserProgress(
  lectures: db.RelationUserLectures,
): UserCourseProgress {
  let examCount = 0;
  let solvedExamCount = 0;

  let videoCount = 0;
  let completedVideoCount = 0;

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

    let videosDone = true;
    for (const video of lecture.lectureVideos) {
      videoCount++;
      if (video.lectureVideoCompletions.length) {
        completedVideoCount++;
      } else {
        videosDone = false;
      }
    }

    if (examsDone && videosDone) {
      finishedLectureCount++;
    }
  }

  let progress: UserCourseProgress = {
    videoCount: videoCount,
    completedVideoCount: completedVideoCount,
    videoCompletionPercentage: (completedVideoCount / videoCount) * 100,

    solvedExamCount: solvedExamCount,
    examCount: examCount,
    examProgressPercentage: (solvedExamCount / examCount) * 100,

    lectureCount: lectureCount,
    finishedLectureCount: finishedLectureCount,
    progressPercentage: (finishedLectureCount / lectureCount) * 100,
  };

  progress = sanitizeZeroDivisionOutput(progress);

  return progress;
}

function sanitizeZeroDivisionOutput(
  data: UserCourseProgress,
): UserCourseProgress {
  const result = { ...data };

  for (const [key, val] of Object.entries(result)) {
    if (typeof val === 'number') {
      if (!isFinite(val) || isNaN(val)) {
        (result as any)[key] = 0;
      }
    }
  }
  return result;
}
