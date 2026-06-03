import { pgTable, foreignKey, unique, bigint, timestamp, text, boolean, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const lectureVideos = pgTable("lecture_videos", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "lecture_videos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lectureId: bigint("lecture_id", { mode: "number" }).notNull(),
	videoId: text("video_id").notNull(),
	title: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.lectureId],
			foreignColumns: [lectures.id],
			name: "lecture_videos_lecture_id_fkey"
		}).onUpdate("cascade"),
	unique("lecture_videos_video_id_key").on(table.videoId),
]);

export const exams = pgTable("exams", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "exams_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lectureId: bigint("lecture_id", { mode: "number" }).notNull(),
	title: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.lectureId],
			foreignColumns: [lectures.id],
			name: "exams_lecture_id_fkey"
		}).onUpdate("cascade"),
]);

export const questionChoices = pgTable("question_choices", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "question_choices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	questionId: bigint("question_id", { mode: "number" }).notNull(),
	choiceText: text("choice_text").notNull(),
	isCorrect: boolean("is_correct").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "question_choices_question_id_fkey"
		}),
]);

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	studentPhone: text("student_phone").notNull(),
	parentPhone: text("parent_phone").notNull(),
	specialization: text(),
	governorate: text().notNull(),
	year: text().notNull(),
	name: text().notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const questions = pgTable("questions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "questions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	examId: bigint("exam_id", { mode: "number" }).notNull(),
	question: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.examId],
			foreignColumns: [exams.id],
			name: "questions_exam_id_fkey"
		}).onUpdate("cascade"),
]);

export const courses = pgTable("courses", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "courses_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	imageUrl: text("image_url").notNull(),
	price: integer().notNull(),
	year: text().notNull(),
	specialization: text(),
	description: text(),
	tags: text(),
});

export const lectures = pgTable("lectures", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "lectures_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	courseId: bigint("course_id", { mode: "number" }).notNull(),
	title: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "lectures_course_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);
