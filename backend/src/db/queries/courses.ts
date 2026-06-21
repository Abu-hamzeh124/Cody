import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { courses, chapters } from "../schema.js";

export async function getCourses() {
  return await db.select().from(courses);
}

export async function getCourse(id: string) {
  return await db.select().from(chapters).where(eq(chapters.courseId, id));
}
