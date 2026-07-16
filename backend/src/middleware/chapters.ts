import z from "zod";
import { createChapter, getChapter } from "../db/queries/chapters.js";
import { Request, Response } from "express";
import Database from "better-sqlite3";

export async function handlerGetChapter(req: Request, res: Response) {
  try {
    const id = req.params["chapterId"] as string;
    if (!id) {
      res.status(401).send("Invalid ID");
    } else {
      const chapter = await getChapter(id);
      res.status(200).send(chapter);
    }
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else {
      throw error;
    }
  }
}

export async function handlerCreateChapter(req: Request, res: Response) {
  const Parameters = z.object({
    name: z.string(),
    order: z.number(),
  });

  try {
    const id = req.params["courseId"] as string;
    const parameters = Parameters.parse(req.body);
    if (!id) {
      res.status(401).send("Invalid ID");
    } else {
      const chapter = await createChapter(
        parameters.name,
        parameters.order,
        id,
      );
      res.status(200).send(chapter);
    }
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else {
      throw error;
    }
  }
}
