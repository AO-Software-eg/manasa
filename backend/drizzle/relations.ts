import { relations } from 'drizzle-orm/relations';
import {
  lectures,
  lectureVideos,
  exams,
  questions,
  questionChoices,
  courses,
  courseEnrollments,
  users,
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
}));

export const questionChoicesRelations = relations(
  questionChoices,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionChoices.questionId],
      references: [questions.id],
    }),
  }),
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  questionChoices: many(questionChoices),
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
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

export const usersRelations = relations(users, ({ many }) => ({
  courseEnrollments: many(courseEnrollments),
}));
