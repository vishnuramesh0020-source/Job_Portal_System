import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  jobService,
  JOB_CATEGORIES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  LOCATION_TYPES,
} from '../../services/jobService';
import {
  matchesSalaryRange,
  SALARY_FILTER_OPTIONS,
  parseSalaryMinMax,
} from '../../utils/formatSalary';
import JobCard from '../../components/jobs/JobCard';
import JobDetailModal from '../../components/jobs/JobDetailModal';
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
  MapPin,
  IndianRupee,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  X,
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
  const currentLoc = searchParams.get('location') || 'all';
  const currentSal = searchParams.get('salary') || 'all';

  // Data states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState(currentQ);
  const [selectedLocation, setSelectedLocation] = useState(currentLoc);
  const [selectedLocationType, setSelectedLocationType] = useState('all');
  const [selectedType, setSelectedType] = useState(currentType);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState(currentSal);
  const [selectedCategory, setSelectedCategory] = useState(currentCat);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // Sort by Latest Jobs (Default)

  // Sync state if URL query params change (e.g. from Hero search/tag click)
  const [prevUrlParams, setPrevUrlParams] = useState({
    q: currentQ,
    cat: currentCat,
    type: currentType,
    loc: currentLoc,
    sal: currentSal,
  });

  if (
    prevUrlParams.q !== currentQ ||
    prevUrlParams.cat !== currentCat ||
    prevUrlParams.type !== currentType ||
    prevUrlParams.loc !== currentLoc ||
    prevUrlParams.sal !== currentSal
  ) {
    setPrevUrlParams({
      q: currentQ,
      cat: currentCat,
      type: currentType,
      loc: currentLoc,
      sal: currentSal,
    });
    setSearchQuery(currentQ);
    setSelectedCategory(currentCat);
    setSelectedType(currentType);
    setSelectedLocation(currentLoc);
    setSelectedSalary(currentSal);
    setCurrentPage(1);
  }

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailJob, setDetailJob] = useState(null);
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

  // Extract distinct locations from job data
  const availableLocations = useMemo(() => {
    const locSet = new Set();
    jobs.forEach((j) => {
      if (j.location) {
        // Strip out parenthetical tags like '(Hybrid)' for clean city/state matching
        const clean = j.location.replace(/\s*\([^)]*\)/g, '').trim();
        if (clean) locSet.add(clean);
      }
    });
    return Array.from(locSet).sort();
  }, [jobs]);

  // Filtered & Sorted Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Search Query (Search Jobs by Title, Company, Location, Skills, Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.category?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          (Array.isArray(j.skills) && j.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // 2. Filter by Location
    if (selectedLocation !== 'all') {
      const targetLoc = selectedLocation.toLowerCase().trim();
      result = result.filter((j) =>
        j.location?.toLowerCase().includes(targetLoc)
      );
    }

    // 2b. Filter by Work Mode (Remote / Hybrid / On-site)
    if (selectedLocationType !== 'all') {
      result = result.filter(
        (j) =>
          (j.locationType && j.locationType.toLowerCase() === selectedLocationType.toLowerCase()) ||
          (j.location && j.location.toLowerCase().includes(selectedLocationType.toLowerCase()))
      );
    }

    // 3. Filter by Job Type (Employment Type)
    if (selectedType !== 'all') {
      result = result.filter(
        (j) =>
          (j.employmentType && j.employmentType.toLowerCase() === selectedType.toLowerCase()) ||
          (j.type && j.type.toLowerCase() === selectedType.toLowerCase())
      );
    }

    // 4. Filter by Experience Level
    if (selectedLevel !== 'all') {
      result = result.filter((j) => j.experienceLevel === selectedLevel);
    }

    // 5. Filter by Salary Range (INR Lakhs)
    if (selectedSalary !== 'all') {
      result = result.filter((j) =>
        matchesSalaryRange(j.salaryRange || j.salary, selectedSalary)
      );
    }

    // 6. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((j) => j.category === selectedCategory);
    }

    // 7. Status Filter (Open / Closed)
    if (selectedStatus === 'open') {
      result = result.filter((j) => j.status === 'Open' || j.status === 'Active');
    } else if (selectedStatus === 'closed') {
      result = result.filter((j) => j.status === 'Closed');
    }

    // 8. Sort by Latest Jobs & Other Criteria
    result.sort((a, b) => {
      // Sort by Latest Jobs (Default)
      if (sortBy === 'newest') {
        return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.postedDate || 0) - new Date(b.postedDate || 0);
      }
      // Sort by Salary (High to Low)
      if (sortBy === 'salary-desc') {
        const salaryA = parseSalaryMinMax(a.salaryRange || a.salary).max;
        const salaryB = parseSalaryMinMax(b.salaryRange || b.salary).max;
        return salaryB - salaryA;
      }
      // Sort by Salary (Low to High)
      if (sortBy === 'salary-asc') {
        const salaryA = parseSalaryMinMax(a.salaryRange || a.salary).min;
        const salaryB = parseSalaryMinMax(b.salaryRange || b.salary).min;
        return salaryA - salaryB;
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
  }, [
    jobs,
    searchQuery,
    selectedLocation,
    selectedLocationType,
    selectedType,
    selectedLevel,
    selectedSalary,
    selectedCategory,
    selectedStatus,
    sortBy,
  ]);

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

  // Handlers for Add / Edit / Delete / Detail View
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

  const handleOpenQuickView = (job) => {
    setDetailJob(job);
    setIsDetailModalOpen(true);
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
    setSelectedLocation('all');
    setSelectedLocationType('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setSelectedSalary('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Popular quick location shortcuts
  const popularLocations = ['Remote', 'San Francisco', 'New York', 'Austin', 'Seattle'];

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedLocation !== 'all' ||
    selectedLocationType !== 'all' ||
    selectedType !== 'all' ||
    selectedLevel !== 'all' ||
    selectedSalary !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    sortBy !== 'newest'
  );

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Explore & Discover Job Openings
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Find your next role with advanced multi-criteria filtering by Location, Job Type, Experience Level, and Salary Range in Indian Rupees (₹).
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium">
                Total Jobs: <strong className="text-indigo-300">{jobs.length}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-medium">
                Open Positions: <strong className="text-emerald-200">{totalOpenCount}</strong>
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

      {/* COMPREHENSIVE JOB SEARCH & FILTER CONTROL PANEL */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        {/* Row 1: Search Jobs Input (Full Width on mobile, 7 cols on lg) + Location Quick Chips */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Main Keyword Search Input */}
          <div className="lg:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search jobs by title, skills (e.g. React, Python), company, or keywords..."
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort by Latest Jobs Dropdown (4 cols) */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-semibold"
            >
              <option value="newest">Latest Jobs (Newest First)</option>
              <option value="oldest">Oldest Jobs First</option>
              <option value="salary-desc">Salary: High to Low</option>
              <option value="salary-asc">Salary: Low to High</option>
              <option value="title-asc">Job Title (A-Z)</option>
              <option value="title-desc">Job Title (Z-A)</option>
              <option value="deadline">Application Deadline</option>
              <option value="applicants">Most Applicants</option>
            </select>
          </div>
        </div>

        {/* Quick Location Pills Shortcut */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Quick Locations:
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedLocation('all');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              selectedLocation === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {popularLocations.map((loc) => {
            const isSelected = selectedLocation.toLowerCase().includes(loc.toLowerCase());
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSelectedLocation(isSelected ? 'all' : loc);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>

        {/* Row 2: Filter Grid: Location, Job Type, Experience Level, Salary Range, Work Mode, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
          {/* 1. Filter by Location */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-500" />
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Locations</option>
              <option value="Remote">Remote</option>
              {availableLocations
                .filter((loc) => !loc.toLowerCase().includes('remote'))
                .map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
            </select>
          </div>

          {/* 2. Filter by Job Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-indigo-500" />
              Job Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Job Types</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filter by Experience Level */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-indigo-500" />
              Experience
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Levels</option>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Filter by Salary Range (INR) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-600" />
              Salary Range
            </label>
            <select
              value={selectedSalary}
              onChange={(e) => {
                setSelectedSalary(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              {SALARY_FILTER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Filter by Work Mode (Remote / Hybrid / On-site) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-500" />
              Work Mode
            </label>
            <select
              value={selectedLocationType}
              onChange={(e) => {
                setSelectedLocationType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Work Modes</option>
              {LOCATION_TYPES.map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Filter by Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-indigo-500" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar & Results Summary */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">
              Found <strong className="text-indigo-600 font-bold">{totalItems}</strong> matching jobs
            </span>

            {hasActiveFilters && (
              <>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-medium">Active:</span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    Keyword: "{searchQuery}"
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLocation !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                    Location: {selectedLocation}
                    <button
                      type="button"
                      onClick={() => setSelectedLocation('all')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-medium">
                    Type: {selectedType}
                    <button
                      type="button"
                      onClick={() => setSelectedType('all')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLevel !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                    Level: {selectedLevel}
                    <button
                      type="button"
                      onClick={() => setSelectedLevel('all')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedSalary !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    Salary: {SALARY_FILTER_OPTIONS.find((s) => s.id === selectedSalary)?.label}
                    <button
                      type="button"
                      onClick={() => setSelectedSalary('all')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLocationType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                    Mode: {selectedLocationType}
                    <button
                      type="button"
                      onClick={() => setSelectedLocationType('all')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 font-medium">
                    Category: {selectedCategory}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {sortBy !== 'newest' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                    Sort: {sortBy}
                    <button
                      type="button"
                      onClick={() => setSortBy('newest')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}

            {/* Items Per Page Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
              >
                <option value={6}>6 / page</option>
                <option value={9}>9 / page</option>
                <option value={12}>12 / page</option>
                <option value={18}>18 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 animate-pulse"
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
        /* EMPTY SEARCH STATE */
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Job Openings Matched Your Search</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            We couldn't find any job positions matching your search keyword or selected filter criteria. Try broadening your location, adjusting the salary range, or resetting filters.
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
              Post a New Job
            </button>
          </div>
        </div>
      ) : (
        /* JOB CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
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
                onQuickView={handleOpenQuickView}
                canManage={true}
              />
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!loading && totalItems > 0 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </strong>{' '}
            of <strong className="text-indigo-600 font-bold">{totalItems}</strong> job postings
          </span>

          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Number Pills */}
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => {
                  setCurrentPage(pageNum);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer ${
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
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: JOB DETAIL VIEW MODAL */}
      <JobDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        job={detailJob}
        onApply={handleOpenApplyModal}
        onToggleSave={toggleSaveJob}
        isSaved={detailJob ? savedJobIds.some((sId) => String(sId) === String(detailJob.id)) : false}
      />

      {/* MODAL 2: ADD / EDIT JOB */}
      <JobFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitJob={handleSaveJob}
        initialData={activeJob}
        isEditMode={isEditMode}
        defaultCompany={user?.companyName || 'TechCorp Solutions'}
      />

      {/* MODAL 3: DELETE CONFIRMATION */}
      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        job={activeJob}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* MODAL 4: QUICK APPLY */}
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