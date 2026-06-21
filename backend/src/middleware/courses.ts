import { getCourses, getCourse } from "../db/queries/courses.js";
import { Request, Response } from "express";

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
