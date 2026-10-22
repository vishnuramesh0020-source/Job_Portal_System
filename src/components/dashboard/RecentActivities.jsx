import { useState } from 'react';
import {
  Clock,
  FileText,
  Briefcase,
  Building2,
  Bookmark,
  CalendarCheck,
  Award,
} from 'lucide-react';

export const RecentActivities = ({ activities = [] }) => {
  const [filterType, setFilterType] = useState('all');

  const filteredActivities =
    filterType === 'all'
      ? activities
      : activities.filter((act) => act.type === filterType);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-4 h-4" />;
      case 'Award':
        return <Award className="w-4 h-4" />;
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Bookmark':
      default:
        return <Bookmark className="w-4 h-4" />;
    }
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rose':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'blue':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Recent Activities
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Timeline of live events, new applications, published roles, and interviews
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['all', 'application', 'job', 'status', 'company'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                filterType === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All Activities' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No activities found matching the selected filter.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="py-4 first:pt-1 last:pb-1 flex items-start gap-3.5 hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
            >
              {/* Icon Container */}
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-slate-200">
                {getIcon(act.iconName)}
              </div>

              {/* Text Body */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {act.description}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getBadgeStyle(
                      act.badgeColor
                    )}`}
                  >
                    {act.badge}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
