import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  LogOut,
  Briefcase,
  Bookmark,
  Building2,
  FileText,
  Sparkles,
} from 'lucide-react';

export const CandidateDashboard = () => {
  const { user, logout } = useAuth();
  const {
    totalCompanies,
    activeJobPostings,
    savedJobsCount,
    savedJobs,
    toggleSaveJob,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('applied');

  // Candidate applications
  const applications = [
    {
      id: 'app-1',
      title: 'Senior Frontend Engineer (React 19)',
      company: 'TechCorp Solutions',
      location: 'Remote, US',
      salary: '$130,000 - $155,000',
      appliedDate: 'Oct 18, 2026',
      status: 'Interview Scheduled',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'app-2',
      title: 'Full Stack Node & React Developer',
      company: 'Digital Horizon Labs',
      location: 'Austin, TX',
      salary: '$120,000 - $145,000',
      appliedDate: 'Oct 16, 2026',
      status: 'Under Review',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'app-3',
      title: 'Cloud DevOps Architect',
      company: 'CloudSphere Global',
      location: 'San Francisco, CA',
      salary: '$145,000 - $175,000',
      appliedDate: 'Oct 10, 2026',
      status: 'Application Submitted',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Candidate Profile & Career Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-xl">
              {user?.title || 'Job Seeker'} • Track your submissions, manage saved positions, and monitor your candidate profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-bold shadow-md hover:bg-indigo-50 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Platform Analytics
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">Active Openings</span>
            <strong className="text-xl font-black text-slate-900">{activeJobPostings}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">Saved Jobs</span>
            <strong className="text-xl font-black text-slate-900">{savedJobsCount}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">My Submissions</span>
            <strong className="text-xl font-black text-slate-900">{applications.length}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">Hiring Companies</span>
            <strong className="text-xl font-black text-slate-900">{totalCompanies}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Local Storage User Profile Data Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-100">
                {user?.fullName?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {user?.fullName}
                </h3>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                  {user?.title || 'Candidate Profile'}
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Profile details read directly from Local Storage */}
            <div className="py-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate font-medium text-slate-800">{user?.email}</span>
              </div>

              {user?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{user.phone}</span>
                </div>
              )}

              {user?.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{user.location}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Active Session: <strong className="text-slate-700">Protected & Verified</strong>
                </span>
              </div>
            </div>

            {user?.bio && (
              <div className="mt-2 pt-4 border-t border-slate-100">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Bio / Summary
                </label>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {user.bio}
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="font-mono">Storage ID: {user?.id}</span>
              <Link to="/dashboard" className="text-indigo-600 hover:underline font-semibold">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Applications & Activity Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('applied')}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'applied'
                  ? 'text-indigo-600 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Applications ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'saved'
                  ? 'text-indigo-600 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
          </div>

          {/* Tab 1: Applications */}
          {activeTab === 'applied' && (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {app.title}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${app.statusColor}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {app.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.location}
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {app.salary}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:pl-4 sm:border-slate-100">
                    <span className="text-[11px] text-slate-400 block">Applied on</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {app.appliedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Saved Jobs */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedJobs.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  You have not saved any jobs yet. Visit the{' '}
                  <Link to="/dashboard" className="text-indigo-600 font-bold hover:underline">
                    Master Dashboard
                  </Link>{' '}
                  to browse and bookmark openings.
                </div>
              ) : (
                savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {job.company} • {job.location} • {job.salary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id, job.title)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                      <Link
                        to="/dashboard"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
