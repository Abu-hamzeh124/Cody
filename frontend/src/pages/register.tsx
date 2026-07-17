import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoBackground from "../components/LogoBackground";
import logo_small from "../assets/logo_small.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";  

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<Boolean>();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const text = await response.text();
    if (!response.ok) {
      setError(text);
      setLoading(false); 
      return;
    }
    const data = JSON.parse(text);
    localStorage.setItem("token", data.accessToken);
    setLoading(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      id="LoginPage"
      className="min-h-screen flex items-center justify-center bg-gray-950"
    >
      <LogoBackground />
      <div className="mt-8 min-w-sm rounded-lg border bg-gray-900/40 backdrop-blur">
        <div className="p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src={logo_small} className="h-18 mx-auto mb-2" alt="Cody" />
            <h1 className="mt-2 text-center text-3xl/9 font-bold tracking-tight text-white">
              انشاء حساب
            </h1>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  بريد الكتروني
                </label>
                <div className="mt-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-1.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-100"
                  >
                    رقم سري
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-1.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleRegister}
                  type="button"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  انشاء حساب
                </button>
              </div>
            </form>

            <a
              href="/"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              تسجيل دخول
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
