import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

type lesson = {
  id: string;
  name: string;
  content: string;
  hints: string;
  testCode: string;
  assignment: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  chapterId: string;
};

export default function LessonPage() {
  const [lesson, setLesson] = useState<lesson>();
  const [userCode, setCode] = useState("# Write your code here");
  const [result, setResult] = useState<{
    passed: boolean;
    output: string;
  } | null>(null);
  const { courseId, chapterId, lessonId } = useParams();
  useEffect(() => {
    fetch(
      `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
    )
      .then((res) => res.json())
      .then((data) => setLesson(data));
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userCode, lessonId, userId: "temp" }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl font-bold mb-8">{lesson?.name}</h1>
      {
        <div>
          <p className="text-white text-3xl font-bold mb-8">
            {lesson?.content}
          </p>
          <p className="text-white text-3xl font-bold mb-8">
            {lesson?.assignment}
          </p>
          <p className="text-white text-3xl font-bold mb-8">{lesson?.hints}</p>
          <Editor
            height="90vh"
            defaultLanguage="python"
            theme="vs-dark"
            value={userCode}
            onChange={(value) => setCode(value || "")}
          />
          <button onClick={handleSubmit}>Submit</button>
          {result && (
            <p className={result.passed ? "text-green-500" : "text-red-500"}>
              {result.passed ? "✅ Tests passed!" : "❌ Tests failed"}
            </p>
          )}
        </div>
      }
    </div>
  );
}
