import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

type lesson = {
  id: string;
  name: string;
  description: string;
  content: string;
  hints: string;
  testCode: string;
  assignment: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  chapterId: string;
};

export default function LessonsPage() {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<lesson[]>([]);
  const { courseId, chapterId } = useParams();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetch(`http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}`)
      .then((res) => res.json())
      .then((data) => setLesson(data));
  }, []);

  const handleCourse = (id: string) => {
    navigate(`/courses/${courseId}/chapters/${chapterId}/lessons/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="p-8">
        <h1 className="text-white text-3xl font-bold mb-8">Lessons</h1>
        {lesson.map((lesson) => (
          <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 mb-4 cursor-pointer hover:border-blue-500 transition-colors duration-200">
            <button
              className="text-white font-semibold"
              onClick={() => handleCourse(lesson.id)}
            >
              {lesson.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
