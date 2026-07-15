import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { courses, chapters } from "../schema.js";
import { v4 } from "uuid";

export async function getCourses() {
  return await db.select().from(courses);
}

export async function getCourse(id: string) {
  return await db.select().from(chapters).where(eq(chapters.courseId, id));
}

export async function createCourse(
  name: string,
  description: string,
  language: string,
) {
  return await db
    .insert(courses)
    .values({
      id: v4(),
      name: name,
      description: description,
      language: language,
      createdAt: Date.now(),
    })
    .returning();
}
