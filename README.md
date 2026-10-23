# Cody

An interactive coding-lessons platform. Learners work through courses made of chapters and lessons, write Python in an in-browser editor, and get their code checked against per-lesson tests. A built-in AI assistant ("Cody AI") helps when they get stuck, and admins can author courses, chapters and lessons.

Live frontend: https://cody-learn.vercel.app

## Features

- Register / login with JWT access + refresh tokens (argon2 password hashing)
- Courses → chapters → lessons, with Markdown lesson content and hints
- Monaco code editor with automated test-based checking (runs via [Judge0](https://ce.judge0.com))
- Per-user lesson and course progress tracking
- AI chat assistant powered by Google Gemini
- Admin pages for creating courses, chapters and lessons, and editing lessons
- Rate limiting on login, registration and code submission

## Tech stack

| Part     | Stack |
| -------- | ----- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Monaco Editor, react-markdown |
| Backend  | Node.js, Express 5, TypeScript, Drizzle ORM, PostgreSQL, Zod |
| Services | Judge0 (code execution), Google Gemini (`@google/genai`) |

## Project structure

```
cody/
├── backend/
│   └── src/
│       ├── index.ts          # Express app and routes
│       ├── middleware/       # Request handlers and auth / rate limiting
│       ├── db/               # Drizzle schema, queries and migrations
│       └── drizzle.config.ts
└── frontend/
    └── src/
        ├── pages/            # Course, lesson, login/register and admin pages
        ├── components/
        └── lib/              # API client and auth helpers
```

## Getting started

### Prerequisites

- Node.js
- A PostgreSQL database

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/cody
ACCESS_SECRET=<random string>
REFRESH_SECRET=<random string>
GEM_API_KEY=<Google Gemini API key>
PORT=3000            # optional, defaults to 3000
```

Apply migrations and start the dev server:

```bash
npm run migrate
npm run dev
```

Other scripts: `npm run generate` (generate a migration from schema changes) and `npm run build` (compile with `tsc`).

> CORS is currently restricted to `https://cody-learn.vercel.app` in `backend/src/index.ts`. Add your local frontend origin (e.g. `http://localhost:5173`) when developing locally.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

## API overview

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/user` | – | Register |
| POST | `/api/login` | – | Log in |
| POST | `/api/refresh` | – | Refresh access token |
| GET | `/api/verify` | User | Verify token |
| GET | `/api/courses` | – | List courses |
| GET | `/api/courses/:courseId` | – | Get a course |
| GET | `/api/courses/:courseId/lessons` | – | List a course's lessons |
| GET | `/api/courses/:courseId/chapters/:chapterId` | – | Get a chapter |
| GET | `/api/courses/:courseId/chapters/:chapterId/lessons/:lessonId` | – | Get a lesson |
| GET | `/api/progress` | User | Get the user's progress |
| GET | `/api/progress/course/:courseId` | User | Get progress for a course |
| POST | `/api/progress` | User | Record lesson progress |
| POST | `/api/submit` | User | Run code against a lesson's tests |
| POST | `/api/codyAi` | User | Chat with the AI assistant |
| POST | `/api/courses` | Admin | Create a course |
| POST | `/api/courses/:courseId` | Admin | Create a chapter |
| POST | `/api/courses/:courseId/chapters/:chapterId` | Admin | Create a lesson |
| POST | `/api/courses/:courseId/chapters/:chapterId/:lessonId` | Admin | Update a lesson |
