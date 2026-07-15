import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";

async function admin() {
  await db.update(users).set({ isAdmin: 1 });
}

admin();
