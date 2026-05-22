import { Link } from 'react-router-dom';

const ROLE_LABELS = {
  kindergarten: 'Kindergarten',
  primary: 'Primary',
  subject: 'Subject Teacher',
  montessori: 'Montessori',
  other: 'Other',
};

const ROLE_COLORS = {
  kindergarten: 'bg-pink-100 text-pink-700',
  primary: 'bg-blue-100 text-blue-700',
  subject: 'bg-purple-100 text-purple-700',
  montessori: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-600',
};

const JOB_TYPE_LABELS = {
  fulltime: 'Full-time',
  parttime: 'Part-time',
  substitute: 'Substitute',
};

const JOB_TYPE_COLORS = {
  fulltime: 'bg-green-100 text-green-700',
  parttime: 'bg-amber-100 text-amber-700',
  substitute: 'bg-orange-100 text-orange-700',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group tap-highlight-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {job.jobTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{job.schoolName}</p>
        </div>
        <svg
          className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-0.5 transition-colors"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {job.city}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[job.roleType] || ROLE_COLORS.other}`}>
          {ROLE_LABELS[job.roleType] || job.roleType}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${JOB_TYPE_COLORS[job.jobType] || JOB_TYPE_COLORS.fulltime}`}>
          {JOB_TYPE_LABELS[job.jobType] || job.jobType}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {job.salaryRange ? (
          <span className="text-sm font-medium text-gray-700">{job.salaryRange}</span>
        ) : (
          <span className="text-sm text-gray-400">Salary not listed</span>
        )}
        <span className="text-xs text-gray-400">{timeAgo(job.submittedAt)}</span>
      </div>
    </Link>
  );
}
