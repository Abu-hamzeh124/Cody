import { exec } from "node:child_process";
import { Request, Response } from "express";
import { getLesson } from "../db/queries/lessons.js";
import { writeFileSync } from "node:fs";

export async function handlerExecCode(req: Request, res: Response) {
  type parameters = {
    lessonId: string;
    userId: string;
    userCode: string;
  };//"

  try {
    const parsedReq: parameters = req.body;

    if (!parsedReq.lessonId || !parsedReq.userId) {
      res.status(400).send("Invalid lesson or user");
    } else {
      const testCode = (await getLesson(parsedReq.lessonId)).testCode;
      const id = Math.random().toString(36).slice(2);
      writeFileSync(`/tmp/${id}_main.py`, parsedReq.userCode);
      writeFileSync(`/tmp/${id}_test.py`, testCode);
      exec(
        `docker run --rm -v /tmp/${id}_main.py:/app/main.py -v /tmp/${id}_test.py:/app/test.py python:3.11-slim sh -c "pip install pytest -q && python -m pytest /app/test.py"`,
        (error, stdout, stderr) => {
          if (!error) {
            res.status(200).send({ passed: true, output: stdout });
          } else {
            res.status(200).send({ passed: false, output: stdout + stderr });
          }
        },
      );
    }
  } catch (error) {
    throw error;
  }
}
