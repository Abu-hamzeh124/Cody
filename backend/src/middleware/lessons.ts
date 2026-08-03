import { Request, Response } from "express";
import {
  createLesson,
  getLesson,
  updateLesson,
} from "../db/queries/lessons.js";
import { getCourse } from "../db/queries/courses.js";
import { getChapter } from "../db/queries/chapters.js";
import z from "zod";
import Database from "better-sqlite3";

export async function handlerGetLesson(req: Request, res: Response) {
  try {
    const lessonId = req.params["lessonId"] as string;
    if (!lessonId) {
      res.status(401).send("Invalid Lesson id");
    } else {
      const lesson = await getLesson(lessonId);
      res.status(200).send(lesson);
    }
  } catch (error) {
    throw error;
  }
}

export async function handlerGetLessons(req: Request, res: Response) {
  try {
    const courseId = req.params["courseId"] as string;
    if (!courseId) {
      res.status(401).send("Invalid Lesson id");
    } else {
      const chapters = (await getCourse(courseId)).sort(
        (a, b) => a.order - b.order,
      );
      const lessons = [];
      for (let chapter of chapters) {
        let chap = (await getChapter(chapter.id)).sort(
          (a, b) => a.order - b.order,
        );
        lessons.push(...chap);
      }
      res.status(200).send(lessons);
    }
  } catch (error) {
    throw error;
  }
}

export async function handlerCreateLesson(req: Request, res: Response) {
  const Parameters = z.object({
    name: z.string(),
    description: z.string(),
    content: z.string(),
    hints: z.string(),
    testCode: z.string(),
    assignment: z.string(),
    order: z.number(),
  });

  try {
    const chapterId = req.params["chapterId"] as string;
    if (!chapterId) {
      res.status(400).send();
    } else {
      const parsedBody = Parameters.parse(req.body);
      const lesson = await createLesson(parsedBody, chapterId);
      res.status(200).send(lesson);
    }
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else {
      throw error;
    }
  }
}

export async function handlerUpdateLessons(req: Request, res: Response) {
  const Parameters = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    hints: z.string().optional(),
    testCode: z.string().optional(),
    assignment: z.string().optional(),
    order: z.number().optional(),
  });

  try {
    const lessonId = req.params["lessonId"] as string;
    if (!lessonId) {
      res.status(400).send();
    } else {
      const parsedBody = Parameters.parse(req.body);
      const lesson = await updateLesson(parsedBody, lessonId);
      res.status(200).send(lesson);
    }
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else {
      throw error;
    }
  }
}
