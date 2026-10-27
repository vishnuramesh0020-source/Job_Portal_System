import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { Link } from 'react-router-dom';
import { formatSalaryWithSymbol } from '../../utils/formatSalary';
import {
  getCandidateProfile,
  saveCandidateProfile,
  calculateProfileCompletion,
} from '../../services/candidateProfileService';
import CandidateProfileView from '../../components/candidate/CandidateProfileView';
import CandidateProfileForm from '../../components/candidate/CandidateProfileForm';
import {
  MapPin,
  Building,
  ShieldCheck,
  LogOut,
  Briefcase,
  Bookmark,
  Building2,
  FileText,
  Sparkles,
  Edit3,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const CandidateDashboard = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const {
    totalCompanies,
    activeJobPostings,
    savedJobsCount,
    savedJobs,
    toggleSaveJob,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(() =>
    getCandidateProfile(user?.id, user)
  );
  const [prevUserId, setPrevUserId] = useState(user?.id);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  // Sync profile when current user changes without cascading renders
  if (prevUserId !== user?.id) {
    setPrevUserId(user?.id);
    setProfile(getCandidateProfile(user?.id, user));
  }

  // Candidate applications
  const applications = [
    {
      id: 'app-1',
      title: 'Senior Frontend Engineer (React 19)',
      company: 'TechCorp Solutions',
      location: 'Remote, US',
      salary: '₹18,00,000 - ₹24,00,000',
      appliedDate: 'Oct 18, 2026',
      status: 'Interview Scheduled',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'app-2',
      title: 'Full Stack Node & React Developer',
      company: 'Digital Horizon Labs',
      location: 'Austin, TX',
      salary: '₹14,00,000 - ₹20,00,000',
      appliedDate: 'Oct 16, 2026',
      status: 'Under Review',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'app-3',
      title: 'Cloud DevOps Architect',
      company: 'CloudSphere Global',
      location: 'San Francisco, CA',
      salary: '₹22,00,000 - ₹30,00,000',
      appliedDate: 'Oct 10, 2026',
      status: 'Application Submitted',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

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
              Welcome back, {profile?.fullName || user?.fullName}!
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
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-bold shadow-md hover:bg-emerald-50 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Analytics
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
              {applications.length}
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
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'applied'
                  ? 'text-emerald-800 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Applications ({applications.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('saved');
                setIsEditingProfile(false);
                setIsCreatingProfile(false);
              }}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'saved'
                  ? 'text-emerald-800 after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
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
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                      <span className="font-semibold text-emerald-700">
                        {app.salary}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:pl-4 sm:border-slate-100">
                    <span className="text-[11px] text-slate-400 block">
                      Applied on
                    </span>
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
                  <Link
                    to="/jobs"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Jobs Directory
                  </Link>{' '}
                  to browse and bookmark openings.
                </div>
              ) : (
                savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-slate-900 hover:text-emerald-700 transition-colors block"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        {job.company} • {job.location} •{' '}
                        {formatSalaryWithSymbol(
                          job.salaryRange || job.salary
                        )}
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
                        to={`/jobs/${job.id}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                ))
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
    </div>
  );
};

export default CandidateDashboard;
