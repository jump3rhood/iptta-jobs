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

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-brand-blush/60 last:border-0">
      <p className="text-[11px] text-brand-muted uppercase tracking-widest font-bold mb-0.5">{label}</p>
      <p className="text-sm text-brand-dark font-medium">{value}</p>
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
        <div className="w-16 h-16 bg-brand-rose-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-rose/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-display italic text-xl text-brand-dark">Job not found</h2>
        <p className="text-sm text-brand-muted mt-1 font-medium">This listing may have expired or been removed.</p>
        <Link to="/jobs" className="inline-block mt-5 text-brand-rose font-bold text-sm hover:text-brand-rose-dark transition-colors">
          ← Back to all jobs
        </Link>
      </div>
    );
  }

  const joiningDate = job.joiningDate
    ? new Date(job.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-up">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-bold text-brand-muted hover:text-brand-rose mb-5 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to jobs
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5 mb-4 border-t-[3px] border-t-brand-rose">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[11px] font-bold bg-brand-rose-light text-brand-rose-dark px-2.5 py-1 rounded-full">
            {ROLE_LABELS[job.roleType] || job.roleType}
          </span>
          <span className="text-[11px] font-bold bg-brand-gold-light text-brand-gold-dark px-2.5 py-1 rounded-full">
            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
          </span>
          {job.certifications?.length > 0 && job.certifications.map(c => (
            <span key={c} className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
              {c}
            </span>
          ))}
        </div>

        <h1 className="font-display italic font-medium text-2xl sm:text-3xl text-brand-dark leading-snug mb-2">
          {job.jobTitle}
        </h1>

        <div className="flex items-center gap-1.5 text-brand-muted text-sm font-medium mb-5">
          <svg className="w-3.5 h-3.5 text-brand-rose flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="font-bold text-brand-dark">{job.schoolName}</span>
          <span className="text-brand-blush">·</span>
          <span>{job.city}</span>
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {job.salaryRange && (
            <div className="bg-brand-gold-light rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-brand-gold-dark font-bold uppercase tracking-wider">Salary</p>
              <p className="text-sm font-bold text-brand-dark mt-0.5">{job.salaryRange}</p>
            </div>
          )}
          {job.experienceRequired !== undefined && (
            <div className="bg-brand-rose-light/60 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Experience</p>
              <p className="text-sm font-bold text-brand-dark mt-0.5">
                {job.experienceRequired === 0 ? 'Freshers welcome' : `${job.experienceRequired}+ years`}
              </p>
            </div>
          )}
          {job.workingHours && (
            <div className="bg-brand-rose-light/60 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Hours</p>
              <p className="text-sm font-bold text-brand-dark mt-0.5">{job.workingHours}</p>
            </div>
          )}
          {job.workingDays && (
            <div className="bg-brand-rose-light/60 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Days</p>
              <p className="text-sm font-bold text-brand-dark mt-0.5">{job.workingDays}</p>
            </div>
          )}
        </div>
      </div>

      {/* Details card */}
      {(job.description || joiningDate || job.subject) && (
        <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5 mb-4">
          <h2 className="font-display italic text-lg text-brand-dark flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-brand-rose rounded-full inline-block"></span>
            Job Details
          </h2>
          <InfoRow label="Subject" value={job.subject} />
          <InfoRow label="Joining Date" value={joiningDate} />
          {job.description && (
            <div className="pt-3">
              <p className="text-[11px] text-brand-muted uppercase tracking-widest font-bold mb-2">Description</p>
              <p className="text-sm text-brand-dark leading-relaxed whitespace-pre-line font-medium">{job.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Contact card */}
      <div className="bg-brand-rose-light/40 rounded-2xl border border-brand-rose/20 p-5 mb-4">
        <h2 className="font-display italic text-lg text-brand-dark flex items-center gap-2 mb-1">
          <span className="w-1 h-5 bg-brand-gold rounded-full inline-block"></span>
          Contact the School
        </h2>
        <p className="text-sm font-bold text-brand-dark mt-2 mb-3">{job.contactPerson}</p>

        <div className="flex flex-col gap-2">
          <a
            href={`tel:${job.contactPhone}`}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-brand-rose/15 hover:border-brand-rose/30 hover:bg-brand-rose-light/30 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-brand-rose/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-rose" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Phone</p>
              <p className="text-sm font-bold text-brand-rose group-hover:text-brand-rose-dark transition-colors">{job.contactPhone}</p>
            </div>
          </a>

          <a
            href={`mailto:${job.contactEmail}`}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-brand-rose/15 hover:border-brand-gold/30 hover:bg-brand-gold-light/50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Email</p>
              <p className="text-sm font-bold text-brand-dark break-all">{job.contactEmail}</p>
            </div>
          </a>

          {job.whatsappNumber && (
            <a
              href={`https://wa.me/${job.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-brand-rose/15 hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">WhatsApp</p>
                <p className="text-sm font-bold text-green-700">{job.whatsappNumber}</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Share actions */}
      <div className="flex gap-3">
        <button
          onClick={whatsappShare}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-bold py-3 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Share on WhatsApp
        </button>
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
            copied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-brand-blush text-brand-muted hover:border-brand-rose hover:text-brand-rose'
          }`}
        >
          {copied ? '✓ Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
