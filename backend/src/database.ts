import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';

import * as schema from '../drizzle/schema.ts';
import * as schemaRelations from '../drizzle/relations.ts';

export class DataIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataIntegrityError';
  }
}

export class NonUniqueDataError extends DataIntegrityError {
  constructor(resultCount: number) {
    super(
      `متوقع نتيجة واحدة أو لا شيء من الاستعلام، ولكن تم العثور على ${resultCount}`,
    );
  }
}

export class RowNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RowNotFoundError';
  }
}

if (!process.env.DB_URL) {
  throw new Error('DB_URL not set in .env');
}

const db = drizzle(process.env.DB_URL!, {
  schema: { ...schema, ...schemaRelations },
});

export type SelectUser = typeof schema.users.$inferSelect;
export type InsertUser = typeof schema.users.$inferInsert;

export type SelectCourse = typeof schema.courses.$inferSelect;
export type InsertCourse = typeof schema.courses.$inferInsert;

export type SelectLecture = typeof schema.lectures.$inferSelect;
export type InsertLecture = typeof schema.lectures.$inferInsert;

export type SelectLectureVideo = typeof schema.lectureVideos.$inferSelect;
export type InsertLectureVideo = typeof schema.lectureVideos.$inferInsert;

export type SelectExam = typeof schema.exams.$inferSelect;
export type InsertExam = typeof schema.exams.$inferInsert;

export type SelectQuestion = typeof schema.questions.$inferSelect;
export type InsertQuestion = typeof schema.questions.$inferInsert;

export type SelectQuestionChoice = typeof schema.questionChoices.$inferSelect;
export type InsertQuestionChoice = typeof schema.questionChoices.$inferInsert;

export type SelectCourseEnrollment =
  typeof schema.courseEnrollments.$inferSelect;
export type InsertCourseEnrollment =
  typeof schema.courseEnrollments.$inferInsert;

export type SelectExamSubmission = typeof schema.examSubmissions.$inferSelect;
export type InsertExamSubmission = typeof schema.examSubmissions.$inferInsert;

export type RelationLecture = Awaited<
  ReturnType<typeof getCourseLectures>
>[number];

export type RelationExamQuestions = Awaited<
  ReturnType<typeof getExamQuestions>
>[number];

export async function isUserFound(email: string): Promise<boolean> {
  const res = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  return res.length != 0;
}

export async function getUserByEmail(email: string): Promise<SelectUser> {
  const res = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(2); // We test for uniqueness only

  if (res.length == 0) {
    throw new RowNotFoundError(
      `المستخدم ذو البريد الإلكتروني ${email} غير موجود`,
    );
  } else if (res.length > 1) {
    throw new NonUniqueDataError(res.length);
  }

  return res[0];
}

export async function insertUser(user: InsertUser) {
  await db.insert(schema.users).values(user);
}

export async function getCourseById(id: number): Promise<SelectCourse> {
  const res = await db
    .select()
    .from(schema.courses)
    .where(eq(schema.courses.id, id));

  if (res.length == 0) {
    throw new RowNotFoundError(`الدورة التدريبية ذات المعرف ${id} غير موجودة`);
  }

  return res[0];
}

export async function getAllCourses(): Promise<SelectCourse[]> {
  const res = await db.select().from(schema.courses);

  return res;
}

export async function getCourseLectures(courseId: number) {
  const existsRes = await db
    .select()
    .from(schema.courses)
    .where(eq(schema.courses.id, courseId));

  if (existsRes.length == 0) {
    throw new RowNotFoundError(
      `الدورة التدريبية ذات المعرف ${courseId} غير موجودة`,
    );
  }

  const res = await db.query.lectures.findMany({
    where: (lectures, { eq }) => eq(lectures.courseId, courseId),
    with: {
      lectureVideos: {
        columns: {
          id: true,
          videoId: true,
          title: true,
        },
      },
      exams: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });

  return res;
}

export async function getLectureVideos(
  lectureId: number,
): Promise<SelectLectureVideo[]> {
  const existsRes = await db
    .select()
    .from(schema.lectures)
    .where(eq(schema.lectures.id, lectureId));

  if (existsRes.length == 0) {
    throw new RowNotFoundError(`المحاضرة ذات المعرف ${lectureId} غير موجودة`);
  }

  const res = await db
    .select()
    .from(schema.lectureVideos)
    .where(eq(schema.lectureVideos.lectureId, lectureId));

  return res;
}

export async function getExamQuestions(examId: number) {
  const existsRes = await db
    .select()
    .from(schema.exams)
    .where(eq(schema.exams.id, examId));

  if (existsRes.length == 0) {
    throw new RowNotFoundError(`الأمتحان ذو المعرف ${examId} غير موجود`);
  }

  const res = await db.query.questions.findMany({
    where: (questions, { eq }) => eq(questions.examId, examId),
    with: {
      questionChoices: {
        columns: {
          id: true,
          choiceText: true,
        },
      },
    },
  });

  return res;
}

export async function getCourseEnrollments(userId: number) {
  const res = await db.query.courseEnrollments.findMany({
    where: (courseEnrollments, { eq }) =>
      eq(courseEnrollments.studentId, userId),
    columns: {
      courseId: false,
    },
    with: {
      course: {
        columns: {
          id: true,
          title: true,
          imageUrl: true,
          createdAt: true,
          price: true,
          description: true,
        },
      },
    },
  });

  return res;
}

export async function isUserEnrolled(userId: number, courseId: number) {
  const res = await db
    .select()
    .from(schema.courseEnrollments)
    .where(
      and(
        eq(schema.courseEnrollments.studentId, userId),
        eq(schema.courseEnrollments.courseId, courseId),
      ),
    );

  return res.length != 0;
}

export async function addCourseEnrollment(enrollment: InsertCourseEnrollment) {
  await db.insert(schema.courseEnrollments).values(enrollment);
}

export async function getExam(examId: number): Promise<SelectExam> {
  const res = await db
    .select()
    .from(schema.exams)
    .where(eq(schema.exams.id, examId));

  if (res.length === 0) {
    throw new RowNotFoundError(`Exam with id ${examId} not found`);
  }

  return res[0];
}

export async function getLecture(lectureId: number): Promise<SelectLecture> {
  const res = await db
    .select()
    .from(schema.lectures)
    .where(eq(schema.lectures.id, lectureId));

  if (res.length === 0) {
    throw new RowNotFoundError(`Lecture with id ${lectureId} not found`);
  }

  return res[0];
}

export async function getQuestionChoice(
  choiceId: number,
): Promise<SelectQuestionChoice> {
  const res = await db
    .select()
    .from(schema.questionChoices)
    .where(eq(schema.questionChoices.id, choiceId));

  if (res.length === 0) {
    throw new RowNotFoundError(`Choice with id ${choiceId} not found`);
  }

  return res[0];
}

export async function addExamSubmission(submission: InsertExamSubmission) {
  await db.insert(schema.examSubmissions).values(submission);
}

// returns all the exam submissions a student has made
export async function getStudentExamSubmissions(studentId: number) {
  const res = await db.query.examSubmissions.findMany({
    where: (examSubmissions, { and }) =>
      and(eq(examSubmissions.studentId, studentId)),
    columns: {
      examId: false,
    },
    with: {
      exam: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (res.length === 0) {
    throw new RowNotFoundError(
      `No exam submission for user with id ${studentId} found`,
    );
  }

  return res;
}

// returns all the exam submissions a student has made for a specific exam
export async function getExamSubmissions(studentId: number, examId: number) {
  const exam = await db
    .select()
    .from(schema.exams)
    .where(eq(schema.exams.id, examId));
  if (exam.length === 0) {
    throw new RowNotFoundError(`No exam with id ${examId} found`);
  }

  // const subs = await db
  //   .select()
  //   .from(schema.examSubmissions)
  //   .where(
  //     and(
  //       eq(schema.examSubmissions.studentId, studentId),
  //       eq(schema.examSubmissions.examId, examId),
  //     ),
  //   );

  const subs = await db.query.examSubmissions.findMany({
    where: (examSubmissions, { and }) =>
      and(
        eq(examSubmissions.studentId, studentId),
        eq(examSubmissions.examId, examId),
      ),
    columns: {
      examId: false,
    },
  });

  if (subs.length === 0) {
    throw new RowNotFoundError(
      `No exam submission for user with id ${studentId} and exam with id ${examId} found`,
    );
  }

  const res = {
    exam: exam[0],
    submissions: subs,
  };

  return res;
}

export async function isUserFoundById(userId: number): Promise<boolean> {
  const res = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  return res.length !== 0;
}

export async function isExamFound(examId: number): Promise<boolean> {
  const res = await db
    .select()
    .from(schema.exams)
    .where(eq(schema.exams.id, examId));

  return res.length !== 0;
}

export default db;
