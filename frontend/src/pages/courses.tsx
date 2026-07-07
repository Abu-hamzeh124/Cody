import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

type Course = {
  id: string;
  name: string;
  description: string;
};

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetch(`http://localhost:3000/api/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleCourse = (id: string) => {
    navigate(`/courses/${id}`);
  };

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
            <button className="text-white font-semibold" onClick={() => handleCourse(course.id)}>
              {course.name}
            </button>
            <p className="text-gray-400 mt-2">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
