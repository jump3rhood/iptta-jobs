import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ roleType: '', city: '', jobType: '', search: '' });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.roleType) params.set('roleType', filters.roleType);
      if (filters.city) params.set('city', filters.city);
      if (filters.jobType) params.set('jobType', filters.jobType);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`${API}/api/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to load jobs');
      setJobs(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const submitJob = async (data) => {
    const res = await fetch(`${API}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Submission failed');
    return json;
  };

  const getJobById = async (id) => {
    const res = await fetch(`${API}/api/jobs/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Job not found');
    return json;
  };

  return (
    <JobsContext.Provider value={{ jobs, loading, error, filters, setFilters, submitJob, getJobById, fetchJobs }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => useContext(JobsContext);
