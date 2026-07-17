import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "./login";

type Chapter = {
  id: string;
  name: string;
  order: number;
  courseId: string;
};

export default function AdminChaptersPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Controlled states for handling the Admin Chapter Creation form
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>();
  const [newOrder, setNewOrder] = useState<number>(1);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    setLoading(true);
    // GET /api/courses/:courseId returns chapters sorted by order
    fetch(`${API_BASE_URL}/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chapters:", err);
        setLoading(false);
      });
  }, [courseId, navigate]);

  const handleChapterClick = (chapterId: string) => {
    navigate(`/admin/courses/${courseId}/chapters/${chapterId}/lessons`);
  };

  const handleAddChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // POST /api/admin/courses/:courseId/chapters according to your backend schema plan
      const res = await fetch(
        `${API_BASE_URL}/api/admin/courses/${courseId}/chapters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: newName,
            order: Number(newOrder),
          }),
        },
      );

      if (res.ok) {
        const newChapter = await res.json();

        // Append new chapter to state and sort them locally by order property
        setChapters((prev) =>
          [...prev, newChapter].sort((a, b) => a.order - b.order),
        );

        // Reset state variables and close form
        setNewName("");
        setNewOrder(chapters.length + 2); // Set next default order value neatly
        setIsAdding(false);
      } else {
        const errMsg = await res.text();
        alert(`Failed to create chapter: ${errMsg}`);
      }
    } catch (err) {
      console.error("Error creating chapter:", err);
    }
  };

  // Helper to open form and calculate an intelligent default sorting order value
  const openForm = () => {
    const nextOrder =
      chapters.length > 0 ? Math.max(...chapters.map((c) => c.order)) + 1 : 1;
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
        <div className="max-w-3xl mx-auto flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate("/courses")}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            &larr; Back to Courses
          </button>
          <h1 className="text-white text-3xl font-bold">Chapters</h1>
        </div>

        {/* Chapter Creation Form Card */}
        <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          {!isAdding ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Add a structured module to this course
              </span>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                onClick={openForm}
              >
                + Add Chapter
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddChapterSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Chapter Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none transition-colors"
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
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none transition-colors"
                  value={newOrder}
                  onChange={(e) => setNewOrder(Number(e.target.value))}
                  min="1"
                  required
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  Determines the order index sequence displayed to users.
                </span>
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
                  Create Chapter
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Chapters List Grid */}
        {chapters.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center py-12 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500">
              No chapters added yet for this track.
            </p>
          </div>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => handleChapterClick(chapter.id)}
              className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4 cursor-pointer hover:border-blue-500 flex justify-between items-center transition-colors duration-200"
            >
              <div>
                <span className="text-xs font-mono text-blue-500 block mb-1">
                  MODULE {chapter.order}
                </span>
                <h2 className="text-white font-semibold text-lg hover:text-blue-400 transition-colors">
                  {chapter.name}
                </h2>
              </div>
              <span className="text-gray-600 text-sm">&rarr;</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
