import { useJobs } from '../context/JobsContext.jsx';
import JobCard from '../components/JobCard.jsx';
import JobFilters from '../components/JobFilters.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

export default function JobBoard() {
  const { jobs, loading, error, filters } = useJobs();

  const hasFilters = filters.roleType || filters.city || filters.jobType || filters.search;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Teaching Jobs Near You
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Curated openings at verified schools — no account needed to apply.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <JobFilters />
      </div>

      {/* Results */}
      {loading && (
        <LoadingSpinner size="lg" className="py-20" />
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <h2 className="text-lg font-semibold text-gray-700">
            {hasFilters ? 'No jobs match your filters' : 'No jobs posted yet'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {hasFilters ? 'Try adjusting your search or filters.' : 'Check back soon or post a job below.'}
          </p>
          {!hasFilters && (
            <Link
              to="/submit"
              className="inline-block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Post a Job
            </Link>
          )}
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
