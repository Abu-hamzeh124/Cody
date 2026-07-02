import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";

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
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<lesson>();
  const [userCode, setCode] = useState("# Write your code here");
  const [result, setResult] = useState<{
    passed: boolean;
    output: string;
  } | null>(null);
  const { courseId, chapterId, lessonId } = useParams();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetch(
      `http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
    )
      .then((res) => res.json())
      .then((data) => setLesson(data));
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3000/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userCode, lessonId }),
    });
    const data = await response.json();
    setResult(data);
    if (data.passed) {
      await fetch("http://localhost:3000/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ lessonId }),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="p-8">
        <h1 className="text-white text-xl font-bold mb-8">{lesson?.name}</h1>
        <div className="flex h-screen">
          <div className="w-1/2 overflow-y-auto p-8 bg-gray-950">
            <ReactMarkdown>{lesson?.content}</ReactMarkdown>
            <h2 className="text-white text-base leading-relaxed mb-4">
              Assignment
            </h2>
            <p className="text-gray-300 text-sm mb-4">{lesson?.assignment}</p>
            <h2 className="text-white text-base leading-relaxed mb-4">Hints</h2>
            <p className="text-white text-sm italic mb-8">{lesson?.hints}</p>
          </div>

          <div className="w-1/2 flex flex-col bg-gray-950">
            <Editor
              height="90vh"
              defaultLanguage="python"
              theme="vs-dark"
              value={userCode}
              onChange={(value) => setCode(value || "")}
            />
            <div>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-indigo-400 text-white px-6 py-2 rounded-md font-semibold m-4"
              >
                Submit
              </button>
              {result && (
                <p
                  className={result.passed ? "text-green-500" : "text-red-500"}
                >
                  {result.passed ? "✅ Tests passed!" : "❌ Tests failed"}
                  {result.output}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
