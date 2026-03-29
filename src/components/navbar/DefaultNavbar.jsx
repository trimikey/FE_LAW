import { Link } from 'react-router-dom'

const DefaultNavbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent">
          ⚖️ Lawyer Platform
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-slate-700 hover:text-blue-700">
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default DefaultNavbar
