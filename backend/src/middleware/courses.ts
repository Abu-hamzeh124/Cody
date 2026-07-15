import { getCourses, getCourse, createCourse } from "../db/queries/courses.js";
import { Request, Response } from "express";
import { z, ZodError } from "zod";
import Database from "better-sqlite3";

export async function handlerGetCourses(req: Request, res: Response) {
  try {
    const courses = await getCourses();
    res.status(200).send(courses);
  } catch (error) {
    throw error;
  }
}

export async function handlerGetCourse(req: Request, res: Response) {
  try {
    const id = req.params["courseId"] as string;
    if (!id) {
      res.status(401).send("Invalid ID");
    } else {
      const course = await getCourse(id);
      res.status(200).send(course);
    }
  } catch (error) {
    throw error;
  }
}

export async function handlerCreateCourse(req: Request, res: Response) {
  const Parameters = z.object({
    name: z.string(),
    description: z.string(),
    language: z.string(),
  });

  try {
    const parameters = Parameters.parse(req.body);
    const [course] = await createCourse(
      parameters.name,
      parameters.description,
      parameters.language,
    );
    res.status(200).send(course);
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else if (error instanceof ZodError) {
      res.status(400).send();
    } else {
      throw error;
    }
  }
}
