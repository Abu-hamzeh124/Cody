import express from "express";
import type { Request, Response, Application, NextFunction } from "express";
import { handlerCreateUser, handlerLogin } from "./middleware/users.js";
import {
  handlerCreateChapter,
  handlerGetChapter,
} from "./middleware/chapters.js";
import {
  handlerGetCourses,
  handlerGetCourse,
  handlerCreateCourse,
} from "./middleware/courses.js";
import {
  handlerCreateLesson,
  handlerGetLesson,
  handlerGetLessons,
  handlerUpdateLessons,
} from "./middleware/lessons.js";
import {
  handlerGetProgress,
  handlerCreateProgress,
  handlerGetCourseProgress,
} from "./middleware/progress.js";
import {
  handlerRefresh,
  handlerVerifyToken,
  isAdmin,
  UserAuthentication,
} from "./middleware/auth/auth.js";
import { handlerExecCode } from "./middleware/SubmitCode.js";
import { submitRateLimit } from "./middleware/auth/rate_limiting/submitLimit.js";
import { loginRateLimit } from "./middleware/auth/rate_limiting/loginLimit.js";
import { registerRateLimit } from "./middleware/auth/rate_limiting/registerLimit.js";
import cors from "cors";
import { handlerChatBot } from "./middleware/chatBot.js";
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "https://cody-learn.vercel.app" }));

function mid(handler: (req: Request | any, res: Response | any) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res)).catch(next);
  }
}

app.post(
  "/api/user",
  registerRateLimit,
  mid(handlerCreateUser),
);

app.post(
  "/api/login",
  loginRateLimit,
  mid(handlerLogin),
);

app.post("/api/refresh", mid(handlerRefresh));

app.get(
  "/api/verify",
  UserAuthentication,
  mid(handlerVerifyToken),
);

app.get("/api/courses", mid(handlerGetCourses));

app.get(
  "/api/courses/:courseId",
  mid(handlerGetCourse),
);

app.get(
  "/api/courses/:courseId/chapters/:chapterId",
  mid(handlerGetChapter),
);

app.get(
  "/api/courses/:courseId/chapters/:chapterId/lessons/:lessonId",
  mid(handlerGetLesson),
);

app.get(
  "/api/progress",
  UserAuthentication,
  mid(handlerGetProgress),
);

app.get(
  "/api/progress/course/:courseId",
  UserAuthentication,
  mid(handlerGetCourseProgress),
);

app.get(
  "/api/courses/:courseId/lessons",
  mid(handlerGetLessons),
);

app.post(
  "/api/progress",
  UserAuthentication,
  mid(handlerCreateProgress),
);

app.post(
  "/api/submit",
  UserAuthentication,
  submitRateLimit,
  mid(handlerExecCode)
);

app.post(
  "/api/courses",
  UserAuthentication,
  isAdmin,
  mid(handlerCreateCourse),
);

app.post(
  "/api/courses/:courseId",
  UserAuthentication,
  isAdmin,
  mid(handlerCreateChapter),
);

app.post(
  "/api/courses/:courseId/chapters/:chapterId",
  UserAuthentication,
  isAdmin,
  mid(handlerCreateLesson),
);

app.post(
  "/api/courses/:courseId/chapters/:chapterId/:lessonId",
  UserAuthentication,
  isAdmin,
  mid(handlerUpdateLessons),
);

app.post(
  "/api/codyAi",
  UserAuthentication,
  mid(handlerChatBot),
);

app.listen(PORT, () => {
  console.log(`Server effectively running on port: ${PORT}`);
});
