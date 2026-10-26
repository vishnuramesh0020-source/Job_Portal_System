import { Link } from 'react-router-dom';
import { formatSalaryNumber } from '../../utils/formatSalary';
import {
  MapPin,
  IndianRupee,
  Calendar,
  Bookmark,
  Building2,
  Award,
  Send,
  Edit3,
  Trash2,
  XCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';

const todayDateString = new Date().toISOString().split('T')[0];
const sevenDaysAheadString = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export const JobCard = ({
  job,
  onEdit,
  onDelete,
  onApply,
  onToggleSave,
  onQuickView,
  isSaved = false,
  canManage = true,
}) => {
  const isOpen = job.status === 'Open' || job.status === 'Active';

  // Check deadline proximity
  const isDeadlinePassed = Boolean(job.deadline && job.deadline < todayDateString);
  const isUrgent = Boolean(job.deadline && !isDeadlinePassed && job.deadline <= sevenDaysAheadString);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Engineering':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Design & Creative':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Product Management':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cloud & DevOps':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Data & AI':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cybersecurity':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Mobile Development':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Marketing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getExperienceBadgeColor = (exp) => {
    switch (exp) {
      case 'Entry Level':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Mid Level':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Senior Level':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Lead / Manager':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Director / Executive':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Top Header: Category, Status, Bookmark & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category */}
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                job.category
              )}`}
            >
              {job.category}
            </span>

            {/* Job Status: Open / Closed */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isOpen
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isOpen ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-rose-500" />
                  Closed
                </>
              )}
            </span>

            {/* Employment Type */}
            <span className="text-[11px] font-medium text-slate-600 px-2 py-0.5 rounded-md bg-slate-100">
              {job.employmentType || job.type || 'Full-time'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => onToggleSave?.(job.id, job.title)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Manage Buttons: Edit / Delete */}
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.(job)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors cursor-pointer"
                  title="Edit Job"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(job)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Job Title & Company */}
        <div>
          <Link
            to={`/jobs/${job.id}`}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
          >
            {job.title}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
        </div>

        {/* Key Metrics: Salary, Location, Experience Level */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <IndianRupee className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{formatSalaryNumber(job.salaryRange || job.salary)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border truncate ${getExperienceBadgeColor(
                job.experienceLevel
              )}`}
            >
              {job.experienceLevel || 'Mid Level'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={`truncate text-[11px] ${
                isDeadlinePassed
                  ? 'text-rose-600 font-semibold'
                  : isUrgent
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-500'
              }`}
              title={`Application Deadline: ${job.deadline || 'No deadline'}`}
            >
              {isDeadlinePassed
                ? 'Deadline Expired'
                : isUrgent
                ? 'Closing Soon'
                : job.deadline
                ? `Due: ${job.deadline}`
                : 'Open Rolling'}
            </span>
          </div>
        </div>

        {/* Required Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Required Skills:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {job.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
          {job.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 text-[11px]">
          {job.applicantsCount || 0} applicants
        </span>

        <div className="flex items-center gap-2">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(job)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-indigo-50"
              title="Quick Preview Job Details"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          )}

          <Link
            to={`/jobs/${job.id}`}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {isOpen ? (
            <button
              type="button"
              onClick={() => onApply?.(job)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Apply</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed">
              Closed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
