import 'dotenv/config';
import { Pool } from 'pg';
import z from 'zod';

import * as validation from './validation.ts';

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

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export type User = z.infer<typeof validation.userSchema>;
export type Course = z.infer<typeof validation.courseSchema>;
export type Lecture = z.infer<typeof validation.lectureSchema>;
export type LectureVideo = z.infer<typeof validation.lectureVideoSchema>;

export async function getImageLink(name: string): Promise<string | null> {
  const query = 'SELECT * FROM image_links WHERE name = $1';
  const values = [name];

  const res = await db.query(query, values);
  if (res.rowCount && res.rowCount > 1) {
    throw new NonUniqueDataError(res.rowCount);
  }

  const row = res.rows[0];

  return row?.link ?? null;
}

export async function isUserFound(email: string): Promise<boolean> {
  const query = 'SELECT 1 FROM users WHERE email = $1';
  const values = [email];

  const res = await db.query(query, values);
  return res.rowCount != 0;
}

export async function getUserByEmail(email: string): Promise<User> {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const res = await db.query(query, values);
  if (res.rowCount && res.rowCount > 1) {
    throw new NonUniqueDataError(res.rowCount);
  }
  if (res.rowCount == 0) {
    throw new RowNotFoundError(
      `المستخدم ذو البريد الإلكتروني ${email} غير موجود`,
    );
  }

  const row = res.rows[0];

  const user: User = {
    id: row.id,
    email: row.email,
    passwordHash: row.password,
    specialization: row.specialization,
    governorate: row.governorate,
    parentPhone: row.parent_phone,
    studentPhone: row.student_phone,
    year: row.year,
    name: row.name,
  };

  return user;
}

export async function insertUser(user: User) {
  const query = `INSERT INTO users(name, email, password, student_phone, parent_phone, specialization, year, governorate)
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [
    user.name,
    user.email,
    user.passwordHash,
    user.studentPhone,
    user.parentPhone,
    user.specialization,
    user.year,
    user.governorate,
  ];

  await db.query(query, values);
}

export async function getCourseById(id: number): Promise<Course> {
  const query = 'SELECT * FROM courses WHERE id = $1';
  const values = [id];

  const res = await db.query(query, values);
  if (res.rowCount && res.rowCount > 1) {
    throw new NonUniqueDataError(res.rowCount);
  }
  if (res.rowCount == 0) {
    throw new RowNotFoundError(`الدورة التدريبية ذات المعرف ${id} غير موجودة`);
  }

  const row = res.rows[0];

  validation.courseSchema.parse(row);

  return row;
}

export async function getAllCourses(): Promise<Course[]> {
  const query = 'SELECT * FROM courses';

  const res = await db.query(query);
  for (const course of res.rows) {
    validation.courseSchema.parse(course);
  }

  return res.rows;
}

export async function getCourseLectures(courseId: number): Promise<Lecture[]> {
  const existsQuery = 'SELECT 1 FROM courses WHERE id=$1';
  const existsQueryValues = [courseId];

  const existsRes = await db.query(existsQuery, existsQueryValues);
  if (existsRes.rowCount == 0) {
    throw new RowNotFoundError(
      `الدورة التدريبية ذات المعرف ${courseId} غير موجودة`,
    );
  }

  const schema = validation.lectureSchema.extend({
    videos: z.array(
      z.object({
        title: z.string(),
        video_id: z.string(),
      }),
    ),
  });

  const query = `SELECT l.*, json_agg(json_build_object('video_id', v.video_id, 'title', v.title)) AS videos FROM lectures AS l JOIN lecture_videos as v ON v.lecture_id = l.id WHERE l.course_id = $1 GROUP BY l.id;`;
  const values = [courseId];

  const res = await db.query(query, values);
  for (const lecture of res.rows) {
    schema.parse(lecture);
  }

  return res.rows;
}

export async function getLectureVideos(
  lectureId: number,
): Promise<LectureVideo[]> {
  const existsQuery = 'SELECT 1 FROM lectures WHERE id=$1';
  const existsQueryValues = [lectureId];

  const existsRes = await db.query(existsQuery, existsQueryValues);
  if (existsRes.rowCount == 0) {
    throw new RowNotFoundError(`المحاضرة ذات المعرف ${lectureId} غير موجودة`);
  }

  const query = 'SELECT * FROM lecture_videos WHERE lecture_id=$1';
  const values = [lectureId];

  const res = await db.query(query, values);
  for (const video of res.rows) {
    validation.lectureVideoSchema.parse(video);
  }

  return res.rows;
}

export default db;
