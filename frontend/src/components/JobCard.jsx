import { Link } from 'react-router-dom';

const ROLE_LABELS = {
  kindergarten: 'Kindergarten',
  primary: 'Primary',
  subject: 'Subject Teacher',
  montessori: 'Montessori',
  other: 'Other',
};

const JOB_TYPE_LABELS = {
  fulltime: 'Full-time',
  parttime: 'Part-time',
  substitute: 'Substitute',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job, index = 0 }) {
  return (
    <Link
      to={`/jobs/${job._id}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-fade-up block bg-white rounded-2xl border border-brand-blush/60 p-5 shadow-sm hover:shadow-md hover:border-brand-rose/40 hover:bg-brand-rose-light/20 transition-all duration-200 group tap-highlight-none border-l-[3px] border-l-brand-rose"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-display italic font-medium text-[1.15rem] leading-snug text-brand-dark group-hover:text-brand-rose-dark transition-colors line-clamp-2">
            {job.jobTitle}
          </h3>
          <p className="text-xs font-semibold text-brand-muted mt-0.5 truncate uppercase tracking-wide">
            {job.schoolName}
          </p>
        </div>
        <svg
          className="w-4 h-4 text-brand-blush group-hover:text-brand-rose flex-shrink-0 mt-1 transition-colors"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-brand-muted mb-3">
        <svg className="w-3 h-3 flex-shrink-0 text-brand-rose" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span className="truncate">{job.city}</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-rose-light text-brand-rose-dark">
          {ROLE_LABELS[job.roleType] || job.roleType}
        </span>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-gold-light text-brand-gold-dark">
          {JOB_TYPE_LABELS[job.jobType] || job.jobType}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-brand-blush/60">
        {job.salaryRange ? (
          <span className="text-sm font-bold text-brand-dark">{job.salaryRange}</span>
        ) : (
          <span className="text-xs text-brand-muted/70 italic font-medium">Salary not listed</span>
        )}
        <span className="text-[11px] text-brand-muted font-semibold">{timeAgo(job.submittedAt)}</span>
      </div>
    </Link>
  );
}
