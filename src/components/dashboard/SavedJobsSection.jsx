import { Link } from 'react-router-dom';
import { Bookmark, Building, MapPin, IndianRupee, Trash2, ArrowRight } from 'lucide-react';
import { formatSalaryNumber } from '../../utils/formatSalary';

export const SavedJobsSection = ({
  savedJobs = [],
  onUnsaveJob,
  onApplyJob,
  onBrowseJobs,
  isWidget = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-500" />
            <span>Saved Jobs Watchlist</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              {savedJobs.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Positions you bookmarked for later review and fast application
          </p>
        </div>

        {savedJobs.length > 0 && onBrowseJobs && (
          <button
            type="button"
            onClick={onBrowseJobs}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Explore More →
          </button>
        )}
      </div>

      {savedJobs.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3 p-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Saved Jobs Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our verified job listings and click the bookmark icon to save positions here.
          </p>
          {onBrowseJobs && (
            <button
              type="button"
              onClick={onBrowseJobs}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Browse Open Positions
            </button>
          )}
        </div>
      ) : isWidget ? (
        /* WIDGET MODE (Stacked single column for 5-col sidebar, prevents cramped wrapping & overflows) */
        <div className="space-y-3">
          {savedJobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 bg-white hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {job.category || 'Engineering'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {job.employmentType || job.type || 'Full-Time'}
                    </span>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 block"
                  >
                    {job.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-0.5">
                    <div className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[120px]">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                      <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatSalaryNumber(job.salaryRange || job.salary)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUnsaveJob(job.id, job.title)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Ready to apply
                </span>
                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {savedJobs.length > 4 && onBrowseJobs && (
            <button
              type="button"
              onClick={onBrowseJobs}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-indigo-300 text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-colors text-center cursor-pointer"
            >
              View all {savedJobs.length} saved jobs →
            </button>
          )}
        </div>
      ) : (
        /* FULL-PAGE MODE (Spacious 3-column grid for 12-col full page view) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {job.category || 'Engineering'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUnsaveJob(job.id, job.title)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 block"
                  >
                    {job.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.company}</span>
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-emerald-600">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                    <span>{formatSalaryNumber(job.salaryRange || job.salary)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-500">
                  {job.employmentType || job.type || 'Full-Time'}
                </span>
                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsSection;
