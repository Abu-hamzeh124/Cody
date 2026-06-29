import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull().unique(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at"),
});

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey().notNull().unique(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at"),
});

export const chapters = sqliteTable("chapters", {
  id: text("id").primaryKey().notNull().unique(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at"),
  courseId: text("course_id")
    .references(() => courses.id)
    .notNull(),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey().notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  hints: text("hints"),
  testCode: text("test_code").notNull(),
  assignment: text("assignment").notNull(),
  order: integer("order").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at"),
  chapterId: text("chapter_id")
    .references(() => chapters.id)
    .notNull(),
});

export const userProgress = sqliteTable("user_progress", {
  id: text("id").primaryKey().notNull().unique(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  lessonId: text("lesson_id")
    .references(() => lessons.id)
    .notNull(),
  completed: integer("completed").notNull(),
  completedAt: integer("completed_at"),
});

export const refreshToken = sqliteTable("refreshToken", {
  id: text("id").primaryKey().notNull().unique(),
  token: text("token").notNull().unique(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: integer("created_at").notNull(),
  expiresIn: integer("expires_in").notNull(),
  revoked: integer("revoked"),
});

export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type progress = typeof userProgress.$inferSelect;
