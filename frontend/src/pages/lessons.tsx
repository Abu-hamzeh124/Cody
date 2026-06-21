import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

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
  const [lesson, setLesson] = useState<lesson[]>([]);
  const navigate = useNavigate();
  const { courseId, chapterId } = useParams();
  useEffect(() => {
    fetch(`http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}`)
      .then((res) => res.json())
      .then((data) => setLesson(data));
  }, []);

  const handleCourse = (id: string) => {
    navigate(`/courses/${courseId}/chapters/${chapterId}/lessons/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl font-bold mb-8">Lessons</h1>
      {lesson.map((lesson) => (
        <div
          key={lesson.id}
          className="bg-gray-800 rounded-lg p-6 mb-4 cursor-pointer hover:bg-gray-700"
        >
          <button onClick={() => handleCourse(lesson.id)}>{lesson.name}</button>
        </div>
      ))}
    </div>
  );
}

