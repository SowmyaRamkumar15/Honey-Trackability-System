import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useStore'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

const Navbar = ({ transparent = false }) => {
  const { isAuthenticated, user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
      }`}
    >
      {/* Logo */}
      <Link to="/" id="nav-logo" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm group-hover:bg-amber-600 transition-all duration-300">
          🍯
        </div>
        <span className="font-bold text-xl font-['Outfit'] text-gradient">HoneyChain</span>
      </Link>

      {/* Nav Actions */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-slate-600 hidden sm:block">
              {user?.name || 'User'}
            </span>
            <button
              id="nav-logout-btn"
              onClick={handleLogout}
              className="btn-secondary text-sm px-4 py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" id="nav-login-btn">
              <button className="btn-secondary text-sm px-4 py-2">Login</button>
            </Link>
            <Link to="/register" id="nav-register-btn">
              <button className="btn-primary text-sm px-4 py-2">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
