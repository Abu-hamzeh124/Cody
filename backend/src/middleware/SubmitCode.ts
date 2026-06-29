import { exec } from "node:child_process";
import { Request, Response } from "express";
import { getLesson } from "../db/queries/lessons.js";
import { unlinkSync, writeFileSync } from "node:fs";
export async function handlerExecCode(req: Request, res: Response) {
  type parameters = {
    lessonId: string;
    userId: string;
    userCode: string;
  };

  try {
    const parsedReq: parameters = req.body;

    if (!parsedReq.lessonId || !parsedReq.userId) {
      return res.status(400).send("Invalid lesson or user");
    }
    const testCode = (await getLesson(parsedReq.lessonId)).testCode;
    const id = Math.random().toString(36).slice(2);
    const mainFile = `/tmp/${id}_main.py`;
    const testFile = `/tmp/${id}_test.py`;
    writeFileSync(mainFile, parsedReq.userCode);
    writeFileSync(testFile, testCode);
    exec(
      `docker run --rm -v ${mainFile}:/app/main.py -v ${testFile}:/app/test.py python:3.11-slim sh -c "pip install pytest -q && timeout 30 python -m pytest /app/test.py"`,
      (error, stdout, stderr) => {
         try {
          unlinkSync(mainFile);
          unlinkSync(testFile);
        } catch (cleanupError) {
          console.error("Failed to clean up user files safely:", cleanupError);
        }

        if (!error) {
          res.status(200).send({ passed: true, output: stdout });
        } else {
          res.status(200).send({ passed: false, output: stdout + stderr });
        }
      },
    );
  } catch (error) {
    throw error;
  }
}
