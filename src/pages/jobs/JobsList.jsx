import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  jobService,
  JOB_CATEGORIES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
} from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import JobFormModal from '../../components/jobs/JobFormModal';
import DeleteJobModal from '../../components/jobs/DeleteJobModal';
import QuickApplyModal from '../../components/dashboard/QuickApplyModal';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import {
  Briefcase,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const JobsList = () => {
  const { user } = useAuth();
  const {
    savedJobIds,
    toggleSaveJob,
    applyToJob,
    refreshData: refreshDashboardMetrics,
  } = useDashboard();

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQ = searchParams.get('q') || '';
  const currentCat = searchParams.get('category') || 'all';
  const currentType = searchParams.get('type') || 'all';

  // Data states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState(currentQ);
  const [selectedCategory, setSelectedCategory] = useState(currentCat);
  const [selectedType, setSelectedType] = useState(currentType);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Sync state if URL query params change (e.g. from Hero search/tag click)
  const [prevUrlParams, setPrevUrlParams] = useState({ q: currentQ, cat: currentCat, type: currentType });
  if (
    prevUrlParams.q !== currentQ ||
    prevUrlParams.cat !== currentCat ||
    prevUrlParams.type !== currentType
  ) {
    setPrevUrlParams({ q: currentQ, cat: currentCat, type: currentType });
    setSearchQuery(currentQ);
    setSelectedCategory(currentCat);
    setSelectedType(currentType);
    setCurrentPage(1);
  }

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    let isMounted = true;
    jobService
      .getJobs()
      .then((data) => {
        if (isMounted) {
          setJobs(data);
          refreshDashboardMetrics();
        }
      })
      .catch(() => {
        if (isMounted) toast.error('Could not load jobs directory.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshDashboardMetrics]);

  // Filtered & Sorted Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          (Array.isArray(j.skills) && j.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((j) => j.category === selectedCategory);
    }

    // 3. Employment Type Filter
    if (selectedType !== 'all') {
      result = result.filter(
        (j) =>
          (j.employmentType && j.employmentType.toLowerCase() === selectedType.toLowerCase()) ||
          (j.type && j.type.toLowerCase() === selectedType.toLowerCase())
      );
    }

    // 4. Experience Level Filter
    if (selectedLevel !== 'all') {
      result = result.filter((j) => j.experienceLevel === selectedLevel);
    }

    // 5. Status Filter (Open / Closed)
    if (selectedStatus === 'open') {
      result = result.filter((j) => j.status === 'Open' || j.status === 'Active');
    } else if (selectedStatus === 'closed') {
      result = result.filter((j) => j.status === 'Closed');
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'applicants') {
        return (b.applicantsCount || 0) - (a.applicantsCount || 0);
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, selectedCategory, selectedType, selectedLevel, selectedStatus, sortBy]);

  // Pagination slice
  const totalItems = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Quick stats
  const totalOpenCount = jobs.filter((j) => j.status === 'Open' || j.status === 'Active').length;
  const totalClosedCount = jobs.filter((j) => j.status === 'Closed').length;

  // Handlers for Add / Edit / Delete
  const handleOpenAddModal = () => {
    setActiveJob(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setActiveJob(job);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (job) => {
    setActiveJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleOpenApplyModal = (job) => {
    setActiveJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSaveJob = async (formData) => {
    try {
      if (isEditMode && activeJob) {
        const updated = await jobService.updateJob(activeJob.id, formData);
        setJobs((prev) =>
          prev.map((j) => (String(j.id) === String(activeJob.id) ? updated : j))
        );
        toast.success(`Updated "${updated.title}" successfully!`);
      } else {
        const created = await jobService.createJob(formData);
        setJobs((prev) => [created, ...prev]);
        toast.success(`Job "${created.title}" published!`);
      }
      refreshDashboardMetrics();
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to save job posting.');
      return false;
    }
  };

  const handleConfirmDelete = async (jobId) => {
    try {
      await jobService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));
      toast.success('Job posting deleted.');
      refreshDashboardMetrics();
    } catch {
      toast.error('Failed to delete job.');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Verified Job Postings
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Explore open positions with complete compensation, required skills, and application deadlines. Publish and manage job postings with live synchronization.
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium">
                Total Jobs: <strong className="text-indigo-300">{jobs.length}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-medium">
                Open: <strong className="text-emerald-200">{totalOpenCount}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 font-medium">
                Closed: <strong className="text-rose-200">{totalClosedCount}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Sort & Items Per Page */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input (4 cols) */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, company, skills, or city..."
              className="w-full pl-10 pr-7 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Job Category (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Types</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Levels</option>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Job Status: All / Open / Closed (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open Positions ({totalOpenCount})</option>
              <option value="closed">Closed Positions ({totalClosedCount})</option>
            </select>
          </div>
        </div>

        {/* Secondary row: Sort and Items Per Page */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="deadline">Deadline Approaching</option>
              <option value="applicants">Most Applicants</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(searchQuery ||
          selectedCategory !== 'all' ||
          selectedType !== 'all' ||
          selectedLevel !== 'all' ||
          selectedStatus !== 'all' ||
          sortBy !== 'newest') && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Keyword: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-medium">
                  Type: {selectedType}
                </span>
              )}
              {selectedLevel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                  Level: {selectedLevel}
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                  Status: {selectedStatus}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedJobs.length === 0 ? (
        /* EMPTY STATE */
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Job Postings Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any job openings matching your current search query "{searchQuery}" or selected filters.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Post New Job
            </button>
          </div>
        </div>
      ) : (
        /* JOB CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => {
            const isSaved = savedJobIds.some((sId) => String(sId) === String(job.id));
            return (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onApply={handleOpenApplyModal}
                onToggleSave={toggleSaveJob}
                canManage={true}
              />
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!loading && totalItems > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </strong>{' '}
            of <strong className="text-slate-800">{totalItems}</strong> job postings
          </span>

          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Number Pills */}
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT JOB */}
      <JobFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitJob={handleSaveJob}
        initialData={activeJob}
        isEditMode={isEditMode}
        defaultCompany={user?.companyName || 'TechCorp Solutions'}
      />

      {/* MODAL 2: DELETE CONFIRMATION */}
      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        job={activeJob}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* MODAL 3: QUICK APPLY */}
      <QuickApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitApplication={applyToJob}
        jobs={jobs}
        selectedJob={activeJob}
        currentUser={user}
      />
    </div>
  );
};

export default JobsList;
