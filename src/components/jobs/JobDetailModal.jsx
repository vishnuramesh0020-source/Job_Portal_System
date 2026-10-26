import { Link } from 'react-router-dom';
import { formatSalaryNumber } from '../../utils/formatSalary';
import { toast } from 'react-toastify';
import {
  X,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Award,
  Calendar,
  Clock,
  Bookmark,
  Send,
  Share2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

const todayDateString = new Date().toISOString().split('T')[0];
const sevenDaysAheadString = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export const JobDetailModal = ({
  isOpen,
  onClose,
  job,
  onApply,
  onToggleSave,
  isSaved = false,
}) => {
  if (!isOpen || !job) return null;

  const isOpenStatus = job.status === 'Open' || job.status === 'Active';
  const isDeadlinePassed = Boolean(job.deadline && job.deadline < todayDateString);
  const isUrgent = Boolean(job.deadline && !isDeadlinePassed && job.deadline <= sevenDaysAheadString);

  const handleShare = () => {
    const url = `${window.location.origin}/jobs/${job.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      toast.info('Job link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
              {job.category || 'General'}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                isOpenStatus
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isOpenStatus ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open for Applications
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  Closed
                </>
              )}
            </span>

            <span className="text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100">
              {job.employmentType || job.type || 'Full-time'}
            </span>

            <span className="text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100">
              {job.experienceLevel || 'Mid Level'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {job.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{job.location}</span>
              {job.locationType && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 ml-1">
                  {job.locationType}
                </span>
              )}
            </div>
            {job.postedDate && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Posted {job.postedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4-Item Key Details Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Salary */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Salary Range
            </span>
            <p className="text-sm sm:text-base font-extrabold text-emerald-700 flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{formatSalaryNumber(job.salaryRange || job.salary)}</span>
            </p>
          </div>

          {/* Experience */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
            <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
              Experience
            </span>
            <p className="text-sm sm:text-base font-extrabold text-indigo-700 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{job.experienceLevel || 'Mid Level'}</span>
            </p>
          </div>

          {/* Job Type */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 space-y-1">
            <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">
              Job Type
            </span>
            <p className="text-sm sm:text-base font-extrabold text-cyan-700 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{job.employmentType || job.type || 'Full-time'}</span>
            </p>
          </div>

          {/* Deadline */}
          <div
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isDeadlinePassed
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : isUrgent
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">
              Deadline
            </span>
            <p className="text-sm sm:text-base font-extrabold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{job.deadline || 'Rolling'}</span>
            </p>
          </div>
        </div>

        {/* Required Skills Section */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Required Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            About the Role
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        {job.responsibilities && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key Responsibilities
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {job.responsibilities}
            </p>
          </div>
        )}

        {/* Candidate Qualifications */}
        {job.requirements && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Candidate Qualifications
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {job.requirements}
            </p>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave?.(job.id, job.title)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Share job link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            {isOpenStatus ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply?.(job);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply for Position</span>
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed">
                Position Closed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;