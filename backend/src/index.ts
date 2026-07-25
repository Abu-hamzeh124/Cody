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
} from "./middleware/lessons.js";
import {
  handlerGetProgress,
  handlerCreateProgress,
  handlerGetCourseProgress,
} from "./middleware/progress.js";
import {
  handlerRefresh,
  isAdmin,
  UserAuthentication,
} from "./middleware/auth/auth.js";
import { handlerExecCode } from "./middleware/SubmitCode.js";
import { submitRateLimit } from "./middleware/auth/rate_limiting/submitLimit.js";
import { loginRateLimit } from "./middleware/auth/rate_limiting/loginLimit.js";
import { registerRateLimit } from "./middleware/auth/rate_limiting/registerLimit.js";
import cors from "cors";
import { handlerChatBot } from "./middleware/chatBot.js";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import { eq } from "drizzle-orm";
const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "https://cody-learn.vercel.app" }));

app.post(
  "/api/user",
  registerRateLimit,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
  },
);

app.post(
  "/api/login",
  loginRateLimit,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
  },
);

app.post("/api/refresh", (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next);
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
  UserAuthentication,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerGetProgress(req, res)).catch(next);
  },
);

app.get(
  "/api/progress/course/:courseId",
  UserAuthentication,
  (req, res, next) => {
    Promise.resolve(handlerGetCourseProgress(req, res)).catch(next);
  },
);

app.get(
  "/api/courses/:courseId/lessons",
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerGetLessons(req, res)).catch(next);
  },
);

app.post(
  "/api/progress",
  UserAuthentication,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerCreateProgress(req, res)).catch(next);
  },
);

app.post(
  "/api/submit",
  UserAuthentication,
  submitRateLimit,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerExecCode(req, res)).catch(next);
  },
);

app.post(
  "/api/courses",
  UserAuthentication,
  isAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerCreateCourse(req, res)).catch(next);
  },
);

app.post(
  "/api/courses/:courseId",
  UserAuthentication,
  isAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerCreateChapter(req, res)).catch(next);
  },
);

app.post(
  "/api/courses/:courseId/chapters/:chapterId",
  UserAuthentication,
  isAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerCreateLesson(req, res)).catch(next);
  },
);

app.post(
  "/api/codyAi",
  UserAuthentication,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handlerChatBot(req, res)).catch(next);
  },
);

app.post("/api/makeadmin", async (req, res) => {
  const { email } = req.body;
  await db.update(users).set({ isAdmin: 1 }).where(eq(users.email, email));
  res.status(200).send("done");
});

app.listen(PORT, () => {
  console.log(`Server effectively running on port: ${PORT}`);
});
