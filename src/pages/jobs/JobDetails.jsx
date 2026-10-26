import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import { formatSalaryNumber } from '../../utils/formatSalary';
import JobFormModal from '../../components/jobs/JobFormModal';
import DeleteJobModal from '../../components/jobs/DeleteJobModal';
import QuickApplyModal from '../../components/dashboard/QuickApplyModal';
import { toast } from 'react-toastify';
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  Bookmark,
  Building2,
  Award,
  Send,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Share2,
} from 'lucide-react';

const todayDateString = new Date().toISOString().split('T')[0];
const sevenDaysAheadString = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeJobs,
    savedJobIds,
    toggleSaveJob,
    applyToJob,
    refreshData: refreshDashboardMetrics,
  } = useDashboard();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    jobService
      .getJobById(id)
      .then((data) => {
        if (isMounted) setJob(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Job posting could not be found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isSaved = savedJobIds.some((sId) => String(sId) === String(id));
  const isOpen = job && (job.status === 'Open' || job.status === 'Active');

  // Deadline calculation
  const isDeadlinePassed = Boolean(job?.deadline && job.deadline < todayDateString);
  const isUrgent = Boolean(job?.deadline && !isDeadlinePassed && job.deadline <= sevenDaysAheadString);

  // Handle Edit Update
  const handleUpdateJob = async (formData) => {
    try {
      const updated = await jobService.updateJob(id, formData);
      setJob(updated);
      toast.success('Job posting updated successfully!');
      refreshDashboardMetrics();
      return true;
    } catch {
      toast.error('Failed to update job posting.');
      return false;
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    try {
      await jobService.deleteJob(id);
      toast.success('Job posting deleted successfully.');
      refreshDashboardMetrics();
      navigate('/jobs');
    } catch {
      toast.error('Failed to delete job posting.');
    }
  };

  // Handle Share link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.info('Job posting URL copied to clipboard!');
  };

  // Related jobs in same category
  const relatedJobs = (activeJobs || [])
    .filter((j) => String(j.id) !== String(id) && j.category === job?.category)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading job posting details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Job Posting Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested job posting does not exist.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Back Nav & Quick Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs Directory
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            title="Share job link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSaveJob(job.id, job.title)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Job'}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Badges Row: Category, Status, Employment Type, Experience */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                {job.category}
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                  isOpen
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {isOpen ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open for Applications
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    Closed (No Longer Accepting Candidates)
                  </>
                )}
              </span>

              <span className="text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100">
                {job.employmentType || job.type}
              </span>

              <span className="text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100">
                {job.experienceLevel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{job.location}</span>
                {job.locationType && (
                  <span className="text-[11px] font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-700 ml-1">
                    {job.locationType}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Posted {job.postedDate}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Apply, Edit, Delete */}
          <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 shrink-0">
            {isOpen ? (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Position</span>
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs text-center border border-slate-200">
                Position Closed
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Job</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-Item Key Details Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
          {/* Salary */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Salary Compensation
            </span>
            <p className="text-base font-extrabold text-emerald-700 flex items-center gap-1">
              <IndianRupee className="w-4 h-4 shrink-0" />
              <span>{formatSalaryNumber(job.salaryRange || job.salary)}</span>
            </p>
          </div>

          {/* Experience Level */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
            <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block">
              Experience Level
            </span>
            <p className="text-base font-extrabold text-indigo-700 flex items-center gap-1">
              <Award className="w-4 h-4 shrink-0" />
              <span>{job.experienceLevel || 'Mid Level'}</span>
            </p>
          </div>

          {/* Employment Type */}
          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-800 uppercase tracking-wider block">
              Employment Type
            </span>
            <p className="text-base font-extrabold text-cyan-700 flex items-center gap-1">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>{job.employmentType || job.type}</span>
            </p>
          </div>

          {/* Application Deadline */}
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              isDeadlinePassed
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : isUrgent
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider block">
              Application Deadline
            </span>
            <p className="text-base font-extrabold flex items-center gap-1">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{job.deadline || 'Open Rolling'}</span>
            </p>
            {isUrgent && (
              <span className="text-[10px] font-bold text-amber-700 block">
                Closing Soon!
              </span>
            )}
            {isDeadlinePassed && (
              <span className="text-[10px] font-bold text-rose-700 block">
                Expired
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Details (8 cols) + Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Description, Required Skills, Requirements, Responsibilities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Required Skills Section */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Required Skills & Tech Stack
              </h2>
              <p className="text-xs text-slate-500">
                Core technologies and domain proficiencies required for this position:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About the Role</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>{job.description}</p>
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Key Responsibilities</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Candidate Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Candidate Qualifications</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: About the Company, Job Snapshot, Quick Apply CTA */}
        <div className="lg:col-span-4 space-y-6">
          {/* Company Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{job.company}</h3>
                <span className="text-xs text-indigo-600 font-semibold">Verified Employer</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Industry:</span>
                <span className="font-semibold text-slate-800">{job.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Workplace:</span>
                <span className="font-semibold text-slate-800">{job.locationType || 'Hybrid'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Applicants:</span>
                <span className="font-semibold text-slate-800">{job.applicantsCount || 0}</span>
              </div>
              {job.contactEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <a
                    href={`mailto:${job.contactEmail}`}
                    className="font-semibold text-indigo-600 hover:underline truncate"
                  >
                    {job.contactEmail}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                to="/companies"
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <span>View Company Profile</span>
              </Link>
            </div>
          </div>

          {/* Quick Apply Callout Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white">Ready to take the next step?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Submit your candidate application in 1-click. Your profile and portfolio will be immediately transmitted to the hiring team.
            </p>
            {isOpen ? (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply Now</span>
              </button>
            ) : (
              <div className="text-xs text-rose-300 font-medium bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/30 text-center">
                This position is closed to new applicants.
              </div>
            )}
          </div>

          {/* Related Positions */}
          {relatedJobs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Similar Openings in {job.category}
              </h3>
              <div className="space-y-3">
                {relatedJobs.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/jobs/${rel.id}`}
                    className="block p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all space-y-1 group"
                  >
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {rel.company} • {rel.salaryRange || rel.salary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: EDIT JOB */}
      <JobFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitJob={handleUpdateJob}
        initialData={job}
        isEditMode={true}
        defaultCompany={job.company}
      />

      {/* MODAL 2: DELETE CONFIRMATION */}
      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        job={job}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* MODAL 3: QUICK APPLY */}
      <QuickApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitApplication={applyToJob}
        jobs={[job]}
        selectedJob={job}
        currentUser={user}
      />
    </div>
  );
};

export default JobDetails;
