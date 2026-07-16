import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { chapters, lessons } from "../schema.js";
import { GelDateDurationBuilder } from "drizzle-orm/gel-core";
import { v4 } from "uuid";

export async function getChapters() {
  return await db.select().from(chapters);
}

export async function getChapter(id: string) {
  return await db.select().from(lessons).where(eq(lessons.chapterId, id));
}

export async function createChapter(
  name: string,
  order: number,
  courseId: string,
) {
  return await db
    .insert(chapters)
    .values({
      id: v4(),
      name: name,
      order: order,
      courseId: courseId,
    })
    .returning();
}
