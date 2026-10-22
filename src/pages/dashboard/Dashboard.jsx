import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/dashboard/StatCard';
import DashboardStats from '../../components/dashboard/DashboardStats';
import QuickActionCards from '../../components/dashboard/QuickActionCards';
import RecentActivities from '../../components/dashboard/RecentActivities';
import SavedJobsSection from '../../components/dashboard/SavedJobsSection';
import PostJobModal from '../../components/dashboard/PostJobModal';
import QuickApplyModal from '../../components/dashboard/QuickApplyModal';
import CompanyDirectoryModal from '../../components/dashboard/CompanyDirectoryModal';

import {
  Building2,
  Briefcase,
  Users,
  FileText,
  Bookmark,
  CheckCircle,
  RefreshCw,
  PlusCircle,
  Search,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    totalCompanies,
    totalJobs,
    activeJobPostings,
    totalCandidates,
    totalApplications,
    savedJobsCount,
    savedJobs,
    recentActivities,
    monthlyTrends,
    categoryBreakdown,
    applicationStatusStages,
    companies,
    activeJobs,
    toggleSaveJob,
    postNewJob,
    applyToJob,
    resetToDefaults,
    refreshData,
    loading,
  } = useDashboard();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Modal controls
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isQuickApplyOpen, setIsQuickApplyOpen] = useState(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Search filter for active jobs tab
  const [jobSearch, setJobSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredJobs = activeJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.location.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' || job.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenApply = (job = null) => {
    setSelectedJobForApply(job || activeJobs[0]);
    setIsQuickApplyOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Welcome & Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Professional'}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Monitoring platform metrics across <strong className="text-white">{totalCompanies} companies</strong>,{' '}
              <strong className="text-white">{totalJobs} jobs</strong>, and{' '}
              <strong className="text-white">{totalApplications} candidate applications</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all cursor-pointer"
              title="Refresh LocalStorage data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {user?.role === 'recruiter' ? (
              <button
                type="button"
                onClick={() => setIsPostJobOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Job</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenApply(null)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Quick Apply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('active-jobs')}
          className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'active-jobs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Jobs ({activeJobPostings})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved-jobs')}
          className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'saved-jobs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Saved Jobs ({savedJobsCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activities')}
          className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Recent Activities ({recentActivities.length})
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* STATS SECTION: All 6 Core Numbers Prominently Displayed */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Key Platform Metrics</h2>
              <p className="text-xs text-slate-500">
                Core statistical indicators calculated from Local Storage
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* 1. Total Companies */}
              <StatCard
                title="Total Companies"
                value={totalCompanies}
                icon={Building2}
                colorScheme="amber"
                badgeText="Verified"
                subtitle="Active Employers"
                onClick={() => setIsCompaniesOpen(true)}
              />

              {/* 2. Total Jobs */}
              <StatCard
                title="Total Jobs"
                value={totalJobs}
                icon={Briefcase}
                colorScheme="indigo"
                trend="+18%"
                trendPositive={true}
                subtitle="All Postings"
                onClick={() => setActiveTab('active-jobs')}
              />

              {/* 3. Active Job Postings */}
              <StatCard
                title="Active Postings"
                value={activeJobPostings}
                icon={CheckCircle}
                colorScheme="emerald"
                badgeText="Hiring Now"
                trend="+12%"
                trendPositive={true}
                onClick={() => setActiveTab('active-jobs')}
              />

              {/* 4. Total Candidates */}
              <StatCard
                title="Total Candidates"
                value={totalCandidates}
                icon={Users}
                colorScheme="purple"
                trend="+24%"
                trendPositive={true}
                subtitle="Talent Roster"
              />

              {/* 5. Total Applications */}
              <StatCard
                title="Total Applications"
                value={totalApplications}
                icon={FileText}
                colorScheme="blue"
                trend="+31%"
                trendPositive={true}
                subtitle="Submitted"
              />

              {/* 6. Saved Jobs */}
              <StatCard
                title="Saved Jobs"
                value={savedJobsCount}
                icon={Bookmark}
                colorScheme="rose"
                badgeText="Watchlist"
                subtitle="Personalized"
                onClick={() => setActiveTab('saved-jobs')}
              />
            </div>
          </div>

          {/* QUICK ACTION CARDS */}
          <QuickActionCards
            role={user?.role || 'candidate'}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onOpenQuickApply={() => handleOpenApply(null)}
            onViewSavedJobs={() => setActiveTab('saved-jobs')}
            onViewAllJobs={() => setActiveTab('active-jobs')}
            onViewCompanies={() => setIsCompaniesOpen(true)}
            onResetData={resetToDefaults}
          />

          {/* DASHBOARD STATISTICS: Trends, Category Breakdown, Status Funnel */}
          <DashboardStats
            monthlyTrends={monthlyTrends}
            categoryBreakdown={categoryBreakdown}
            applicationStatusStages={applicationStatusStages}
          />

          {/* TWO COLUMN GRID: RECENT ACTIVITIES & SAVED JOBS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Activities (7 cols) */}
            <div className="lg:col-span-7">
              <RecentActivities activities={recentActivities} />
            </div>

            {/* Saved Jobs Quick Widget (5 cols) */}
            <div className="lg:col-span-5">
              <SavedJobsSection
                savedJobs={savedJobs}
                onUnsaveJob={toggleSaveJob}
                onApplyJob={handleOpenApply}
                onBrowseJobs={() => setActiveTab('active-jobs')}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE JOBS LISTING */}
      {activeTab === 'active-jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Active Job Postings ({filteredJobs.length})
              </h2>
              <p className="text-xs text-slate-500">
                Browse positions, bookmark to Saved Jobs, or submit quick applications
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Filter by title, company, or city..."
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="DevOps">DevOps</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Marketing">Marketing</option>
                <option value="Security">Security</option>
              </select>

              <button
                type="button"
                onClick={() => setIsPostJobOpen(true)}
                className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post Job
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.some((s) => s.id === job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {job.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id, job.title)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600'
                        }`}
                        title={isSaved ? 'Saved' : 'Bookmark job'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {job.company}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Posted on {job.postedDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      {job.applicantsCount || 0} applicants
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenApply(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED JOBS */}
      {activeTab === 'saved-jobs' && (
        <SavedJobsSection
          savedJobs={savedJobs}
          onUnsaveJob={toggleSaveJob}
          onApplyJob={handleOpenApply}
          onBrowseJobs={() => setActiveTab('active-jobs')}
        />
      )}

      {/* TAB 4: RECENT ACTIVITIES FULL */}
      {activeTab === 'activities' && (
        <RecentActivities activities={recentActivities} />
      )}

      {/* MODAL 1: Post New Job */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onSubmitJob={postNewJob}
        defaultCompany={user?.companyName || 'TechCorp Solutions'}
      />

      {/* MODAL 2: Quick Apply */}
      <QuickApplyModal
        isOpen={isQuickApplyOpen}
        onClose={() => setIsQuickApplyOpen(false)}
        onSubmitApplication={applyToJob}
        jobs={activeJobs}
        selectedJob={selectedJobForApply}
        currentUser={user}
      />

      {/* MODAL 3: Verified Companies Directory */}
      <CompanyDirectoryModal
        isOpen={isCompaniesOpen}
        onClose={() => setIsCompaniesOpen(false)}
        companies={companies}
      />
    </div>
  );
};

export default Dashboard;
