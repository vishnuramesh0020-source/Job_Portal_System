import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import CompaniesList from './pages/companies/CompaniesList';
import CompanyDetails from './pages/companies/CompanyDetails';
import JobsList from './pages/jobs/JobsList';
import JobDetails from './pages/jobs/JobDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Default root redirects directly to Jobs Search Directory */}
                <Route path="/" element={<Navigate to="/jobs" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Job Posting & Job Search Routes */}
                <Route path="/jobs" element={<JobsList />} />
                <Route path="/search" element={<JobsList />} />
                <Route path="/jobs/:id" element={<JobDetails />} />

                {/* Company Management Routes */}
                <Route path="/companies" element={<CompaniesList />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />

                {/* Master Responsive Dashboard Route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Candidate Route */}
                <Route
                  path="/candidate/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Recruiter Route */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback & 404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />

            {/* Toast Notification Container */}
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
