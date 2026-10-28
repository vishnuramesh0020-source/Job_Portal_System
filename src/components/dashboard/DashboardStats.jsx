import { useState } from 'react';
import {
  BarChart3,
  PieChart,
  Layers,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const DashboardStats = ({
  monthlyTrends = [],
  categoryBreakdown = [],
  applicationStatusStages = [],
}) => {
  const [activeMetric, setActiveMetric] = useState('applications');

  // Find max value in monthly trends for proportional bar height
  const maxTrendValue = Math.max(
    ...monthlyTrends.map((item) => item[activeMetric] || 1),
    1
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-800" />
            Dashboard Statistics & Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics across hiring velocity, applications, and job categories
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric('applications')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === 'applications'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Applications
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('jobs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === 'jobs'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Job Postings
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('hires')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === 'hires'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hires Made
          </button>
        </div>
      </div>

      {/* Grid: Trends Chart + Categories + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Trends Chart (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                6-Month Growth Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">
                Showing monthly volume for {activeMetric}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4% Growth
            </div>
          </div>

          {/* Interactive CSS Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-100">
            {monthlyTrends.map((item, index) => {
              const currentVal = item[activeMetric] || 0;
              const heightPercent = Math.max(Math.round((currentVal / maxTrendValue) * 100), 12);

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {currentVal} {activeMetric} ({item.month})
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                      activeMetric === 'applications'
                        ? 'bg-gradient-to-t from-emerald-800 to-emerald-600 shadow-emerald-950/20'
                        : activeMetric === 'jobs'
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-100'
                        : 'bg-gradient-to-t from-purple-600 to-purple-400 shadow-purple-100'
                    } shadow-md`}
                  />

                  {/* Month Label */}
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* KPI Mini Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Avg Response Time</span>
              <strong className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-800" /> 24 Hours
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Candidate Match</span>
              <strong className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> 94.2%
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Offer Acceptance</span>
              <strong className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 88.5%
              </strong>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Stages (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-800" />
                Job Category Distribution
              </h3>
              <span className="text-xs font-semibold text-slate-400">Share</span>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{cat.name}</span>
                    <span className="text-slate-500">
                      {cat.count} jobs ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(cat.percentage, 6)}%`, backgroundColor: cat.colorHex }}
                      className={`h-full rounded-full transition-all duration-700 ${cat.color || 'bg-emerald-800'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Pipeline Stages */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-violet-600" />
                Application Funnel Stages
              </h3>
              <span className="text-xs font-semibold text-slate-400">Volume</span>
            </div>

            <div className="space-y-2.5">
              {applicationStatusStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: stage.colorHex }}
                      className={`w-2.5 h-2.5 rounded-full ${stage.color || 'bg-emerald-800'}`}
                    />
                    <span className="font-medium text-slate-700">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{stage.count}</span>
                    <span className="text-[11px] text-slate-400">({stage.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
