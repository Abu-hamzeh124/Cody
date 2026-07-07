import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoBackground from "../components/LogoBackground";
import logo_small from "../assets/logo_small.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const text = await response.text();
    if (!response.ok) {
      setError(text);
      return;
    }
    const data = JSON.parse(text);
    localStorage.setItem("token", data.accessToken);
    navigate("/courses");
  };

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
              تسجيل الدخول
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
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      نسيت الرقم السري؟
                    </a>
                  </div>
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
                  onClick={handleLogin}
                  type="button"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>

            <a
              href="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              انشاء حساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
