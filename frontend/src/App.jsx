import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { JobsProvider } from './context/JobsContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import JobBoard from './pages/JobBoard.jsx';
import JobDetail from './pages/JobDetail.jsx';
import SubmitJob from './pages/SubmitJob.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <JobsProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to="/jobs" replace />} />
                <Route path="/jobs" element={<JobBoard />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/submit" element={<SubmitJob />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </JobsProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
