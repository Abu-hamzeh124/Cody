import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "./login";

type Course = {
  id: string;
  name: string;
  description: string;
  language: string;
  progress: number;
};

export default function AdminCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Controlled states for handling the Admin Course Creation form
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("Python");

  useEffect(() => {
    console.log("courses useEffect running");
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        Promise.all(
          data.map((course: Course) =>
            fetch(`${API_BASE_URL}/api/progress/course/${course.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => res.json())
              .then((progress) => {
                console.log("progress response:", progress);
                setCourses((prev) =>
                  prev.map((c) =>
                    c.id === course.id
                      ? {
                          ...c,
                          progress: Math.min(
                            (progress.progressCount / progress.lessonCount) *
                              100,
                            100,
                          ),
                        }
                      : c,
                  ),
                );
              }),
          ),
        ).then(() => {
          setLoading(false);
        });
      });
  }, [navigate]);

  const handleCourse = (id: string) => {
    navigate(`/admin/courses/${id}`);
  };

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          language: newLanguage,
        }),
      });

      if (res.ok) {
        const newCourse = await res.json();

        // Append new course with 0% progress into state immediately
        setCourses((prev) => [...prev, { ...newCourse, progress: 0 }]);

        // Reset states to default and hide the creation form
        setNewName("");
        setNewDescription("");
        setNewLanguage("Python");
        setIsAdding(false);
      } else {
        const errMsg = await res.text();
        alert(`Failed to create course: ${errMsg}`);
      }
    } catch (err) {
      console.error("Error creating course:", err);
    }
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
        <h1 className="text-white text-3xl font-bold mb-8">Courses</h1>
        <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          {!isAdding ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Create a new learning track
              </span>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                onClick={() => setIsAdding(true)}
              >
                + Add Course
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Course Name
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
                  Description
                </label>
                <textarea
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none h-24 resize-none transition-colors"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Language
                </label>
                <select
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:border-blue-500 outline-none transition-colors"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                >
                  <option value="Python">Python</option>
                </select>
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
                  Create Course
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Courses List */}
        {courses.map((course) => (
          <div
            key={course.id}
            className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4 cursor-pointer hover:border-blue-500 transition-colors duration-200"
          >
            <button
              className="text-white font-semibold text-lg text-left hover:text-blue-400 transition-colors"
              onClick={() => handleCourse(course.id)}
            >
              {course.name}
            </button>
            <p className="text-gray-400 mt-2 text-sm">{course.description}</p>
            <div className="mt-3 flex items-center">
              <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5 font-medium">
                {course.language}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(course.progress || 0)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
