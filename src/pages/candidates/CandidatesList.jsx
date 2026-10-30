import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import {
  candidateService,
  getStoredCandidates,
  CANDIDATE_TITLES,
  EXPERIENCE_LEVELS,
  AVAILABILITY_OPTIONS,
} from '../../services/candidateService';
import {
  Users,
  Search,
  MapPin,
  Briefcase,
  Star,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Code2,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Send,
  RotateCcw,
  UserCheck,
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const CandidatesList = () => {
  const { user } = useAuth();
  const { refreshData: refreshDashboardMetrics } = useDashboard();
  const [candidates, setCandidates] = useState(() => getStoredCandidates());
  const [loading, setLoading] = useState(() => getStoredCandidates().length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modal states
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [selectedJobForInvite, setSelectedJobForInvite] = useState('');

  // CRUD Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    roleTitle: CANDIDATE_TITLES[0],
    email: '',
    phone: '',
    city: 'Bengaluru',
    street: '',
    companyName: 'TechCorp Engineering',
    headline: '',
    bio: '',
    skills: 'React, TypeScript, Tailwind CSS, REST APIs',
    experienceLevel: EXPERIENCE_LEVELS[0],
    availability: AVAILABILITY_OPTIONS[0],
    yearsOfExperience: '5',
    website: 'https://portfolio.dev',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Load Candidates from User API / local cache
  const loadCandidates = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) setIsRefreshing(true);
      setError(null);

      const data = await candidateService.getCandidates(forceRefresh);
      setCandidates(data);

      if (forceRefresh) {
        refreshDashboardMetrics();
        toast.success('Synced candidates with third-party User API (/users)!');
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
      setError(err.message || 'Failed to fetch candidate directory.');
      toast.error('Could not load candidates.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [refreshDashboardMetrics]);

  useEffect(() => {
    let isMounted = true;
    candidateService
      .getCandidates(false)
      .then((data) => {
        if (isMounted) {
          setCandidates(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch candidate directory.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Unique list of disciplines & cities for filters
  const disciplines = useMemo(() => {
    return [
      'Frontend',
      'Backend',
      'Full Stack',
      'DevOps & Cloud',
      'Mobile',
      'AI / Machine Learning',
      'UI/UX Design',
    ];
  }, []);

  const cities = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => {
      if (c.city) set.add(c.city);
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Filtered & Sorted candidates
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = candidate.fullName?.toLowerCase().includes(q);
          const matchesTitle = candidate.roleTitle?.toLowerCase().includes(q) || candidate.title?.toLowerCase().includes(q);
          const matchesLocation = candidate.location?.toLowerCase().includes(q) || candidate.city?.toLowerCase().includes(q);
          const matchesSkills = candidate.skills?.some((s) => s.toLowerCase().includes(q));
          const matchesCompany = candidate.companyName?.toLowerCase().includes(q);
          const matchesEmail = candidate.email?.toLowerCase().includes(q);

          if (!matchesName && !matchesTitle && !matchesLocation && !matchesSkills && !matchesCompany && !matchesEmail) {
            return false;
          }
        }

        if (selectedDiscipline !== 'all') {
          const t = (candidate.roleTitle || candidate.title || '').toLowerCase();
          const d = selectedDiscipline.toLowerCase();
          if (d === 'frontend' && !t.includes('frontend')) return false;
          if (d === 'backend' && !t.includes('backend')) return false;
          if (d === 'full stack' && !t.includes('full stack')) return false;
          if (d === 'devops & cloud' && !t.includes('devops') && !t.includes('cloud') && !t.includes('sre')) return false;
          if (d === 'mobile' && !t.includes('mobile')) return false;
          if (d === 'ai / machine learning' && !t.includes('ai') && !t.includes('machine learning')) return false;
          if (d === 'ui/ux design' && !t.includes('designer') && !t.includes('ui/ux')) return false;
        }

        if (selectedExperience !== 'all') {
          const years = candidate.yearsOfExperience || 0;
          if (selectedExperience === 'entry' && years > 2) return false;
          if (selectedExperience === 'mid' && (years < 3 || years > 5)) return false;
          if (selectedExperience === 'senior' && years < 6) return false;
        }

        if (selectedAvailability !== 'all') {
          if (selectedAvailability === 'immediate' && !candidate.availability?.toLowerCase().includes('immediate')) {
            return false;
          }
          if (selectedAvailability === '15days' && !candidate.availability?.includes('15')) {
            return false;
          }
          if (selectedAvailability === '1month' && !candidate.availability?.includes('1 Month')) {
            return false;
          }
        }

        if (selectedCity !== 'all' && candidate.city !== selectedCity) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        if (sortBy === 'experience') return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
        if (sortBy === 'name') return (a.fullName || '').localeCompare(b.fullName || '');
        return 0;
      });
  }, [
    candidates,
    searchQuery,
    selectedDiscipline,
    selectedExperience,
    selectedAvailability,
    selectedCity,
    sortBy,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('all');
    setSelectedExperience('all');
    setSelectedAvailability('all');
    setSelectedCity('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleOpenProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleOpenContact = (candidate) => {
    setSelectedCandidate(candidate);
    setContactMessage(`Hi ${candidate.fullName.split(' ')[0]}, we reviewed your profile on VS Job Portal and would like to discuss an opportunity with our team.`);
    setIsContactModalOpen(true);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    toast.success(`Interview invitation transmitted to ${selectedCandidate?.fullName}!`);
    setIsContactModalOpen(false);
    setContactMessage('');
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedCandidate(null);
    setFormData({
      fullName: '',
      roleTitle: CANDIDATE_TITLES[0],
      email: '',
      phone: '+91 98765 43210',
      city: 'Bengaluru',
      street: '12th Cross, Tech Park',
      companyName: 'TechCorp Engineering',
      headline: 'Specialized in scalable frontend & backend architectures',
      bio: 'Committed to high-standard engineering, performance optimization, and agile team delivery.',
      skills: 'React, TypeScript, Tailwind CSS, REST APIs',
      experienceLevel: EXPERIENCE_LEVELS[0],
      availability: AVAILABILITY_OPTIONS[0],
      yearsOfExperience: '5',
      website: 'https://portfolio.dev',
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (candidate, e) => {
    e?.stopPropagation();
    setIsEditMode(true);
    setSelectedCandidate(candidate);
    setFormData({
      fullName: candidate.fullName || '',
      roleTitle: candidate.roleTitle || candidate.title || CANDIDATE_TITLES[0],
      email: candidate.email || '',
      phone: candidate.phone || '',
      city: candidate.city || 'Bengaluru',
      street: candidate.street || '',
      companyName: candidate.companyName || 'Independent Talent',
      headline: candidate.headline || '',
      bio: candidate.bio || '',
      skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills || '',
      experienceLevel: candidate.experienceLevel || EXPERIENCE_LEVELS[0],
      availability: candidate.availability || AVAILABILITY_OPTIONS[0],
      yearsOfExperience: String(candidate.yearsOfExperience || '4'),
      website: candidate.website || '',
    });
    setIsFormModalOpen(true);
  };

  // Handle Form Submit (POST /users or PUT /users/:id)
  const handleSaveCandidate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && selectedCandidate) {
        const updated = await candidateService.updateCandidate(selectedCandidate.id, formData);
        setCandidates((prev) =>
          prev.map((c) => (String(c.id) === String(selectedCandidate.id) ? updated : c))
        );
        toast.success(`Updated candidate "${updated.fullName}" successfully!`);
      } else {
        const created = await candidateService.addCandidate(formData);
        setCandidates((prev) => [created, ...prev]);
        toast.success(`Candidate "${created.fullName}" registered to directory!`);
      }
      setIsFormModalOpen(false);
      refreshDashboardMetrics();
    } catch (err) {
      toast.error(err.message || 'Failed to save candidate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Candidate (DELETE /users/:id)
  const handleOpenDeleteModal = (candidate, e) => {
    e?.stopPropagation();
    setCandidateToDelete(candidate);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;
    try {
      await candidateService.deleteCandidate(candidateToDelete.id);
      setCandidates((prev) => prev.filter((c) => String(c.id) !== String(candidateToDelete.id)));
      toast.success(`Candidate profile "${candidateToDelete.fullName}" deleted.`);
      setIsDeleteModalOpen(false);
      setCandidateToDelete(null);
      refreshDashboardMetrics();
    } catch {
      toast.error('Failed to delete candidate.');
    }
  };

  // If logged-in as Candidate, redirect away from the talent recruiter directory to Candidate Portal
  if (user?.role === 'candidate') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0A2B1A] via-[#0F3822] to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold tracking-wide uppercase border border-white/15">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Verified User API Candidates
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Candidate Talent Directory
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every candidate is integrated directly with the <code className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">/users</code> REST API endpoint. Includes live contact, employer history, and technical profiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === 'recruiter' && (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0A2B1A] text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Candidate</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => loadCandidates(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync User API'}</span>
            </button>

            <Link
              to="/candidate/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>My Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search candidates by name, job role, skills (React, Node.js), employer company, or city..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {/* Discipline */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Discipline
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => {
                setSelectedDiscipline(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">All Disciplines</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">Any Experience</option>
              <option value="entry">Entry Level (&le; 2 yrs)</option>
              <option value="mid">Mid Level (3-5 yrs)</option>
              <option value="senior">Senior Level (6+ yrs)</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">All Availability</option>
              <option value="immediate">Immediate Joiners</option>
              <option value="15days">15 Days Notice</option>
              <option value="1month">1 Month Notice</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Location / City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">All Locations</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
            >
              <option value="featured">Featured / Relevant</option>
              <option value="rating">Top Rated (⭐)</option>
              <option value="experience">Years of Experience</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {(searchQuery ||
          selectedDiscipline !== 'all' ||
          selectedExperience !== 'all' ||
          selectedAvailability !== 'all' ||
          selectedCity !== 'all') && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
              <span className="font-semibold text-slate-700">Active Filters:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Keyword: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedDiscipline !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedDiscipline}
                </span>
              )}
              {selectedExperience !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Exp: {selectedExperience}
                </span>
              )}
              {selectedAvailability !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedAvailability}
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedCity}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Candidate Count Subheader */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <p>
          Showing <strong className="font-bold text-[#0A2B1A]">{filteredCandidates.length}</strong> candidates mapped from User API
        </p>
        <span className="text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          Page {validPage} of {totalPages}
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded-md w-full" />
              <div className="h-3 bg-slate-200 rounded-md w-5/6" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-rose-800 font-bold text-sm">{error}</p>
          <button
            type="button"
            onClick={() => loadCandidates(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : paginatedCandidates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No candidates match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or clearing your discipline and experience filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {paginatedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-emerald-300 relative"
            >
              <div className="space-y-4">
                {/* Header: Photo, Name, Verified Badge, Rating & Edit/Delete buttons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={candidate.avatar}
                        alt={candidate.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 shadow-xs"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs"
                        title="Verified Candidate (User API)"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-extrabold text-[#0A2B1A] text-base group-hover:text-emerald-800 transition-colors truncate">
                        {candidate.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {candidate.roleTitle || candidate.title}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{candidate.companyName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Rating */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{candidate.rating}</span>
                    </div>

                    {user?.role === 'recruiter' && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditModal(candidate, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit Candidate (PUT /users)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteModal(candidate, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Candidate (DELETE /users)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location from User API address */}
                <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{candidate.location}</span>
                </p>

                {/* Experience & Availability Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-500" />
                    {candidate.yearsOfExperience}+ Years Experience
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-md font-semibold border ${
                      candidate.availability?.includes('Immediate')
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-teal-50 text-teal-900 border-teal-200'
                    }`}
                  >
                    {candidate.availability}
                  </span>
                </div>

                {/* Catchphrase / Headline from User API */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  &ldquo;{candidate.headline || candidate.bio}&rdquo;
                </p>

                {/* Skills Chips */}
                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Core Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills?.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50/70 text-emerald-900 border border-emerald-200/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills?.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-5 mt-5 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenProfile(candidate)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-900 transition-colors text-center cursor-pointer"
                >
                  View Profile
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenContact(candidate)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Showing <strong className="font-bold text-[#0A2B1A]">{startIndex + 1}</strong> to{' '}
            <strong className="font-bold text-[#0A2B1A]">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredCandidates.length)}
            </strong>{' '}
            of <strong className="font-bold text-[#0A2B1A]">{filteredCandidates.length}</strong> candidates
          </p>

          <div className="flex items-center justify-center gap-1.5 self-center">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  validPage === page
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Candidate Full Profile Modal */}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-scaleUp">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#0A2B1A] via-[#0F3822] to-emerald-900 p-6 sm:p-8 text-white rounded-t-3xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Verified User API Candidate
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {selectedCandidate.fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 font-semibold flex items-center gap-2">
                    <span>{selectedCandidate.roleTitle || selectedCandidate.title}</span>
                    <span>•</span>
                    <span className="text-emerald-200">{selectedCandidate.companyName}</span>
                  </p>
                  <p className="text-xs text-emerald-200/90 flex items-center gap-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{selectedCandidate.location}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
                  <p className="font-extrabold text-[#0A2B1A]">{selectedCandidate.yearsOfExperience}+ Years</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Notice Period</span>
                  <p className="font-extrabold text-[#0A2B1A]">{selectedCandidate.availability}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Rating</span>
                  <p className="font-extrabold text-amber-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {selectedCandidate.rating} / 5.0
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed Projects</span>
                  <p className="font-extrabold text-[#0A2B1A]">{selectedCandidate.completedProjects}+ Repos</p>
                </div>
              </div>

              {/* Headline / Catchphrase from User API */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Headline</h4>
                <p className="text-xs sm:text-sm text-slate-800 font-medium bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  {selectedCandidate.headline || selectedCandidate.bio}
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Summary</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedCandidate.bio}
                </p>
              </div>

              {/* Skills Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information (User API data) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">User API Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-800" />
                    <span className="font-semibold text-slate-800 truncate">{selectedCandidate.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-800" />
                    <span className="font-semibold text-slate-800">{selectedCandidate.phone}</span>
                  </div>
                </div>
              </div>

              {/* Social / Portfolio Links */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Links & Profiles</h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={selectedCandidate.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-800" />
                    Website
                  </a>
                  <a
                    href={selectedCandidate.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Code2 className="w-3.5 h-3.5 text-slate-900" />
                    GitHub
                  </a>
                  <a
                    href={selectedCandidate.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-700" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 rounded-b-3xl border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Candidate resume (${selectedCandidate.fullName.replace(/\s+/g, '_')}_Resume.pdf) download initiated.`);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-800" />
                <span>Download Resume</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    handleOpenContact(selectedCandidate);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Interview Invite</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Candidate Modal (POST /users or PUT /users/:id) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto animate-scaleUp">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#0A2B1A] to-emerald-900 text-white rounded-t-3xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {isEditMode ? 'Edit Candidate Profile' : 'Register New Candidate'}
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {isEditMode ? 'Dispatches PUT /users/:id to User API' : 'Dispatches POST /users to User API'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCandidate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Role Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current / Past Employer
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. TechCorp Solutions"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  >
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Years of Exp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  >
                    {AVAILABILITY_OPTIONS.map((av) => (
                      <option key={av} value={av}>
                        {av}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Core Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Core Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, GraphQL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Website / Portfolio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portfolio / Website Link
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://portfolio.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Professional Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of experience, technical achievements, and career focus..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to User API...' : isEditMode ? 'Update Candidate' : 'Create Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (DELETE /users/:id) */}
      {isDeleteModalOpen && candidateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-7 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                Delete Candidate Profile?
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Are you sure you want to remove <strong className="font-bold text-slate-800">{candidateToDelete.fullName}</strong>? This action dispatches <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-rose-600">DELETE /users/{candidateToDelete.apiId || candidateToDelete.id}</code>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact / Invite Candidate Modal */}
      {isContactModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 animate-scaleUp space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Contact {selectedCandidate.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedCandidate.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Email (from User API)
                </label>
                <input
                  type="email"
                  disabled
                  value={selectedCandidate.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Associated Position (Optional)
                </label>
                <input
                  type="text"
                  value={selectedJobForInvite}
                  onChange={(e) => setSelectedJobForInvite(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Invitation Note
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your interview invitation or note..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
