import { useNavigate } from "react-router-dom";
import logo_small from "../assets/logo_small.png";
import { useEffect, useState } from "react";
export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [admin, setAdmin] = useState<boolean>();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = JSON.parse(atob(token?.split(".")[1]));
    setAdmin(payload.isAdmin);
  }, []);
  const handleAdmin = () => {
    navigate("/admin/courses");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <img
        src={logo_small}
        className="h-12 cursor-pointer"
        onClick={() => navigate("/courses")}
      />
      {admin && (
        <button
          onClick={handleAdmin}
          className="text-gray-400 hover:text-white"
        >
          مسؤول
        </button>
      )}
      <button onClick={handleLogout} className="text-gray-400 hover:text-white">
        تسجيل خروج
      </button>
    </nav>
  );
}
