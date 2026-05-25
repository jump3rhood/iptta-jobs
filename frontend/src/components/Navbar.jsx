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
    `text-sm font-semibold tracking-wide transition-colors ${
      isActive ? 'text-brand-gold' : 'text-white/65 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-brand-burgundy shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/jobs" className="flex items-center gap-2.5 tap-highlight-none" onClick={() => setOpen(false)}>
            <img src="/favicon.png" alt="IPTTA" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            <div className="leading-none">
              <span className="font-display italic font-medium text-white text-[1.15rem] tracking-wide">
                IPTTA <span className="text-brand-gold not-italic font-semibold">Jobs</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {token && <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {token && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
              >
                Sign out
              </button>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setOpen(o => !o)}
              className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 tap-highlight-none transition-colors"
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
        <div className="md:hidden border-t border-white/10 bg-brand-burgundy-deep px-5 py-4 flex flex-col gap-4">
          {token && (
            <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {token && (
            <button onClick={handleLogout} className="text-left text-sm font-semibold text-brand-rose">
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
