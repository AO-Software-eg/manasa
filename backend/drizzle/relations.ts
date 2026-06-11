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
  studentAnswers,
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
    studentAnswers: many(studentAnswers),
  }),
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  questionChoices: many(questionChoices),
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  studentAnswers: many(studentAnswers),
}));

export const examSubmissionsRelations = relations(
  examSubmissions,
  ({ one }) => ({
    exam: one(exams, {
      fields: [examSubmissions.examId],
      references: [exams.id],
    }),
    user: one(users, {
      fields: [examSubmissions.studentId],
      references: [users.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  examSubmissions: many(examSubmissions),
  courseEnrollments: many(courseEnrollments),
  studentAnswers: many(studentAnswers),
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

export const studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
  questionChoice: one(questionChoices, {
    fields: [studentAnswers.questionId],
    references: [questionChoices.id],
  }),
  question: one(questions, {
    fields: [studentAnswers.questionId],
    references: [questions.id],
  }),
  user: one(users, {
    fields: [studentAnswers.studentId],
    references: [users.id],
  }),
}));
