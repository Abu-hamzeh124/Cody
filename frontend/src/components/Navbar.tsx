import { useNavigate } from 'react-router-dom'
import logo_small from "../assets/logo_small.png";
export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <img src={logo_small} className="h-12 cursor-pointer" onClick={() => navigate('/courses')} />
      <button onClick={handleLogout} className="text-gray-400 hover:text-white">
        تسجيل خروج
      </button>
    </nav>
  )
}