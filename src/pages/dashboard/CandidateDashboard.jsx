import { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { Link, useNavigate } from 'react-router-dom';
import { formatSalaryWithSymbol } from '../../utils/formatSalary';
import {
  getCandidateProfile,
  saveCandidateProfile,
  calculateProfileCompletion,
} from '../../services/candidateProfileService';
import CandidateProfileView from '../../components/candidate/CandidateProfileView';
import CandidateProfileForm from '../../components/candidate/CandidateProfileForm';
import { ApplicationStatusModal } from '../../components/candidate/ApplicationStatusModal';
import { WithdrawApplicationModal } from '../../components/candidate/WithdrawApplicationModal';
import { QuickApplyModal } from '../../components/dashboard/QuickApplyModal';
import {
  MapPin,
  Building,
  ShieldCheck,
  LogOut,
  Briefcase,
  Bookmark,
  Building2,
  FileText,
  Edit3,
  User,
  Search,
  Filter,
  X,
  Clock,
  Send,
  Trash2,
  ArrowUpRight,
  RotateCcw,
  BarChart3,
} from 'lucide-react';
import { toast } from 'react-toastify';

// Helper to determine status badge colors
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'interview scheduled':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'under review':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'shortlisted':
      return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'offer extended':
    case 'offered':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'withdrawn':
      return 'bg-slate-100 text-slate-600 border-slate-300';
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'application submitted':
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200';
  }
};

// Helper to format application submission dates
const formatAppliedDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();
  const {
    totalCompanies,
    activeJobPostings,
    savedJobsCount,
    savedJobs,
    activeJobs = [],
    applications: allApplications = [],
    toggleSaveJob,
    applyToJob,
    withdrawApplication,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(() =>
    getCandidateProfile(user?.id, user)
  );
  const [prevUserId, setPrevUserId] = useState(user?.id);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  // Search & Filter state for Applications
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedAppForStatus, setSelectedAppForStatus] = useState(null);
  const [selectedAppForWithdraw, setSelectedAppForWithdraw] = useState(null);
  const [isQuickApplyOpen, setIsQuickApplyOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Sync profile when current user changes without cascading renders
  if (prevUserId !== user?.id) {
    setPrevUserId(user?.id);
    setProfile(getCandidateProfile(user?.id, user));
  }

  // Filter applications for the active candidate user
  const candidateApplications = useMemo(() => {
    return (allApplications || []).filter((app) => {
      // 1. Matches candidate email
      if (user?.email && app.candidateEmail) {
        if (app.candidateEmail.toLowerCase() === user.email.toLowerCase()) return true;
      }
      // 2. Matches candidate ID
      if (user?.id && app.candidateId && (app.candidateId === user.id || app.candidateId === `user-${user.id}`)) {
        return true;
      }
      // 3. Fallback for demo candidate user ('Alex Johnson' / 'candidate@jobportal.com')
      if (!user || user.email === 'candidate@jobportal.com' || user.role === 'candidate') {
        if (
          app.candidateEmail === 'candidate@jobportal.com' ||
          app.candidateId === 'user-cand-1' ||
          app.candidateId === 'cand-user'
        ) {
          return true;
        }
      }
      return false;
    });
  }, [allApplications, user]);

  // Search and Filter candidate applications
  const filteredApplications = useMemo(() => {
    return candidateApplications.filter((app) => {
      // Keyword search by Job Title, Company, or Location
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (app.jobTitle || app.title || '').toLowerCase().includes(q);
        const compMatch = (app.company || '').toLowerCase().includes(q);
        const locMatch = (app.location || '').toLowerCase().includes(q);
        if (!titleMatch && !compMatch && !locMatch) {
          return false;
        }
      }

      // Status dropdown filter
      if (statusFilter !== 'all') {
        if (app.status?.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [candidateApplications, searchQuery, statusFilter]);

  const completionPercentage = calculateProfileCompletion(profile);

  // Profile save handler
  const handleSaveProfile = (updatedProfileData) => {
    try {
      const saved = saveCandidateProfile(updatedProfileData);
      setProfile(saved);
      if (updateUserProfile) {
        updateUserProfile({
          fullName: saved.fullName,
          email: saved.email,
          phone: saved.mobileNumber,
          location: saved.address,
          title: saved.title,
          bio: saved.bio,
          profilePhoto: saved.profilePhoto,
        });
      }
      setIsEditingProfile(false);
      setIsCreatingProfile(false);
      toast.success('Candidate profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleEditFromDashboard = () => {
    setActiveTab('profile');
    setIsEditingProfile(true);
    setIsCreatingProfile(false);
  };

  // Withdraw confirmation handler
  const handleConfirmWithdraw = async (applicationId, reason) => {
    const res = await withdrawApplication(applicationId, reason);
    if (res?.success && selectedAppForStatus?.id === applicationId) {
      setSelectedAppForStatus(res.application);
    }
  };

  // Apply to job from Saved list
  const handleApplyFromSaved = (job) => {
    setSelectedJobForApply(job);
    setIsQuickApplyOpen(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Candidate Profile & Career Portal
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {profile?.fullName || user?.fullName || 'Candidate'}!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              {profile?.title || user?.title || 'Senior Frontend Developer'} • Track job submissions, manage saved openings, and verify candidate credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleEditFromDashboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>

            <Link
              to="/reports"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-bold shadow-md hover:bg-emerald-50 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              Reports & Analytics
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
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
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Active Openings
            </span>
            <strong className="text-xl font-black text-slate-900">
              {activeJobPostings}
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Saved Jobs
            </span>
            <strong className="text-xl font-black text-slate-900">
              {savedJobsCount}
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              My Submissions
            </span>
            <strong className="text-xl font-black text-slate-900">
              {candidateApplications.length}
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Hiring Companies
            </span>
            <strong className="text-xl font-black text-slate-900">
              {totalCompanies}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Tabs & Views Section */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
            }}
            className={`pb-2 text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-emerald-800 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Candidate Profile
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              {completionPercentage}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('applied');
              setIsEditingProfile(false);
              setIsCreatingProfile(false);
            }}
            className={`pb-2 text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applied'
                ? 'text-emerald-800 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            My Applications ({candidateApplications.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('saved');
              setIsEditingProfile(false);
              setIsCreatingProfile(false);
            }}
            className={`pb-2 text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'text-emerald-800 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved Jobs ({savedJobs.length})
          </button>
        </div>

        {/* Tab 1: Applications */}
        {activeTab === 'applied' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications by job title, company, or location..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2.5 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer appearance-none"
                  >
                    <option value="all">All Application Statuses</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {(searchQuery || statusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    title="Clear search and filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Counter & Active Filter Tag */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong className="font-bold text-slate-800">{filteredApplications.length}</strong> of{' '}
                <strong className="font-bold text-slate-800">{candidateApplications.length}</strong> applications
              </span>
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Filtered by: {statusFilter}
                </span>
              )}
            </div>

            {/* Applications List */}
            {candidateApplications.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0A2B1A]">No Job Applications Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You have not submitted any job applications yet. Browse openings and apply with 1-click.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Explore Open Jobs
                </Link>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Matching Applications</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No applications matched your search &quot;{searchQuery}&quot;
                  {statusFilter !== 'all' ? ` with status &quot;${statusFilter}&quot;` : ''}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-[#0A2B1A] text-base">
                          {app.jobTitle || app.title}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${getStatusBadgeClass(
                            app.status
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {app.status || 'Application Submitted'}
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
                        <span className="font-bold text-emerald-800">
                          {formatSalaryWithSymbol(app.salary)}
                        </span>
                        <span className="text-slate-400">
                          Applied on {formatAppliedDate(app.appliedDate)}
                        </span>
                      </div>

                      {app.status === 'Withdrawn' && app.withdrawReason && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 inline-block">
                          <span className="font-bold text-slate-700">Withdrawal Reason:</span> {app.withdrawReason}
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedAppForStatus(app)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        title="Track milestone timeline and review application details"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Track Status & Timeline
                      </button>

                      {app.status?.toLowerCase() !== 'withdrawn' && (
                        <button
                          type="button"
                          onClick={() => setSelectedAppForWithdraw(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                          title="Withdraw this job submission (UI Only)"
                        >
                          Withdraw
                        </button>
                      )}

                      {app.jobId && (
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                          title="View original job posting"
                        >
                          <span>View Job</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Jobs */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedJobs.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0A2B1A]">No Saved Jobs Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bookmark interesting job postings to review later or apply when you are ready.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Browse Jobs Directory
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-[#0A2B1A] text-base hover:text-emerald-700 transition-colors hover:underline truncate"
                        >
                          {job.title}
                        </Link>
                        {job.employmentType && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">
                            {job.employmentType}
                          </span>
                        )}
                        {job.category && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                            {job.category}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="font-bold text-emerald-800">
                          {formatSalaryWithSymbol(job.salaryRange || job.salary)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id, job.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                        title="Remove from saved jobs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyFromSaved(job)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply Now</span>
                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                        title="View full posting"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Candidate Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {isEditingProfile || isCreatingProfile ? (
              <CandidateProfileForm
                initialData={profile}
                onSave={handleSaveProfile}
                onCancel={() => {
                  setIsEditingProfile(false);
                  setIsCreatingProfile(false);
                }}
                isCreating={isCreatingProfile}
              />
            ) : (
              <CandidateProfileView
                profile={profile}
                onEdit={() => setIsEditingProfile(true)}
                onCreate={() => setIsCreatingProfile(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {/* 1. Track Application Status & Milestone Timeline */}
      <ApplicationStatusModal
        isOpen={!!selectedAppForStatus}
        onClose={() => setSelectedAppForStatus(null)}
        application={selectedAppForStatus}
        onWithdraw={(app) => {
          setSelectedAppForStatus(null);
          setSelectedAppForWithdraw(app);
        }}
      />

      {/* 2. Withdraw Application Confirmation Modal */}
      <WithdrawApplicationModal
        isOpen={!!selectedAppForWithdraw}
        onClose={() => setSelectedAppForWithdraw(null)}
        application={selectedAppForWithdraw}
        onConfirmWithdraw={handleConfirmWithdraw}
      />

      {/* 3. Quick Apply Modal for Saved Jobs */}
      <QuickApplyModal
        isOpen={isQuickApplyOpen}
        onClose={() => {
          setIsQuickApplyOpen(false);
          setSelectedJobForApply(null);
        }}
        onSubmitApplication={applyToJob}
        jobs={activeJobs}
        selectedJob={selectedJobForApply}
        currentUser={{
          ...user,
          fullName: profile?.fullName || user?.fullName,
          phone: profile?.mobileNumber || user?.phone,
        }}
      />
    </div>
  );
};

export default CandidateDashboard;
