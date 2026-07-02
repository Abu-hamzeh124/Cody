import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/courses')}>
        Cody
      </h1>
      <button onClick={handleLogout} className="text-gray-400 hover:text-white">
        Logout
      </button>
    </nav>
  )
}