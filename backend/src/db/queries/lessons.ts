import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { lessons } from "../schema.js";

export async function getLesson(id: string) {
  const [resp] = await db.select().from(lessons).where(eq(lessons.id, id));
  return resp;
}
