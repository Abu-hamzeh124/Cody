import { Request, Response } from "express";
import { getLesson } from "../db/queries/lessons.js";
import { getCourse } from "../db/queries/courses.js";
import { getChapter } from "../db/queries/chapters.js";

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
      const chapters = (await getCourse(courseId)).sort((a, b) => a.order - b.order);
      const lessons = [];
      for (let chapter of chapters) {
        let chap = (await getChapter(chapter.id)).sort((a, b) => a.order - b.order);
        lessons.push(...chap);
      }
      res.status(200).send(lessons);
    }
  } catch (error) {
    throw error;
  }
}
