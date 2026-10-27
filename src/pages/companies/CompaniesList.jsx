import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { companyService, INDUSTRY_OPTIONS } from '../../services/companyService';
import CompanyCard from '../../components/companies/CompanyCard';
import CompanyFormModal from '../../components/companies/CompanyFormModal';
import DeleteCompanyModal from '../../components/companies/DeleteCompanyModal';
import { useDashboard } from '../../hooks/useDashboard';
import { toast } from 'react-toastify';
import {
  Building2,
  PlusCircle,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const CompaniesList = () => {
  const { refreshData: refreshDashboardMetrics } = useDashboard();

  // Data states
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQ = searchParams.get('q') || '';
  const currentInd = searchParams.get('industry') || 'all';

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState(currentQ);
  const [selectedIndustry, setSelectedIndustry] = useState(currentInd);
  const [sortBy, setSortBy] = useState('name-asc');

  // Sync if URL search parameters change
  const [prevUrlParams, setPrevUrlParams] = useState({ q: currentQ, ind: currentInd });
  if (prevUrlParams.q !== currentQ || prevUrlParams.ind !== currentInd) {
    setPrevUrlParams({ q: currentQ, ind: currentInd });
    setSearchQuery(currentQ);
    setSelectedIndustry(currentInd);
    setCurrentPage(1);
  }

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState(null);

  // Fetch companies from Third-Party API / Local Storage
  const loadCompanies = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await companyService.getCompanies(forceRefresh);
      setCompanies(data);
      refreshDashboardMetrics();

      if (forceRefresh) {
        toast.success('Synced companies with third-party API!');
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError(err.message || 'Failed to fetch companies from API.');
      toast.error('Could not load company directory.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [refreshDashboardMetrics]);

  useEffect(() => {
    let isMounted = true;
    companyService
      .getCompanies(false)
      .then((data) => {
        if (isMounted) {
          setCompanies(data);
          refreshDashboardMetrics();
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch companies from API.');
          toast.error('Could not load company directory.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshDashboardMetrics]);

  // Filtered & Sorted Companies
  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    // 1. Search Filter (by Name, Location, Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // 2. Industry Filter
    if (selectedIndustry !== 'all') {
      result = result.filter((c) => c.industry === selectedIndustry);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'jobs') {
        return (b.activeJobs || 0) - (a.activeJobs || 0);
      }
      return 0;
    });

    return result;
  }, [companies, searchQuery, selectedIndustry, sortBy]);

  // Pagination slice
  const totalItems = filteredAndSortedCompanies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredAndSortedCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers for Add / Edit / Delete
  const handleOpenAddModal = () => {
    setActiveCompany(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setActiveCompany(company);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (company) => {
    setActiveCompany(company);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCompany = async (formData) => {
    try {
      if (isEditMode && activeCompany) {
        const updated = await companyService.updateCompany(activeCompany.id, formData);
        setCompanies((prev) =>
          prev.map((c) => (String(c.id) === String(activeCompany.id) ? updated : c))
        );
        toast.success(`Updated "${updated.name}" successfully!`);
      } else {
        const created = await companyService.addCompany(formData);
        setCompanies((prev) => [created, ...prev]);
        toast.success(`Added "${created.name}" to directory!`);
      }
      refreshDashboardMetrics();
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to save company.');
      return false;
    }
  };

  const handleConfirmDelete = async (companyId) => {
    try {
      await companyService.deleteCompany(companyId);
      setCompanies((prev) => prev.filter((c) => String(c.id) !== String(companyId)));
      toast.success('Company removed from directory.');
      refreshDashboardMetrics();
    } catch {
      toast.error('Failed to delete company.');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSortBy('name-asc');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Verified Companies Directory
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Explore leading organizations hiring on VS Job Portal. Powered by Third-Party REST API integration with real-time add, edit, and deletion management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => loadCompanies(true)}
              disabled={isRefreshing || loading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all cursor-pointer"
              title="Sync fresh data from Third-Party API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync API'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Industry Filter, Sort, Items per page */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search companies by name, city, or mission..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter by Industry (3 cols) */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
              >
                <option value="all">All Industries ({companies.length})</option>
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort by Company Name (2 cols) */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700 font-medium"
              >
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="jobs">Sort: Most Jobs</option>
              </select>
            </div>
          </div>

          {/* Items Per Page (2 cols) */}
          <div className="md:col-span-2 flex items-center justify-end gap-2 text-xs">
            <span className="text-slate-400 font-medium">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white text-slate-700"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(searchQuery || selectedIndustry !== 'all' || sortBy !== 'name-asc') && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  Keyword: "{searchQuery}"
                </span>
              )}
              {selectedIndustry !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                  Industry: {selectedIndustry}
                </span>
              )}
              {sortBy !== 'name-asc' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                  Sorted: {sortBy}
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

      {/* ERROR HANDLING BANNER */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs text-rose-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadCompanies(true)}
            className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 font-semibold hover:bg-rose-100 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-4/5" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedCompanies.length === 0 ? (
        /* EMPTY RESULTS STATE */
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Companies Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any organizations matching your current query "{searchQuery}" or filter.
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
              Add New Company
            </button>
          </div>
        </div>
      ) : (
        /* COMPANY LIST GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {paginatedCompanies.map((comp) => (
            <CompanyCard
              key={comp.id}
              company={comp}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
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
            of <strong className="text-slate-800">{totalItems}</strong> companies
          </span>

          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
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

            {/* Next Button */}
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

      {/* MODAL: ADD / EDIT COMPANY */}
      <CompanyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCompany={handleSaveCompany}
        initialData={activeCompany}
        isEditMode={isEditMode}
      />

      {/* MODAL: DELETE COMPANY CONFIRMATION */}
      <DeleteCompanyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        company={activeCompany}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default CompaniesList;
