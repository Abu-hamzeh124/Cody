import { getChapter } from "../db/queries/chapters.js";
import { Request, Response } from "express";


export async function handlerGetChapter(req: Request, res: Response) {
  try {
    const id = req.params["chapterId"] as string;
    if (!id) {
      res.status(401).send("Invalid ID");
    } else {
      const course = await getChapter(id);
      res.status(200).send(course);
    }
  } catch (error) {
    throw error;
  }
}
