import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { Link } from 'react-router-dom';
import JobFormModal from '../../components/jobs/JobFormModal';
import { formatSalaryWithSymbol } from '../../utils/formatSalary';
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
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const {
    totalJobs,
    activeJobPostings,
    totalCandidates,
    totalApplications,
    activeJobs = [],
    postNewJob,
  } = useDashboard();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Pagination for Active Job Postings: show only 4 in front
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const totalPages = Math.ceil(activeJobs.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = activeJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Recruiter stats overview
  const stats = [
    { label: 'Platform Jobs', value: totalJobs, icon: Briefcase, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Active Postings', value: activeJobPostings, icon: CheckCircle2, color: 'text-teal-700 bg-teal-50' },
    { label: 'Total Candidates', value: totalCandidates, icon: Users, color: 'text-purple-700 bg-purple-50' },
    { label: 'Total Applications', value: totalApplications, icon: FileText, color: 'text-blue-700 bg-blue-50' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-semibold tracking-wide uppercase border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Recruiter & Employer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {user?.companyName || 'Recruiter Workspace'}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Managed by <span className="text-white font-medium">{user?.fullName}</span>. Oversee your talent pipeline, review applicants, and publish new roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/reports"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-950 text-xs font-bold shadow-md hover:bg-emerald-50 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              Reports & Analytics
            </Link>

            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
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
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <h3 className="text-2xl font-black text-[#0A2B1A]">{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recruiter & Company Details Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-emerald-100">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0A2B1A] text-lg">
                  {user?.companyName || 'Verified Employer'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{user?.title || 'Talent Acquisition'}</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 mt-1 border border-emerald-100">
                  Verified Seat
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>{user?.phone || '+1 (555) 019-2834'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span className="truncate">{user?.companyWebsite || 'https://recruiter.company.com'}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Master Analytics</span>
              <Link to="/dashboard" className="font-bold text-emerald-800 hover:text-emerald-950">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Posted Jobs Section: Showing only 4 in front with pagination */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-extrabold text-[#0A2B1A] text-lg flex items-center gap-2">
                  <span>Active Job Postings</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeJobs.length} Live
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Live listings updated in local storage</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Job</span>
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {activeJobs.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-slate-600">No active job postings yet.</p>
                  <p className="text-[11px] text-slate-400">Click &quot;Post New Job&quot; above to create your first listing.</p>
                </div>
              ) : (
                paginatedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50/20 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-[#0A2B1A] text-sm hover:text-emerald-700 transition-colors block truncate"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-700">{job.company}</span>
                        <span>•</span>
                        <span>{job.category}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-800">{formatSalaryWithSymbol(job.salaryRange || job.salary)}</span>
                        <span>•</span>
                        <span className="text-slate-400">Posted {job.postedDate}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <Users className="w-3.5 h-3.5" />
                        {job.applicantsCount || 0} Applicants
                      </span>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                      >
                        View / Edit →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls (Showing only 4 in front) */}
            {totalPages > 1 && (
              <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Showing <strong className="font-bold text-[#0A2B1A]">{startIndex + 1}</strong> to{' '}
                  <strong className="font-bold text-[#0A2B1A]">{Math.min(startIndex + ITEMS_PER_PAGE, activeJobs.length)}</strong> of{' '}
                  <strong className="font-bold text-[#0A2B1A]">{activeJobs.length}</strong> postings
                </span>

                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={validPage === 1}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        validPage === pageNum
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={validPage === totalPages}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <JobFormModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmitJob={postNewJob}
        defaultCompany={user?.companyName || 'TechCorp Solutions'}
      />
    </div>
  );
};

export default RecruiterDashboard;
