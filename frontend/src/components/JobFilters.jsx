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

export default function JobFilters() {
  const { filters, setFilters } = useJobs();

  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const hasActiveFilters = filters.roleType || filters.city || filters.jobType || filters.search;

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {filters.search && (
          <button
            onClick={() => update('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter row — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        {/* City */}
        <input
          type="text"
          placeholder="City..."
          value={filters.city}
          onChange={e => update('city', e.target.value)}
          className="flex-shrink-0 w-32 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        {/* Role Type */}
        <select
          value={filters.roleType}
          onChange={e => update('roleType', e.target.value)}
          className="flex-shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Job Type */}
        <select
          value={filters.jobType}
          onChange={e => update('jobType', e.target.value)}
          className="flex-shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {JOB_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ roleType: '', city: '', jobType: '', search: '' })}
            className="flex-shrink-0 px-3 py-2 text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
