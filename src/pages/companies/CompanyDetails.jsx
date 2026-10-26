import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { useDashboard } from '../../hooks/useDashboard';
import CompanyFormModal from '../../components/companies/CompanyFormModal';
import DeleteCompanyModal from '../../components/companies/DeleteCompanyModal';
import QuickApplyModal from '../../components/dashboard/QuickApplyModal';
import { formatSalaryNumber } from '../../utils/formatSalary';
import { toast } from 'react-toastify';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Users,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Edit3,
  Trash2,
  CheckCircle2,
  Bookmark,
  IndianRupee,
  Clock,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeJobs, toggleSaveJob, applyToJob, savedJobs, refreshData: refreshDashboardMetrics } = useDashboard();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [targetJobForApply, setTargetJobForApply] = useState(null);

  useEffect(() => {
    let isMounted = true;
    companyService
      .getCompanyById(id)
      .then((data) => {
        if (isMounted) setCompany(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Company could not be loaded.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Find jobs belonging to this company
  const companyJobs = (activeJobs || []).filter(
    (job) =>
      job.companyId === id ||
      (company && job.company?.toLowerCase() === company.name?.toLowerCase())
  );

  const handleUpdateCompany = async (formData) => {
    try {
      const updated = await companyService.updateCompany(id, formData);
      setCompany(updated);
      toast.success('Company profile updated successfully!');
      refreshDashboardMetrics();
      return true;
    } catch {
      toast.error('Failed to update company details.');
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await companyService.deleteCompany(id);
      toast.success('Company deleted successfully.');
      refreshDashboardMetrics();
      navigate('/companies');
    } catch {
      toast.error('Failed to delete company.');
    }
  };

  const handleOpenApply = (job) => {
    setTargetJobForApply(job);
    setIsApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading company profile...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Company Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested company does not exist.'}</p>
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Companies
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover Strip */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
            <div className="flex items-end gap-4">
              {/* Logo Box */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 border-4 border-white shadow-xl overflow-hidden shrink-0">
                {company.logo && !imageError ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-black text-2xl flex items-center justify-center rounded-xl">
                    {company.logoText || company.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                    {company.industry}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location}
                  </span>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {company.contactEmail && (
                <a
                  href={`mailto:${company.contactEmail}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Recruiter</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Headquarters</span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {company.location}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Company Size</span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {company.employees}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Industry Focus</span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {company.industry}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Active Openings</span>
              <p className="font-bold text-emerald-600 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                {companyJobs.length} Positions Available
              </p>
            </div>
          </div>

          {/* About / Company Description */}
          <div className="mt-6 space-y-2">
            <h3 className="text-base font-bold text-slate-900">About {company.name}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {company.description}
            </p>
          </div>
        </div>
      </div>

      {/* Active Openings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Active Job Openings at {company.name} ({companyJobs.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct application through VS Job Portal candidate workflow
            </p>
          </div>
        </div>

        {companyJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Active Openings Right Now</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {company.name} currently does not have active public listings. Check back soon or bookmark the company for alerts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {companyJobs.map((job) => {
              const isSaved = (savedJobs || []).some((s) => s.id === job.id);
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
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 block"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatSalaryNumber(job.salary)}</span>
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Posted on {job.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenApply(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Company Modal */}
      <CompanyFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitCompany={handleUpdateCompany}
        initialData={company}
        isEditMode={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCompanyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        company={company}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Quick Apply Modal */}
      <QuickApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitApplication={applyToJob}
        jobs={activeJobs}
        selectedJob={targetJobForApply}
      />
    </div>
  );
};

export default CompanyDetails;
