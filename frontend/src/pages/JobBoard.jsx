import { useJobs } from '../context/JobsContext.jsx';
import JobCard from '../components/JobCard.jsx';
import JobFilters from '../components/JobFilters.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

export default function JobBoard() {
  const { jobs, loading, error, filters } = useJobs();

  const hasFilters = filters.roleType || filters.city || filters.jobType || filters.search;

  return (
    <div>
      {/* Hero — full-width with warm gradient */}
      <div className="hero-gradient border-b border-brand-blush">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-9">
          <div className="inline-flex items-center gap-2 border border-brand-rose/25 bg-white/60 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose inline-block"></span>
            <span className="text-[11px] font-bold text-brand-rose-dark tracking-widest uppercase">For IPTTA Graduates</span>
          </div>

          <h1 className="font-display italic font-medium text-brand-dark leading-[1.05] mb-3">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">Find your next</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl">
              Teaching Role
              <span className="inline-block w-3 h-3 rounded-full bg-brand-gold ml-3 mb-2 align-bottom"></span>
            </span>
          </h1>

          <p className="text-brand-muted text-sm sm:text-base font-medium max-w-md mt-4 leading-relaxed">
            Curated openings at verified schools across India — no account needed to apply.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-7">
        {/* Filters */}
        <div className="mb-7">
          <JobFilters />
        </div>

        {/* Results */}
        {loading && (
          <LoadingSpinner size="lg" className="py-20" />
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-brand-rose text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-brand-blush/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand-rose/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="font-display italic text-xl text-brand-dark">
              {hasFilters ? 'No jobs match your filters' : 'No openings yet'}
            </h2>
            <p className="text-sm text-brand-muted mt-1.5 font-medium">
              {hasFilters ? 'Try adjusting your search or filters.' : 'Check back soon or post a job below.'}
            </p>
            {!hasFilters && (
              <Link
                to="/submit"
                className="inline-block mt-5 bg-brand-rose hover:bg-brand-rose-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Post a Job
              </Link>
            )}
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-5">
              {jobs.length} {jobs.length === 1 ? 'opening' : 'openings'} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
