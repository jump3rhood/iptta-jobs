import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ROLE_LABELS = {
  kindergarten: 'Kindergarten', primary: 'Primary', subject: 'Subject Teacher',
  montessori: 'Montessori', other: 'Other',
};
const JOB_TYPE_LABELS = {
  fulltime: 'Full-time', parttime: 'Part-time', substitute: 'Substitute',
};

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappShare = () => {
    const text = encodeURIComponent(`${job.jobTitle} at ${job.schoolName} (${job.city})\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) return <LoadingSpinner size="lg" className="py-24" />;

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">😕</p>
        <h2 className="text-lg font-semibold text-gray-700">Job not found</h2>
        <p className="text-sm text-gray-500 mt-1">This listing may have expired or been removed.</p>
        <Link to="/jobs" className="inline-block mt-5 text-indigo-600 font-medium text-sm hover:underline">
          ← Back to all jobs
        </Link>
      </div>
    );
  }

  const joiningDate = job.joiningDate
    ? new Date(job.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to jobs
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            {ROLE_LABELS[job.roleType] || job.roleType}
          </span>
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
          </span>
          {job.certifications?.length > 0 && job.certifications.map(c => (
            <span key={c} className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
              {c}
            </span>
          ))}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-1">
          {job.jobTitle}
        </h1>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.schoolName} · {job.city}
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 gap-3">
          {job.salaryRange && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">Salary</p>
              <p className="text-sm font-semibold text-gray-800">{job.salaryRange}</p>
            </div>
          )}
          {job.experienceRequired !== undefined && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">Experience</p>
              <p className="text-sm font-semibold text-gray-800">
                {job.experienceRequired === 0 ? 'Freshers welcome' : `${job.experienceRequired}+ years`}
              </p>
            </div>
          )}
          {job.workingHours && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">Hours</p>
              <p className="text-sm font-semibold text-gray-800">{job.workingHours}</p>
            </div>
          )}
          {job.workingDays && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">Days</p>
              <p className="text-sm font-semibold text-gray-800">{job.workingDays}</p>
            </div>
          )}
        </div>
      </div>

      {/* Details card */}
      {(job.description || joiningDate || job.subject) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Job Details</h2>
          <InfoRow icon="📋" label="Subject" value={job.subject} />
          <InfoRow icon="📅" label="Joining Date" value={joiningDate} />
          {job.description && (
            <div className="pt-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Contact card */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Contact the School</h2>
        <p className="text-sm font-medium text-gray-800 mb-3">{job.contactPerson}</p>

        <div className="flex flex-col gap-2">
          <a
            href={`tel:${job.contactPhone}`}
            className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <span className="text-xl">📞</span>
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm font-semibold text-indigo-700">{job.contactPhone}</p>
            </div>
          </a>

          <a
            href={`mailto:${job.contactEmail}`}
            className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <span className="text-xl">✉️</span>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-semibold text-indigo-700 break-all">{job.contactEmail}</p>
            </div>
          </a>

          {job.whatsappNumber && (
            <a
              href={`https://wa.me/${job.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              <span className="text-xl">💬</span>
              <div>
                <p className="text-xs text-gray-400">WhatsApp</p>
                <p className="text-sm font-semibold text-indigo-700">{job.whatsappNumber}</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Share actions */}
      <div className="flex gap-3">
        <button
          onClick={whatsappShare}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
        >
          <span className="text-base">💬</span> Share on WhatsApp
        </button>
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
            copied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? '✓ Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
