import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

type Course = {
  id: string;
  name: string;
  description: string;
  language: string;
  progress: number;
};

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<Boolean>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("courses useEffect running");
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    setLoading(true);
    fetch(`http://localhost:3000/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        Promise.all(
          data.map((course: Course) =>
            fetch(`http://localhost:3000/api/progress/course/${course.id}`, {
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
          console.log("i am ibrahim");
          setLoading(false);
        });
      });
  }, []);

  const handleCourse = (id: string) => {
    navigate(`/courses/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 ">
      <Navbar />
      <div className="p-8">
        <h1 className="text-white text-3xl font-bold mb-8">Courses</h1>
        {courses.map((course) => (
          <div
            key={course.id}
            className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4 cursor-pointer hover:border-blue-500 transition-colors duration-200"
          >
            <button
              className="text-white font-semibold"
              onClick={() => handleCourse(course.id)}
            >
              {course.name}
            </button>
            <p className="text-gray-400 mt-2">{course.description}</p>
            <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5">
              {course.language}
            </span>
            <div className="mt-3">
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
