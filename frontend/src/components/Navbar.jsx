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
            <div className="w-8 h-8 rounded-full bg-brand-rose/20 border border-brand-rose/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <div className="leading-none">
              <span className="font-display italic font-medium text-white text-[1.15rem] tracking-wide">
                IPTTA <span className="text-brand-gold not-italic font-semibold">Jobs</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/jobs" className={linkClass}>Browse Jobs</NavLink>
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
            <Link
              to="/submit"
              className="bg-brand-gold hover:bg-brand-gold-dark text-brand-burgundy-deep text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Post a Job
            </Link>
          </div>

          {/* Mobile: Post a job + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/submit"
              onClick={() => setOpen(false)}
              className="bg-brand-gold text-brand-burgundy-deep text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Post a Job
            </Link>
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
          <NavLink to="/jobs" className={linkClass} onClick={() => setOpen(false)}>Browse Jobs</NavLink>
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
