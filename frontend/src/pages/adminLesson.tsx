import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "./login";

type Lesson = {
  id: string;
  name: string;
  description: string;
  content: string;
  hints: string;
  testCode: string;
  assignment: string;
  order: number;
  chapterId: string;
};

export default function AdminLessonsPage() {
  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Controlled states for handling the complex Lesson Creation form
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newAssignment, setNewAssignment] = useState<string>("");
  const [newHints, setNewHints] = useState<string>("");
  const [newTestCode, setNewTestCode] = useState<string>("");
  const [newOrder, setNewOrder] = useState<number>(1);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/api/courses/${courseId}/chapters/${chapterId}`)
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lessons:", err);
        setLoading(false);
      });
  }, [courseId, chapterId, navigate]);

  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/chapters/${chapterId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: newName,
            description: newDescription,
            content: newContent,
            assignment: newAssignment,
            hints: newHints,
            testCode: newTestCode,
            order: Number(newOrder),
          }),
        },
      );

      if (res.ok) {
        const newLesson = await res.json();

        // Update list state locally and maintain numerical sorting order
        setLessons((prev) =>
          [...prev, newLesson].sort((a, b) => a.order - b.order),
        );

        // Reset all creation input tracking states
        setNewName("");
        setNewDescription("");
        setNewContent("");
        setNewAssignment("");
        setNewHints("");
        setNewTestCode("");
        setIsAdding(false);
      } else {
        const errMsg = await res.text();
        alert(`Failed to create lesson: ${errMsg}`);
      }
    } catch (err) {
      console.error("Error creating lesson:", err);
    }
  };

  const openForm = () => {
    const nextOrder =
      lessons.length > 0 ? Math.max(...lessons.map((l) => l.order)) + 1 : 1;
    setNewOrder(nextOrder);
    setIsAdding(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="p-8">
        {/* Navigation Breadcrumbs */}
        <div className="max-w-4xl mx-auto flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            &larr; Back to Chapters
          </button>
          <h1 className="text-white text-3xl font-bold">Lessons</h1>
        </div>

        {/* Lesson Creation Card Layout */}
        <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          {!isAdding ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Add interactive code execution lessons to this module
              </span>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                onClick={openForm}
              >
                + Add Lesson
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddLessonSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Sorting Order Index
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none"
                    value={newOrder}
                    onChange={(e) => setNewOrder(Number(e.target.value))}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Short Card Description
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Lesson Markdown Content (Supports Arabic Text)
                </label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none h-32 font-mono text-sm resize-none"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="# Lesson Content here..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Assignment Instruction Markdown Card
                </label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none h-24 font-mono text-sm resize-none"
                  value={newAssignment}
                  onChange={(e) => setNewAssignment(e.target.value)}
                  placeholder="### Task Instructions..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Hints (Rendered inside the Hints panel)
                </label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none h-20 font-mono text-sm resize-none"
                  value={newHints}
                  onChange={(e) => setNewHints(e.target.value)}
                  placeholder="Try checking variable names..."
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Pytest Evaluation Sandbox Code (`testCode` Field)
                </label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none h-32 font-mono text-sm resize-none"
                  value={newTestCode}
                  onChange={(e) => setNewTestCode(e.target.value)}
                  placeholder="def test_solution():\n    assert add(2, 3) == 5"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors text-sm"
                >
                  Create Lesson
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Lessons List Grid */}
        {lessons.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500">
              No lessons built inside this module yet.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex items-center justify-between hover:border-gray-700 transition-colors duration-150"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-950 border border-gray-800 text-blue-500 font-mono text-xs w-8 h-8 rounded flex items-center justify-center font-bold">
                    {lesson.order}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{lesson.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 max-w-xl truncate">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  {lesson.testCode && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                      has_tests
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
