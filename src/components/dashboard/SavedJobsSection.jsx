import { Bookmark, Building, MapPin, DollarSign, Trash2, ArrowRight } from 'lucide-react';

export const SavedJobsSection = ({
  savedJobs = [],
  onUnsaveJob,
  onApplyJob,
  onBrowseJobs,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-500" />
            Saved Jobs Watchlist ({savedJobs.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Positions you bookmarked for later review and fast application
          </p>
        </div>

        {savedJobs.length > 0 && onBrowseJobs && (
          <button
            type="button"
            onClick={onBrowseJobs}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Explore More Jobs →
          </button>
        )}
      </div>

      {savedJobs.length === 0 ? (
        <div className="py-12 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
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
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Browse Open Positions
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm flex flex-col justify-between group transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {job.category || 'Engineering'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUnsaveJob(job.id, job.title)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {job.title}
                </h4>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                    <DollarSign className="w-3.5 h-3.5 shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  {job.type || 'Full-Time'}
                </span>
                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3" />
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
