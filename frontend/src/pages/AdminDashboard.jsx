import { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const STATUS_TABS = [
  { key: 'pending', label: 'Pending', activeClass: 'text-brand-gold-dark border-brand-gold' },
  { key: 'active', label: 'Active', activeClass: 'text-emerald-600 border-emerald-500' },
  { key: 'rejected', label: 'Rejected', activeClass: 'text-brand-rose border-brand-rose' },
  { key: 'expired', label: 'Expired', activeClass: 'text-brand-muted border-brand-muted' },
];

const ROLE_LABELS = {
  kindergarten: 'KG', primary: 'Primary', subject: 'Subject', montessori: 'Montessori', other: 'Other',
};
const JOB_TYPE_LABELS = { fulltime: 'Full-time', parttime: 'Part-time', substitute: 'Sub' };

const STATUS_BADGE = {
  pending: 'bg-brand-gold-light text-brand-gold-dark',
  active: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-brand-rose-light text-brand-rose-dark',
  expired: 'bg-brand-blush/50 text-brand-muted',
};

const STAT_STYLES = [
  { label: 'Pending', key: 'pending', border: 'border-brand-gold/40', num: 'text-brand-gold-dark font-display italic' },
  { label: 'Active', key: 'active', border: 'border-emerald-200', num: 'text-emerald-700 font-display italic' },
  { label: 'Rejected', key: 'rejected', border: 'border-brand-rose/30', num: 'text-brand-rose font-display italic' },
  { label: 'Expired', key: 'expired', border: 'border-brand-blush', num: 'text-brand-muted font-display italic' },
];

function StatCard({ label, value, border, num }) {
  return (
    <div className={`bg-white rounded-2xl border-2 ${border} p-4 flex-1 min-w-0`}>
      <p className={`text-3xl ${num}`}>{value}</p>
      <p className="text-[11px] text-brand-muted font-bold mt-1 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function JobRow({ job, onApprove, onReject, onDelete, busy }) {
  const date = new Date(job.submittedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-4 border-l-[3px] border-l-brand-rose">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-display italic font-medium text-base text-brand-dark leading-snug">{job.jobTitle}</p>
          <p className="text-xs font-semibold text-brand-muted truncate mt-0.5 uppercase tracking-wide">{job.schoolName} · {job.city}</p>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[job.status]}`}>
          {job.status}
        </span>
      </div>

      {/* Info row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-[11px] font-bold bg-brand-rose-light text-brand-rose-dark px-2.5 py-0.5 rounded-full">
          {ROLE_LABELS[job.roleType] || job.roleType}
        </span>
        <span className="text-[11px] font-bold bg-brand-gold-light text-brand-gold-dark px-2.5 py-0.5 rounded-full">
          {JOB_TYPE_LABELS[job.jobType] || job.jobType}
        </span>
        {job.salaryRange && (
          <span className="text-[11px] text-brand-muted font-medium px-1">{job.salaryRange}</span>
        )}
        <span className="text-[11px] text-brand-muted font-medium px-1">{date}</span>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap items-center gap-3 text-xs mb-3 bg-brand-cream/60 rounded-xl px-3 py-2 border border-brand-blush/60">
        <span className="font-bold text-brand-dark">{job.contactPerson}</span>
        <a href={`tel:${job.contactPhone}`} className="text-brand-rose font-semibold hover:text-brand-rose-dark hover:underline">{job.contactPhone}</a>
        <a href={`mailto:${job.contactEmail}`} className="text-brand-rose font-semibold hover:text-brand-rose-dark hover:underline truncate">{job.contactEmail}</a>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {job.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(job._id)}
              disabled={busy}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => onReject(job._id)}
              disabled={busy}
              className="flex-1 bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              ✕ Reject
            </button>
          </>
        )}
        {job.status === 'active' && (
          <button
            onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
            className="flex-1 border border-brand-rose/25 text-brand-rose text-xs font-bold py-2 rounded-xl hover:bg-brand-rose-light transition-colors"
          >
            View Live ↗
          </button>
        )}
        <button
          onClick={() => {
            if (window.confirm('Delete this job permanently?')) onDelete(job._id);
          }}
          disabled={busy}
          className="px-3 py-2 border border-brand-blush text-brand-muted hover:text-brand-rose hover:border-brand-rose/30 text-xs rounded-xl transition-colors"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { allJobs, stats, loading, error, fetchAdminJobs, approveJob, rejectJob, deleteJob } = useAdmin();
  const [tab, setTab] = useState('pending');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const filteredJobs = allJobs.filter(j => j.status === tab);

  const handle = async (fn, id) => {
    setBusy(true);
    setActionError('');
    try {
      await fn(id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display italic font-medium text-2xl sm:text-3xl text-brand-dark">Dashboard</h1>
          <p className="text-sm text-brand-muted mt-0.5 font-medium">Manage all job submissions</p>
        </div>
        <button
          onClick={() => fetchAdminJobs()}
          disabled={loading}
          className="text-sm text-brand-rose font-bold flex items-center gap-1.5 hover:text-brand-rose-dark transition-colors"
        >
          {loading ? <LoadingSpinner size="sm" /> : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {STAT_STYLES.map(s => (
          <StatCard key={s.key} label={s.label} value={stats[s.key] ?? 0} border={s.border} num={s.num} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-blush mb-5 overflow-x-auto scrollbar-none">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? t.activeClass
                : 'border-transparent text-brand-muted hover:text-brand-dark'
            }`}
          >
            {t.label}
            {allJobs.filter(j => j.status === t.key).length > 0 && (
              <span className="ml-1.5 text-[11px] bg-brand-blush/80 text-brand-muted font-bold px-1.5 py-0.5 rounded-full">
                {allJobs.filter(j => j.status === t.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="mb-4 bg-brand-rose-light border border-brand-rose/20 rounded-xl px-4 py-3 text-sm text-brand-rose-dark font-medium">
          {actionError}
        </div>
      )}

      {loading && <LoadingSpinner size="lg" className="py-12" />}

      {!loading && error && (
        <p className="text-center text-sm text-brand-rose py-8 font-medium">{error}</p>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-muted text-sm font-medium italic">No {tab} jobs.</p>
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          {filteredJobs.map(job => (
            <JobRow
              key={job._id}
              job={job}
              busy={busy}
              onApprove={id => handle(approveJob, id)}
              onReject={id => handle(rejectJob, id)}
              onDelete={id => handle(deleteJob, id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
