import { Request, Response } from "express";
import { getLesson } from "../db/queries/lessons.js";

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
