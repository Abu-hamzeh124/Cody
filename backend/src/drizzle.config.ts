import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/dataBase",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "/mnt/e/cody/backend/src/db/dataBase/database.db",
  },
});
