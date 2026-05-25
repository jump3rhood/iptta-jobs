import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [magicLinks, setMagicLinks] = useState([]);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const login = async (password) => {
    const res = await fetch(`${API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Invalid password');
    localStorage.setItem('adminToken', json.token);
    setToken(json.token);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAllJobs([]);
  };

  const fetchAdminJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/admin/jobs`, { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch');
      setAllJobs(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const approveJob = async (id) => {
    const res = await fetch(`${API}/api/admin/jobs/${id}/approve`, {
      method: 'POST',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to approve');
    setAllJobs(prev => prev.map(j => j._id === id ? { ...j, status: 'active' } : j));
    return json;
  };

  const rejectJob = async (id) => {
    const res = await fetch(`${API}/api/admin/jobs/${id}/reject`, {
      method: 'POST',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reject');
    setAllJobs(prev => prev.map(j => j._id === id ? { ...j, status: 'rejected' } : j));
    return json;
  };

  const editJob = async (id, data) => {
    const res = await fetch(`${API}/api/admin/jobs/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update');
    setAllJobs(prev => prev.map(j => j._id === id ? json : j));
    return json;
  };

  const createJob = async (data) => {
    const res = await fetch(`${API}/api/admin/jobs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create');
    setAllJobs(prev => [json, ...prev]);
    return json;
  };

  const deleteJob = async (id) => {
    const res = await fetch(`${API}/api/admin/jobs/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete');
    setAllJobs(prev => prev.filter(j => j._id !== id));
    return json;
  };

  const fetchMagicLinks = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/magic-links`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch links');
    setMagicLinks(json);
  }, [authHeaders]);

  const createMagicLink = async (callerName, callerPhone) => {
    const res = await fetch(`${API}/api/admin/magic-links`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ callerName, callerPhone }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create link');
    setMagicLinks(prev => [json, ...prev]);
    return json;
  };

  const deleteMagicLink = async (id) => {
    const res = await fetch(`${API}/api/admin/magic-links/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete link');
    setMagicLinks(prev => prev.filter(l => l._id !== id));
    return json;
  };

  const stats = useMemo(() => ({
    pending: allJobs.filter(j => j.status === 'pending').length,
    active: allJobs.filter(j => j.status === 'active').length,
    rejected: allJobs.filter(j => j.status === 'rejected').length,
    expired: allJobs.filter(j => j.status === 'expired').length,
  }), [allJobs]);

  return (
    <AdminContext.Provider value={{
      token, login, logout,
      allJobs, stats, loading, error,
      fetchAdminJobs, approveJob, rejectJob, editJob, createJob, deleteJob,
      magicLinks, fetchMagicLinks, createMagicLink, deleteMagicLink,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
