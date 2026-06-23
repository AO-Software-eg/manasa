import { relations } from 'drizzle-orm/relations';
import {
  lectures,
  lectureVideos,
  exams,
  questions,
  questionChoices,
  examSubmissions,
  users,
  courses,
  courseEnrollments,
  answerSubmissions,
} from './schema.ts';

export const lectureVideosRelations = relations(lectureVideos, ({ one }) => ({
  lecture: one(lectures, {
    fields: [lectureVideos.lectureId],
    references: [lectures.id],
  }),
}));

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
  correctChoices: many(questionChoices),  // Secondary mapping, just makes more sense in certain cases
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  answerSubmissions: many(answerSubmissions),
}));

export const examSubmissionsRelations = relations(
  examSubmissions,
  ({ one, many }) => ({
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

export const usersRelations = relations(users, ({ many }) => ({
  examSubmissions: many(examSubmissions),
  courseEnrollments: many(courseEnrollments),
  answerSubmissions: many(answerSubmissions),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lectures: many(lectures),
  courseEnrollments: many(courseEnrollments),
}));

export const courseEnrollmentsRelations = relations(
  courseEnrollments,
  ({ one }) => ({
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
