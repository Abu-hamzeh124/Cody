import express from "express";
import type { Request, Response, Application, NextFunction } from "express";
import { handlerCreateUser, handlerLogin } from "./middleware/users.js";
import { handlerGetChapter } from "./middleware/chapters.js";
import { handlerGetCourses, handlerGetCourse } from "./middleware/courses.js";
import { handlerGetLesson } from "./middleware/lessons.js";
import { handlerGetProgress, handlerCreateProgress } from "./middleware/progress.js";
import { UserAuthentecation } from "./middleware/auth.js";
import { handlerExecCode } from "./middleware/SubmitCode.js";
import cors from 'cors'


const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }))

app.post("/api/user", (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});

app.get("/api/courses", (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handlerGetCourses(req, res)).catch(next);
});

app.get(
  "/api/courses/:courseId",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerGetCourse(req, res)).catch(next);
  },
);

app.get(
  "/api/courses/:courseId/chapters/:chapterId",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerGetChapter(req, res)).catch(next);
  },
);

app.get(
  "/api/courses/:courseId/chapters/:chapterId/lessons/:lessonId",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerGetLesson(req, res)).catch(next);
  },
);

app.get(
  "/api/progress",
  UserAuthentecation,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerGetProgress(req, res)).catch(next);
  },
);

app.post(
  "/api/progress",
  UserAuthentecation,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerCreateProgress(req, res)).catch(next);
  },
);

app.post(
  "/api/submit",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerExecCode(req, res)).catch(next);
  },
);

app.listen(PORT, () => {
  console.log(`Server effectively running on port: ${PORT}`);
});
