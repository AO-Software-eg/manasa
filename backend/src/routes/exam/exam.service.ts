import * as db from '../../database.ts';
import * as util from '../util.ts';
import * as err from '../error.ts';
import * as validation from './exam.validation.ts';
import * as grading from '../../grade.ts';

export async function getExam(examId: number, userId: number) {
  const exam = await db.getExam(examId);
  const lecture = await db.getLecture(exam.lectureId);

  if (!(await db.isUserEnrolled(userId, lecture.courseId))) {
    throw new err.UserUnauthorizedError();
  }

  return await db.getExamQuestions(examId);
}

export async function submitExam(
  data: validation.examSubmissionData,
  userId: number,
) {
  const exam = await db.getExam(data.examId);
  const lecture = await db.getLecture(exam.lectureId);

  if (!(await db.isUserEnrolled(userId, lecture.courseId))) {
    throw new err.UserUnauthorizedError();
  }

  const grade: grading.Grade = await grading.gradeExam(data);

  // Add exam submission
  const submission: db.InsertExamSubmission = {
    studentId: userId,
    examId: exam.id,
    grade: grade.grade,
    questionCount: grade.questionCount,
  };
  const submissionId: number = await db.addExamSubmission(submission);

  // Add submitted answers
  const answerSubmissions: db.InsertAnswerSubmission[] = data.answers.map(
    (answer) => ({
      studentId: userId,
      examSubmissionId: submissionId,
      questionId: answer.questionId,
      choiceId: answer.choiceId,
    }),
  );

  await db.addAnswerSubmissions(answerSubmissions);

  return grade;
}
