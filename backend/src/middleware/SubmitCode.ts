import { Request, Response } from "express";
import { getLesson } from "../db/queries/lessons.js";
import z, { ZodError } from "zod";
import { ZipArchive } from "archiver";
import { Buffer } from "buffer";

async function createZipBase64(
  userCode: string,
  testCode: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = new ZipArchive("zip");
    const runScript = `#!/bin/bash
pip install pytest -q 2>/dev/null
python -m pytest test.py -v`;

    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
    archive.on("error", reject);

    archive.append(userCode, { name: "main.py" });
    archive.append(testCode, { name: "test.py" });
    archive.append(runScript, { name: "run.sh" });
    archive.finalize();
  });
}

export async function handlerExecCode(req: Request, res: Response) {
  const Parameters = z.object({
    lessonId: z.string(),
    userCode: z.string(),
  });

  try {
    const parsedReq = Parameters.parse(req.body);
    if (!parsedReq.lessonId) {
      return res.status(400).send("Invalid lesson or user");
    }
    const testCode = (await getLesson(parsedReq.lessonId)).testCode;
    const zipBase64 = await createZipBase64(parsedReq.userCode, testCode);
    const response = await fetch(
      "https://ce.judge0.com/submissions?wait=true",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language_id: 89,
          additional_files: zipBase64,
        }),
      },
    );
    if (!response.ok) {
      res.status(500).send("something went wrong");
    } else {
      if (!testCode || testCode.trim() === "#Nothing") {
        res
          .status(200)
          .send({ passed: true, output: "لا يوجد تحدي برمجي في هذا الدرس" });
      } else {
        const output: any = await response.json();
        res.status(200).send({
          passed: !output.stderr && output.status?.id === 3,
          output: output.stdout || output.stderr || output.compile_output,
        });
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).send();
    } else {
      throw error;
    }
  }
}
