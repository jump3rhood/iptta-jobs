import { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const STATUS_TABS = [
  { key: 'pending', label: 'Pending', color: 'text-amber-600 border-amber-500' },
  { key: 'active', label: 'Active', color: 'text-emerald-600 border-emerald-500' },
  { key: 'rejected', label: 'Rejected', color: 'text-red-500 border-red-400' },
  { key: 'expired', label: 'Expired', color: 'text-gray-500 border-gray-400' },
];

const ROLE_LABELS = {
  kindergarten: 'KG', primary: 'Primary', subject: 'Subject', montessori: 'Montessori', other: 'Other',
};
const JOB_TYPE_LABELS = { fulltime: 'Full-time', parttime: 'Part-time', substitute: 'Sub' };

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
};

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-xl border-2 ${color} p-4 flex-1 min-w-0`}>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function JobRow({ job, onApprove, onReject, onDelete, busy }) {
  const date = new Date(job.submittedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{job.jobTitle}</p>
          <p className="text-xs text-gray-500 truncate">{job.schoolName} · {job.city}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[job.status]}`}>
          {job.status}
        </span>
      </div>

      {/* Info row */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
        <span>{ROLE_LABELS[job.roleType] || job.roleType}</span>
        <span>·</span>
        <span>{JOB_TYPE_LABELS[job.jobType] || job.jobType}</span>
        {job.salaryRange && <><span>·</span><span>{job.salaryRange}</span></>}
        <span>·</span>
        <span>{date}</span>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 bg-gray-50 rounded-lg px-3 py-2">
        <span className="font-medium">{job.contactPerson}</span>
        <a href={`tel:${job.contactPhone}`} className="text-indigo-600 hover:underline">{job.contactPhone}</a>
        <a href={`mailto:${job.contactEmail}`} className="text-indigo-600 hover:underline truncate">{job.contactEmail}</a>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {job.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(job._id)}
              disabled={busy}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => onReject(job._id)}
              disabled={busy}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
            >
              ✕ Reject
            </button>
          </>
        )}
        {job.status === 'active' && (
          <button
            onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
            className="flex-1 border border-indigo-300 text-indigo-600 text-xs font-semibold py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            View Live
          </button>
        )}
        <button
          onClick={() => {
            if (window.confirm('Delete this job permanently?')) onDelete(job._id);
          }}
          disabled={busy}
          className="px-3 py-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 text-xs rounded-lg transition-colors"
        >
          🗑
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage all job submissions</p>
        </div>
        <button
          onClick={() => fetchAdminJobs()}
          disabled={loading}
          className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:underline"
        >
          {loading ? <LoadingSpinner size="sm" /> : '↻'} Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        <StatCard label="Pending" value={stats.pending} color="border-amber-300" />
        <StatCard label="Active" value={stats.active} color="border-emerald-300" />
        <StatCard label="Rejected" value={stats.rejected} color="border-red-200" />
        <StatCard label="Expired" value={stats.expired} color="border-gray-200" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? t.color
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {allJobs.filter(j => j.status === t.key).length > 0 && (
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {allJobs.filter(j => j.status === t.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading && <LoadingSpinner size="lg" className="py-12" />}

      {!loading && error && (
        <p className="text-center text-sm text-red-500 py-8">{error}</p>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No {tab} jobs.</p>
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
