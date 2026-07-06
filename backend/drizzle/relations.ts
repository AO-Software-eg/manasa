import { relations } from 'drizzle-orm/relations';
import {
  lectures,
  lectureVideos,
  exams,
  questions,
  questionChoices,
  courseEnrollments,
  examSubmissions,
  users,
  courses,
  lectureVideoCompletions,
  answerSubmissions,
} from './schema.ts';

export const lectureVideosRelations = relations(
  lectureVideos,
  ({ one, many }) => ({
    lecture: one(lectures, {
      fields: [lectureVideos.lectureId],
      references: [lectures.id],
    }),
    lectureVideoCompletions: many(lectureVideoCompletions),
  }),
);

export const lecturesRelations = relations(lectures, ({ one, many }) => ({
  lectureVideos: many(lectureVideos),
  exams: many(exams),
  course: one(courses, {
    fields: [lectures.courseId],
    references: [courses.id],
  }),
}));

export const examsRelations = relations(exams, ({ one, many }) => ({
  lecture: one(lectures, {
    fields: [exams.lectureId],
    references: [lectures.id],
  }),
  questions: many(questions),
  examSubmissions: many(examSubmissions),
}));

export const questionChoicesRelations = relations(
  questionChoices,
  ({ one, many }) => ({
    question: one(questions, {
      fields: [questionChoices.questionId],
      references: [questions.id],
    }),
    answerSubmissions: many(answerSubmissions),
  }),
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  questionChoices: many(questionChoices),
  correctChoices: many(questionChoices),
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  answerSubmissions: many(answerSubmissions),
}));

export const examSubmissionsRelations = relations(
  examSubmissions,
  ({ one, many }) => ({
    courseEnrollment: one(courseEnrollments, {
      fields: [examSubmissions.enrollmentId],
      references: [courseEnrollments.id],
    }),
    exam: one(exams, {
      fields: [examSubmissions.examId],
      references: [exams.id],
    }),
    user: one(users, {
      fields: [examSubmissions.studentId],
      references: [users.id],
    }),
    answerSubmissions: many(answerSubmissions),
  }),
);

export const courseEnrollmentsRelations = relations(
  courseEnrollments,
  ({ one, many }) => ({
    examSubmissions: many(examSubmissions),
    lectureVideoCompletions: many(lectureVideoCompletions),
    course: one(courses, {
      fields: [courseEnrollments.courseId],
      references: [courses.id],
    }),
    user: one(users, {
      fields: [courseEnrollments.studentId],
      references: [users.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  examSubmissions: many(examSubmissions),
  lectureVideoCompletions: many(lectureVideoCompletions),
  courseEnrollments: many(courseEnrollments),
  wallets: many(wallets),
  answerSubmissions: many(answerSubmissions),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lectures: many(lectures),
  courseEnrollments: many(courseEnrollments),
}));

export const lectureVideoCompletionsRelations = relations(
  lectureVideoCompletions,
  ({ one }) => ({
    courseEnrollment: one(courseEnrollments, {
      fields: [lectureVideoCompletions.enrollmentId],
      references: [courseEnrollments.id],
    }),
    user: one(users, {
      fields: [lectureVideoCompletions.studentId],
      references: [users.id],
    }),
    lectureVideo: one(lectureVideos, {
      fields: [lectureVideoCompletions.videoId],
      references: [lectureVideos.id],
    }),
  }),
);

  }),

export const answerSubmissionsRelations = relations(
  answerSubmissions,
  ({ one }) => ({
    questionChoice: one(questionChoices, {
      fields: [answerSubmissions.choiceId],
      references: [questionChoices.id],
    }),
    examSubmission: one(examSubmissions, {
      fields: [answerSubmissions.examSubmissionId],
      references: [examSubmissions.id],
    }),
    question: one(questions, {
      fields: [answerSubmissions.questionId],
      references: [questions.id],
    }),
    user: one(users, {
      fields: [answerSubmissions.studentId],
      references: [users.id],
    }),
  }),
);
