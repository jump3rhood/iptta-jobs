import { useJobs } from '../context/JobsContext.jsx';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'kindergarten', label: 'Kindergarten' },
  { value: 'primary', label: 'Primary' },
  { value: 'subject', label: 'Subject Teacher' },
  { value: 'montessori', label: 'Montessori' },
  { value: 'other', label: 'Other' },
];

const JOB_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'substitute', label: 'Substitute' },
];

const baseInput =
  'bg-white border border-brand-blush rounded-xl text-sm text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-colors placeholder-brand-muted/50';

export default function JobFilters() {
  const { filters, setFilters } = useJobs();

  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const hasActiveFilters = filters.roleType || filters.city || filters.jobType || filters.search;

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search jobs or schools..."
          value={filters.search}
          onChange={e => update('search', e.target.value)}
          className={`w-full pl-10 pr-10 py-2.5 ${baseInput}`}
        />
        {filters.search && (
          <button
            onClick={() => update('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-rose transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter row — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        <input
          type="text"
          placeholder="City..."
          value={filters.city}
          onChange={e => update('city', e.target.value)}
          className={`flex-shrink-0 w-28 px-3 py-2 ${baseInput}`}
        />

        <select
          value={filters.roleType}
          onChange={e => update('roleType', e.target.value)}
          className={`flex-shrink-0 px-3 py-2 ${baseInput}`}
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.jobType}
          onChange={e => update('jobType', e.target.value)}
          className={`flex-shrink-0 px-3 py-2 ${baseInput}`}
        >
          {JOB_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ roleType: '', city: '', jobType: '', search: '' })}
            className="flex-shrink-0 px-3 py-2 text-xs font-bold text-brand-rose bg-brand-rose-light border border-brand-rose/20 rounded-xl hover:bg-brand-rose hover:text-white transition-all whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
