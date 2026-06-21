import { users } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function getUser(email: string) {
  const [resp] = await db.select().from(users).where(eq(users.email, email));
  return resp;
}

export async function createUser(email: string, hashedPassword: string) {
  const resp = await db
    .insert(users)
    .values({ id: uuid(), email: email, hashedPassword: hashedPassword })
    .returning();
  return resp;
}
