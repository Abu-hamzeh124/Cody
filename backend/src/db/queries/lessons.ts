import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { lessons } from "../schema.js";
import { v4 } from "uuid";

export async function getLesson(id: string) {
  const [resp] = await db.select().from(lessons).where(eq(lessons.id, id));
  return resp;
}

export async function createLesson(
  lesson: {
    name: string;
    description: string;
    content: string;
    hints?: string;
    testCode: string;
    assignment: string;
    order: number;
  },
  chapterId: string,
) {
  return await db.insert(lessons).values({
    id: v4(),
    name: lesson.name,
    description: lesson.description,
    content: lesson.content,
    hints: lesson.hints,
    testCode: lesson.testCode,
    assignment: lesson.assignment,
    order: lesson.order,
    chapterId: chapterId,
  });
}
