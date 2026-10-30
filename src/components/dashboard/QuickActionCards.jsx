import {
  PlusCircle,
  Bookmark,
  Building2,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export const QuickActionCards = ({
  onOpenPostJob,
  onOpenQuickApply,
  onViewSavedJobs,
  onViewCompanies,
  onViewAllJobs,
  onResetData,
  role = 'candidate',
}) => {
  const actions = [
    {
      id: 'post-job',
      title: 'Post a New Job',
      description: 'Create an active listing to recruit qualified candidates.',
      icon: PlusCircle,
      gradient: 'from-[#0A2B1A] to-emerald-800',
      badge: 'Recruiter Action',
      badgeStyle: 'bg-emerald-50 text-emerald-800',
      buttonText: 'Post Job Listing',
      highlight: role === 'recruiter',
      onClick: onOpenPostJob,
    },
    {
      id: 'quick-apply',
      title: 'Quick Job Application',
      description: 'Submit an application to top verified employer openings.',
      icon: FileText,
      gradient: 'from-blue-600 to-blue-700',
      badge: 'Candidate Action',
      badgeStyle: 'bg-blue-50 text-blue-700',
      buttonText: 'Submit Application',
      highlight: role === 'candidate',
      onClick: onOpenQuickApply,
    },
    {
      id: 'saved-jobs',
      title: 'View Saved Jobs',
      description: 'Review and manage your bookmarked career opportunities.',
      icon: Bookmark,
      gradient: 'from-rose-500 to-rose-600',
      badge: 'Favorites',
      badgeStyle: 'bg-rose-50 text-rose-700',
      buttonText: 'Open Saved Jobs',
      onClick: onViewSavedJobs,
    },
    {
      id: 'browse-jobs',
      title: 'Browse All Openings',
      description: 'Filter verified full-time, contract, and remote positions.',
      icon: Briefcase,
      gradient: 'from-emerald-600 to-emerald-700',
      badge: 'Discovery',
      badgeStyle: 'bg-emerald-50 text-emerald-700',
      buttonText: 'Explore Openings',
      onClick: onViewAllJobs,
    },
    {
      id: 'companies',
      title: 'Explore Companies',
      description: 'Connect with innovative companies hiring on VS Job Portal.',
      icon: Building2,
      gradient: 'from-amber-500 to-amber-600',
      badge: 'Employers',
      badgeStyle: 'bg-amber-50 text-amber-700',
      buttonText: 'Browse Companies',
      onClick: onViewCompanies,
    },
    {
      id: 'reset-demo',
      title: 'Reset Demo Data',
      description: 'Restore pre-seeded initial metrics in local storage.',
      icon: RotateCcw,
      gradient: 'from-slate-700 to-slate-800',
      badge: 'System Tool',
      badgeStyle: 'bg-slate-100 text-slate-700',
      buttonText: 'Reset Metrics',
      onClick: onResetData,
    },
  ];

  // Candidates should not see recruiter action "Post a New Job"
  const visibleActions = actions.filter((act) => {
    if (role === 'candidate' && act.id === 'post-job') return false;
    if (role === 'recruiter' && act.id === 'quick-apply') return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-800" />
            Quick Action Cards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant shortcuts to publish jobs, apply, manage favorites, and refresh data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleActions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
                act.highlight
                  ? 'border-emerald-300 ring-2 ring-emerald-800/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${act.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${act.badgeStyle}`}
                  >
                    {act.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={act.onClick}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{act.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCards;
