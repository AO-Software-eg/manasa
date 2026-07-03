import { pgTable, foreignKey, unique, bigint, timestamp, text, uniqueIndex, boolean, integer, primaryKey } from "drizzle-orm/pg-core"
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

export const paymentTransactions = pgTable("payment_transactions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "payment_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const questionChoices = pgTable("question_choices", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "question_choices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	questionId: bigint("question_id", { mode: "number" }).notNull(),
	choiceText: text("choice_text").notNull(),
	isCorrect: boolean("is_correct").notNull(),
}, (table) => [
	uniqueIndex("idx_choices_context").using("btree", table.questionId.asc().nullsLast().op("int8_ops"), table.id.asc().nullsLast().op("int8_ops")),
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

export const examSubmissions = pgTable("exam_submissions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "exam_submissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	examId: bigint("exam_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	grade: integer().notNull(),
	questionCount: integer("question_count").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.examId],
			foreignColumns: [exams.id],
			name: "exam_submissions_exam_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [users.id],
			name: "exam_submissions_student_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

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

export const lectureVideoCompletions = pgTable("lecture_video_completions", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	videoId: bigint("video_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [users.id],
			name: "lecture_videos_watched_student_id_fkey"
		}),
	foreignKey({
			columns: [table.videoId],
			foreignColumns: [lectureVideos.id],
			name: "lecture_videos_watched_video_id_fkey"
		}),
	primaryKey({ columns: [table.studentId, table.videoId], name: "lecture_videos_watched_pkey"}),
]);

export const courseEnrollments = pgTable("course_enrollments", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	courseId: bigint("course_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_enrollments_course_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [users.id],
			name: "course_enrollments_student_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.studentId, table.courseId], name: "course_enrollments_pkey"}),
]);

export const answerSubmissions = pgTable("answer_submissions", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	questionId: bigint("question_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	examSubmissionId: bigint("exam_submission_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	choiceId: bigint("choice_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.choiceId],
			foreignColumns: [questionChoices.id],
			name: "answer_submissions_choice_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.examSubmissionId],
			foreignColumns: [examSubmissions.id],
			name: "answer_submissions_exam_submission_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "answer_submissions_question_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [users.id],
			name: "answer_submissions_student_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.studentId, table.questionId, table.examSubmissionId, table.choiceId], name: "answer_submissions_pkey"}),
]);
