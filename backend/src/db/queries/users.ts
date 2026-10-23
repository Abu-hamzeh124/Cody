import { users } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

export async function getUser(email: string) {
  try {
    const [resp] = await db.select().from(users).where(eq(users.email, email));
    return resp;
  } catch (error: any) {
    console.error("Create user failed:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      cause: error.cause,
    });

    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const [resp] = await db.select().from(users).where(eq(users.id, id));
    return resp;
  } catch (error: any) {
    console.error("Create user failed:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      cause: error.cause,
    });

    throw error;
  }
}

export async function createUser(email: string, hashedPassword: string) {
  try {
    const resp = await db
      .insert(users)
      .values({ email: email, hashedPassword: hashedPassword })
      .returning();
    return resp;
  } catch (error: any) {
    console.error("Create user failed:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      cause: error.cause,
    });

    throw error;
  }
}
