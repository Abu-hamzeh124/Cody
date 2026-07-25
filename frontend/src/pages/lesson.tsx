import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "./login";

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
  const [loading, setLoading] = useState<boolean>();
  const [lesson, setLesson] = useState<lesson>();
  const [userCode, setCode] = useState("# Write your code here");
  const [allLessons, setAllLessons] = useState<lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prompt, setPrompt] = useState<string>();
  const [aiResponse, setAiResponse] = useState<string>();
  const [result, setResult] = useState<{
    passed: boolean;
    output: string;
  } | null>(null);
  const { courseId, lessonId } = useParams();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetch(`${API_BASE_URL}/api/courses/${courseId}/lessons`)
      .then((res) => res.json())
      .then((data) => {
        setAllLessons(data);
        const index = data.findIndex((les: lesson) => les.id === lessonId);
        setCurrentIndex(index);
        setLesson(data[index]);
        setResult(null);
        setCode("# Write your code here");
      });
  }, [lessonId]);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/submit`, {
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
      await fetch(`${API_BASE_URL}/api/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ lessonId }),
      });
    }
    setLoading(false);
  };

  const HandlePrev = () => {
    if (currentIndex === 0) return;
    navigate(
      `/courses/${courseId}/chapters/${allLessons[currentIndex - 1].chapterId}/lessons/${allLessons[currentIndex - 1].id}`,
    );
  };

  const HandleNext = () => {
    if (currentIndex === allLessons.length - 1) return;
    navigate(
      `/courses/${courseId}/chapters/${allLessons[currentIndex + 1].chapterId}/lessons/${allLessons[currentIndex + 1].id}`,
    );
  };

  const HandleCodyAi = async (prompt: string | undefined) => {
    if (!prompt) {
      return;
    }
    const response = await fetch(`${API_BASE_URL}/api/codyAi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        lesson: {
          name: lesson?.name,
          assignment: lesson?.assignment,
          content: lesson?.content,
          userCode: userCode,
        },
        prompt: prompt,
      }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const parsedResponse = await response.text();
    setAiResponse(parsedResponse);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-gray-800">
          <h1 className="text-white text-2xl font-bold mb-8">{lesson?.name}</h1>
          <div className="text-white prose prose-invert">
            <ReactMarkdown>{lesson?.content}</ReactMarkdown>
          </div>
          <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h2 className="font-semibold text-white mb-2">Assignment</h2>
            <p className="text-gray-300 text-sm">{lesson?.assignment}</p>
          </div>
          <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h2 className="font-semibold text-white mb-2">Hints</h2>
            <p className="text-gray-300 text-sm">{lesson?.hints}</p>
          </div>
          <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-5">
            <h2 className="font-semibold text-white mb-4">كودي AI</h2>
            <div className="flex gap-2 mt-4">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                placeholder="اسأل كودي..."
              />
              {aiResponse && (
                <div className="mt-4 text-gray-300 text-sm whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => HandleCodyAi(prompt)}
              >
                إرسال
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/2 h-full overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
            <span className="text-gray-400 text-sm">Chapter 1 - Lesson 1</span>
            <div className="flex gap-2">
              <button
                onClick={HandlePrev}
                disabled={currentIndex === 0}
                className="text-gray-400 hover:text-white px-3 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                onClick={HandleNext}
                disabled={currentIndex === allLessons.length - 1}
                className="text-gray-400 hover:text-white px-3 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={userCode}
              onChange={(value) => setCode(value || "")}
            />
          </div>
          <div className="border-t border-gray-800 bg-gray-900 p-4">
            <button
              onClick={handleSubmit}
              disabled={loading === true}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Running..." : "Submit"}
            </button>
            <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-5">
              <h2 className="font-semibold text-white mb-2">Output</h2>
              {result ? (
                <>
                  <p
                    className={
                      result.passed ? "text-green-400" : "text-red-400"
                    }
                  >
                    {result.passed ? "✅ Tests passed!" : "❌ Tests failed"}
                  </p>
                  <pre className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
                    {result.output}
                  </pre>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Run your code to see the output
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
