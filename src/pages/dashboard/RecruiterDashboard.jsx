import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { Link } from 'react-router-dom';
import PostJobModal from '../../components/dashboard/PostJobModal';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  PlusCircle,
  Users,
  Briefcase,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const {
    totalJobs,
    activeJobPostings,
    totalCandidates,
    totalApplications,
    activeJobs,
    postNewJob,
  } = useDashboard();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Recruiter stats overview
  const stats = [
    { label: 'Platform Jobs', value: totalJobs, icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Active Postings', value: activeJobPostings, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Candidates', value: totalCandidates, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Applications', value: totalApplications, icon: FileText, color: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Recruiter & Employer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.companyName || 'Recruiter Workspace'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Managed by <span className="text-white font-medium">{user?.fullName}</span>. Oversee your talent pipeline, review applicants, and publish new roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-bold shadow-md hover:bg-indigo-50 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Master Analytics
            </Link>

            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Job</span>
            </button>

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

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900">{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recruiter & Company Details Card (Stored in Local Storage) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-amber-100">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {user?.companyName || 'Company Profile'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Recruiter: {user?.fullName}</p>
                <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Profile fields read from Local Storage */}
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

              {user?.companyWebsite && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={user.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline truncate"
                  >
                    {user.companyWebsite}
                  </a>
                </div>
              )}
            </div>

            {user?.bio && (
              <div className="mt-2 pt-4 border-t border-slate-100">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  About Company
                </label>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {user.bio}
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="font-mono">User ID: {user?.id}</span>
              <Link to="/dashboard" className="text-indigo-600 hover:underline font-semibold">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Posted Jobs Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Active Job Postings</h3>
                <p className="text-xs text-slate-500">Live listings updated in local storage</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Post New Job
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                    <p className="text-xs text-slate-500">
                      {job.company} • {job.category} • {job.location} • Posted {job.postedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      <Users className="w-3.5 h-3.5" />
                      {job.applicantsCount || 0} Applicants
                    </span>
                    <Link
                      to="/dashboard"
                      className="text-xs font-medium text-slate-600 hover:text-indigo-600"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmitJob={postNewJob}
        defaultCompany={user?.companyName || 'TechCorp Solutions'}
      />
    </div>
  );
};

export default RecruiterDashboard;
