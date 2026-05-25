import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';
import JobForm from '../components/JobForm.jsx';

export default function AdminPostJob() {
  const { createJob } = useAdmin();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await createJob(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-brand-muted hover:text-brand-rose transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-brand-blush">·</span>
        <div>
          <h1 className="font-display italic font-medium text-2xl text-brand-dark leading-tight">Post a Job</h1>
          <p className="text-xs text-brand-muted font-medium">Job will go live immediately</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 bg-brand-rose-light border border-brand-rose/20 rounded-xl px-4 py-3 text-sm text-brand-rose-dark font-medium">
          {error}
        </div>
      )}

      <JobForm
        onSubmit={handleSubmit}
        submitLabel="Post Job"
        submitting={submitting}
      />
    </div>
  );
}
