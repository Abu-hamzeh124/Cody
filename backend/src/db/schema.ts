import {
  pgTable,
  text,
  integer,
  unique,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  isAdmin: boolean("is_admin"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  updatedAt: timestamp("updated_at"),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  language: text("language").notNull().default("Python"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  updatedAt: timestamp("updated_at"),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  updatedAt: timestamp("updated_at"),
  courseId: uuid("course_id")
    .references(() => courses.id)
    .notNull(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  hints: text("hints"),
  testCode: text("test_code").notNull(),
  assignment: text("assignment").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now())),
  updatedAt: timestamp("updated_at"),
  chapterId: uuid("chapter_id")
    .references(() => chapters.id)
    .notNull(),
});

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    lessonId: uuid("lesson_id")
      .references(() => lessons.id)
      .notNull(),
    completed: boolean("completed").notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => ({
    userLessonUnique: unique().on(table.userId, table.lessonId),
  }),
);

export const refreshToken = pgTable("refreshToken", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  token: text("token").notNull().unique(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull(),
  expiresIn: timestamp("expires_in").notNull(),
  revoked: boolean("revoked"),
});
