import { refreshToken } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import process from "process";

const secret = process.env.REFRESH_SECRET as string;

export async function createToken(userId: string) {
  return await db
    .insert(refreshToken)
    .values({
      userId: userId,
      token: jwt.sign({ userId: userId }, secret, {
        expiresIn: "30d",
      }),
      createdAt: new Date(),
      expiresIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning();
}

export async function getToken(token: string) {
  return await db
    .select()
    .from(refreshToken)
    .where(eq(refreshToken.token, token));
}
