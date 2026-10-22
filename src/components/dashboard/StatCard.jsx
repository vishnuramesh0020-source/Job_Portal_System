import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  subtitle,
  badgeText,
  colorScheme = 'indigo',
  onClick,
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-100 hover:border-indigo-300',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-200',
      badge: 'bg-indigo-100 text-indigo-700',
      textAccent: 'text-indigo-600',
    },
    blue: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white shadow-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      textAccent: 'text-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
      textAccent: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-600 text-white shadow-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      textAccent: 'text-amber-600',
    },
    purple: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-100 hover:border-purple-300',
      iconBg: 'bg-purple-600 text-white shadow-purple-200',
      badge: 'bg-purple-100 text-purple-700',
      textAccent: 'text-purple-600',
    },
    rose: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-600 text-white shadow-rose-200',
      badge: 'bg-rose-100 text-rose-700',
      textAccent: 'text-rose-600',
    },
  };

  const scheme = colorStyles[colorScheme] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
        scheme.border
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {value}
            </h3>
            {badgeText && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${scheme.badge}`}
              >
                {badgeText}
              </span>
            )}
          </div>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${scheme.iconBg}`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              trendPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{trend}</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}

        {subtitle && !trend && (
          <span className="text-slate-500 font-medium">{subtitle}</span>
        )}

        {onClick && (
          <span className="text-slate-400 group-hover:text-indigo-600 flex items-center gap-0.5 font-medium ml-auto">
            View <ArrowUpRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
