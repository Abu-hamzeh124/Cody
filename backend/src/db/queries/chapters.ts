import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { chapters, lessons } from "../schema.js";

export async function getChapters() {
  return await db.select().from(chapters);
}

export async function getChapter(id: string) {
  return await db.select().from(lessons).where(eq(lessons.chapterId, id));
}