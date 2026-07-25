import z, { ZodError } from "zod";
import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const GEM_API_KEY = process.env.GEM_API_KEY as string;
const ai = new GoogleGenAI({ apiKey: GEM_API_KEY });

export async function handlerChatBot(req: Request, res: Response) {
  const Parameters = z.object({
    lesson: z.object({
      name: z.string(),
      assignment: z.string(),
      content: z.string(),
      userCode: z.string(),
    }),
    prompt: z.string(),
  });

  try {
    const parsedReq = Parameters.parse(req.body);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        `You are a coding tutor helping a student with this lesson:
Lesson: ${parsedReq.lesson.name}
Assignment: ${parsedReq.lesson.assignment}
Content: ${parsedReq.lesson.content}

The student's current code:
${parsedReq.lesson.userCode}

Answer in Arabic. Give hints, not full solutions.`,
        parsedReq.prompt,
      ],
    });
    if (
      !response.candidates ||
      !response.candidates[0].content ||
      !response.candidates[0].content.parts ||
      !response.candidates[0].content.parts[0].text
    ) {
      res.status(409).send("AI Api error");
    } else {
      res.status(200).send(response.candidates[0].content?.parts[0].text);
    }
  } catch (error: any) {
    if (error?.status === 429 || error?.code === 429) {
      res.status(429).send("المساعد غير متاح حالياً، حاول لاحقاً");
    } else if (error instanceof ZodError) {
      res.status(409).send(error.message);
    } else {
      throw error;
    }
  }
}
