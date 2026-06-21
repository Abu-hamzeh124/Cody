import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

type chapter = {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  courseId: string;
};

export default function ChaptersPage() {
  const [chapter, setChapter] = useState<chapter[]>([]);
  const navigate = useNavigate();
  const { courseId } = useParams();
  useEffect(() => {
    fetch(`http://localhost:3000/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setChapter(data));
  }, []);

  const handleChapter = (id: string) => {
    navigate(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-3xl font-bold mb-8">Chapters</h1>
      {chapter.map((chapter) => (
        <div
          key={chapter.id}
          className="bg-gray-800 rounded-lg p-6 mb-4 cursor-pointer hover:bg-gray-700"
        >
          <button onClick={() => handleChapter(chapter.id)}>
            {chapter.name}
          </button>
        </div>
      ))}
    </div>
  );
}
