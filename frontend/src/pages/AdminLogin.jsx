import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminLogin() {
  const { login, token } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  if (token) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 hero-gradient">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-brand-burgundy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg className="w-7 h-7 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/>
            </svg>
          </div>
          <h1 className="font-display italic text-2xl text-brand-dark">Admin Access</h1>
          <p className="text-sm text-brand-muted mt-1 font-medium">Sign in to manage job listings</p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-brand-blush rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setVisible(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-rose transition-colors"
                  tabIndex={-1}
                >
                  {visible ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-brand-rose-dark bg-brand-rose-light border border-brand-rose/20 rounded-xl px-3 py-2 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-burgundy hover:bg-brand-burgundy-deep disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <><LoadingSpinner size="sm" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
