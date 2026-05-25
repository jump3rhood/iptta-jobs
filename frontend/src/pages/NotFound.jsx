import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-brand-rose-light rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-9 h-9 text-brand-rose/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-2">Error 404</p>
      <h1 className="font-display italic font-medium text-3xl sm:text-4xl text-brand-dark mb-3">Page Not Found</h1>
      <p className="text-brand-muted text-sm font-medium mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 bg-brand-rose hover:bg-brand-rose-dark text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </Link>
    </div>
  );
}
