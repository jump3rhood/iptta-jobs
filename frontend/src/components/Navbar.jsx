import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
    setOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/jobs" className="flex items-center gap-2 tap-highlight-none" onClick={() => setOpen(false)}>
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-gray-900 text-lg leading-tight">
              IPTTA <span className="text-indigo-600">Jobs</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/jobs" className={linkClass}>Browse Jobs</NavLink>
            {token && <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                Sign out
              </button>
            ) : null}
            <Link
              to="/submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Post a Job
            </Link>
          </div>

          {/* Mobile: Post a job + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/submit"
              onClick={() => setOpen(false)}
              className="bg-indigo-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg"
            >
              Post a Job
            </Link>
            <button
              onClick={() => setOpen(o => !o)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 tap-highlight-none"
              aria-label="Toggle menu"
            >
              {open ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <NavLink to="/jobs" className={linkClass} onClick={() => setOpen(false)}>Browse Jobs</NavLink>
          {token && (
            <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {token && (
            <button onClick={handleLogout} className="text-left text-sm font-medium text-red-600">
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
