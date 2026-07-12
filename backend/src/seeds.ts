import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { chapters, courses, lessons } from "./db/schema.js";
import { v4 } from "uuid";

// 22555633-54a1-42ff-8b94-e124ba0cdcb7

async function course() {
  await db.update(courses).set({
    language: "c",
  });
}

async function chapter1() {
  await db.insert(chapters).values({
    id: v4(),
    name: "Introduction to C",
    order: 1,
    courseId: "22555633-54a1-42ff-8b94-e124ba0cdcb7",
  });
}

async function chapter2() {
  await db.insert(chapters).values({
    id: v4(),
    name: "Loops",
    order: 2,
    courseId: "22555633-54a1-42ff-8b94-e124ba0cdcb7",
  });
}
async function chapter3() {
  await db.insert(chapters).values({
    id: v4(),
    name: "Pointers",
    order: 3,
    courseId: "22555633-54a1-42ff-8b94-e124ba0cdcb7",
  });
}
async function lesson1() {
  await db
    .update(lessons)
    .set({
      testCode: `import subprocess

def test_hello_world():
    result = subprocess.run(['python', '/app/main.py'], capture_output=True, text=True)
    assert result.stdout.strip() == "hello world"`,
    })
    .where(eq(lessons.id, "d84bf156-36df-4e27-b254-626e9dd9db32"));
}

course();
