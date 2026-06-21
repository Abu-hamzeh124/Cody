import { v4 } from "uuid";
import { db } from "../index.js";
import { userProgress } from "../schema.js";
import { eq } from "drizzle-orm";

export async function getProgress(userId: string) {
  const resp = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId));
  return resp;
}

export async function createProgress(userId: string, lessonId: string) {
  const resp = await db.insert(userProgress).values({
    id: v4(),
    userId: userId,
    lessonId: lessonId,
    completed: 1,
    completedAt: Date.now(),
  }).returning();
  return resp;
}
