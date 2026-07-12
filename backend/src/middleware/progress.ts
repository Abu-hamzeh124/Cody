import { Request, Response } from "express";
import { createProgress, getProgress } from "../db/queries/progress.js";
import { getCourse } from "../db/queries/courses.js";
import { getChapter } from "../db/queries/chapters.js";

export async function handlerGetProgress(req: Request, res: Response) {
  try {
    const auth = (req as any).user;
    if (!auth.userID) {
      res.status(403).send();
    } else {
      const progress = await getProgress(auth.userID);
      res.status(200).send(progress);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
}

export async function handlerCreateProgress(req: Request, res: Response) {
  type parameters = {
    lessonId: string;
  };

  try {
    const auth = (req as any).user;
    const parsedReq: parameters = req.body;
    if (!auth.userID || !parsedReq.lessonId) {
      res.status(403).send();
    } else {
      const progress = await createProgress(auth.userID, parsedReq.lessonId);
      res.status(200).send(progress);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
}

export async function handlerGetCourseProgress(req: Request, res: Response) {
  try {
    const auth = (req as any).user;
    const courseId = req.params["courseId"] as string;
    if (!auth.userID || !courseId) {
      res.status(403).send();
    } else {
      const chapters = await getCourse(courseId);
      const lessons = [];
      for (let chapter of chapters) {
        let lessonArray = await getChapter(chapter.id);
        lessons.push(...lessonArray);
      }
      const progress = await getProgress(auth.userID);
      let progressCount = 0;
      for (let lesson of lessons) {
        for (let p of progress) {
          if (lesson.id === p.lessonId) {
            progressCount++;
          }
        }
      }
      res.status(200).send({
        lessonCount: lessons.length,
        progressCount: progressCount,
      });
    }
  } catch (error) {
    throw error;
  }
}
