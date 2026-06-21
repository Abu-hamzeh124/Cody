import { Request, Response } from "express";
import { createProgress, getProgress } from "../db/queries/progress.js";

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
