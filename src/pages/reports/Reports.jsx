import { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { formatSalaryWithSymbol } from '../../utils/formatSalary';
import {
  BarChart3,
  Building2,
  Briefcase,
  Users,
  FileText,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  Layers,
  PieChart,
  RefreshCw,
  Printer,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Calendar,
  Flame,
  Globe2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Laptop,
} from 'lucide-react';

export const Reports = () => {
  const { user } = useAuth();
  const {
    totalCompanies,
    totalJobs,
    activeJobPostings,
    totalCandidates,
    totalApplications,
    monthlyTrends = [],
    categoryBreakdown = [],
    applicationStatusStages = [],
    mostAppliedJobs = [],
    monthlyApplicationStats = [],
    employerHiringVolume = [],
    workModelDistribution = [],
    refreshData,
    loading,
  } = useDashboard();

  // Active metric for Monthly Trends Chart
  const [activeChartMetric, setActiveChartMetric] = useState('applications');
  // Selected timeframe filter (UI state)
  const [timeframe, setTimeframe] = useState('6months');

  // Find max value in monthly trends for proportional bar heights
  const maxTrendValue = useMemo(() => {
    return Math.max(
      ...monthlyTrends.map((item) => item[activeChartMetric] || 1),
      1
    );
  }, [monthlyTrends, activeChartMetric]);

  // Find max applicant count for proportional progress bars in Most Applied Jobs
  const maxApplicantCount = useMemo(() => {
    if (mostAppliedJobs.length === 0) return 1;
    return Math.max(...mostAppliedJobs.map((j) => j.totalApplicants || j.applicantsCount || 1), 1);
  }, [mostAppliedJobs]);

  // Pagination for Most Applied Jobs (Show 4 in front, others in pagination)
  const [mostAppliedPage, setMostAppliedPage] = useState(1);
  const mostAppliedPerPage = 4;
  const totalMostAppliedItems = mostAppliedJobs.length;
  const totalMostAppliedPages = Math.ceil(totalMostAppliedItems / mostAppliedPerPage) || 1;
  const paginatedMostAppliedJobs = useMemo(() => {
    const start = (mostAppliedPage - 1) * mostAppliedPerPage;
    return mostAppliedJobs.slice(start, start + mostAppliedPerPage);
  }, [mostAppliedJobs, mostAppliedPage]);

  // Handle print/export
  const handlePrint = () => {
    window.print();
  };

  // Candidates manage their workspace in Candidate Portal
  if (user?.role === 'candidate') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Welcome & Control Header */}
      <div className="bg-gradient-to-r from-[#0A2B1A] via-[#0F3822] to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden border border-emerald-800/40">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-20 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Intelligence & Reports</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              VS Job Portal Analytics & Performance
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Consolidated real-time reporting across <strong className="text-white font-bold">{totalJobs} job openings</strong>,{' '}
              <strong className="text-white font-bold">{totalCompanies} verified companies</strong>,{' '}
              <strong className="text-white font-bold">{totalCandidates} registered talent</strong>, and{' '}
              <strong className="text-white font-bold">{totalApplications} candidate applications</strong>.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Selector */}
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="py-2.5 px-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-md border border-white/20 focus:outline-none cursor-pointer appearance-none pr-8 transition-colors"
              >
                <option value="6months" className="text-slate-900">Last 6 Months</option>
                <option value="ytd" className="text-slate-900">Year to Date (2026)</option>
                <option value="all" className="text-slate-900">All Time Historical</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-emerald-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh Data */}
            <button
              type="button"
              onClick={() => refreshData({ bypassCache: true })}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Refresh data from storage and API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Print / Export Report */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:scale-[1.02]"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. KEY PLATFORM METRICS CARDS (5 Core Numbers Displayed) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#0A2B1A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Platform Key Performance Indicators
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Live Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Job Postings */}
          <Link
            to="/jobs"
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all block cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Total Job Postings
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A2B1A] tracking-tight">
                {totalJobs}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                +14% MoM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">All registered openings</p>
          </Link>

          {/* Card 2: Total Companies */}
          <Link
            to="/companies"
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all block cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Total Companies
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A2B1A] tracking-tight">
                {totalCompanies}
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Hiring partner employers</p>
          </Link>

          {/* Card 3: Total Candidates */}
          <Link
            to="/candidates"
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all block cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Total Candidates
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 border border-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A2B1A] tracking-tight">
                {totalCandidates}
              </span>
              <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                +18% MoM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Registered talent roster</p>
          </Link>

          {/* Card 4: Total Applications */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Total Applications
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A2B1A] tracking-tight">
                {totalApplications}
              </span>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                +28.4%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Candidate submissions</p>
          </div>

          {/* Card 5: Active Jobs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-teal-300 hover:-translate-y-0.5 transition-all col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Active Jobs
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-800 tracking-tight">
                {activeJobPostings}
              </span>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                {totalJobs > 0 ? `${Math.round((activeJobPostings / totalJobs) * 100)}% Open` : '100%'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Accepting active applications</p>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD CHARTS (Live Visual Analytics) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#0A2B1A] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              Dashboard Charts & Visual Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Interactive visualization models reflecting monthly growth trends, category allocations, and pipeline flow
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-xs font-bold border border-slate-200/80 self-start sm:self-auto shadow-xs">
            <button
              type="button"
              onClick={() => setActiveChartMetric('applications')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeChartMetric === 'applications'
                  ? 'bg-emerald-900 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Applications
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('jobs')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeChartMetric === 'jobs'
                  ? 'bg-emerald-900 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Job Postings
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('hires')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeChartMetric === 'hires'
                  ? 'bg-emerald-900 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hires Made
            </button>
          </div>
        </div>

        {/* Charts Grid: Left Main Trend (7 Cols) & Right Category/Funnel (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chart 1: Monthly Trends Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#0A2B1A] text-sm sm:text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Monthly Recruitment Velocity Trend
                </h3>
                <p className="text-xs text-slate-500 capitalize mt-0.5 font-medium">
                  Showing 6-month growth pattern for {activeChartMetric}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+28.4% Growth</span>
              </div>
            </div>

            {/* Interactive CSS Bar Chart with Gridlines & Prominent Badges */}
            <div className="relative pt-6 pb-2">
              {/* Background Reference Gridlines */}
              <div className="absolute inset-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-slate-200 w-full" />
              </div>

              {/* Chart Bars */}
              <div className="relative z-10 h-64 sm:h-72 flex items-end justify-between gap-2.5 sm:gap-5 px-2">
                {monthlyTrends.map((item, index) => {
                  const currentVal = item[activeChartMetric] || 0;
                  // Dynamic proportional height scaling from 32% to 92% to eliminate empty vertical space
                  const heightPercent = Math.max(
                    Math.round((currentVal / maxTrendValue) * 78) + 14,
                    30
                  );

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-xl pointer-events-none whitespace-nowrap z-30 shadow-xl border border-slate-700">
                        {currentVal} {activeChartMetric} in {item.month}
                      </div>

                      {/* Value label directly above bar */}
                      <span className="mb-2 px-2 py-0.5 rounded-md bg-emerald-50 text-[#0A2B1A] group-hover:bg-emerald-900 group-hover:text-white border border-emerald-200/70 text-xs font-black transition-all shadow-xs">
                        {currentVal}
                      </span>

                      {/* Bar Fill with Vibrant Gradients */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[46px] sm:max-w-[54px] rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg shadow-sm ${
                          activeChartMetric === 'applications'
                            ? 'bg-gradient-to-t from-[#0A2B1A] via-emerald-700 to-teal-400'
                            : activeChartMetric === 'jobs'
                            ? 'bg-gradient-to-t from-[#0A2B1A] via-emerald-800 to-emerald-500'
                            : 'bg-gradient-to-t from-amber-700 via-amber-600 to-amber-400'
                        }`}
                      />

                      {/* Month Label */}
                      <span className="mt-3 text-xs font-extrabold text-slate-600 group-hover:text-[#0A2B1A] transition-colors">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benchmark KPIs Row (3 Sleek Stat Tiles) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Avg Response
                  </span>
                  <strong className="text-sm font-black text-[#0A2B1A]">24 Hours</strong>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Top 5% Quartile</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-amber-50/40 hover:border-amber-200 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Interview Rate
                  </span>
                  <strong className="text-sm font-black text-[#0A2B1A]">42.8%</strong>
                  <span className="text-[10px] text-amber-800 font-bold block mt-0.5">Qualified Ratio</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-teal-50/40 hover:border-teal-200 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Offer Acceptance
                  </span>
                  <strong className="text-sm font-black text-[#0A2B1A]">88.5%</strong>
                  <span className="text-[10px] text-teal-800 font-bold block mt-0.5">High Conversion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2 & 3: Category Breakdown & Funnel Stages (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-[#0A2B1A] text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  Job Category Distribution
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Market Share
                </span>
              </div>

              <div className="space-y-3.5">
                {categoryBreakdown.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          style={{ backgroundColor: cat.colorHex }}
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        />
                        <span className="text-slate-800 font-bold">{cat.name}</span>
                      </div>
                      <span className="text-slate-600 font-semibold">
                        <strong className="text-[#0A2B1A] font-extrabold">{cat.count}</strong> jobs{' '}
                        <span className="text-slate-400 font-normal">({cat.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                      <div
                        style={{
                          width: `${Math.max(cat.percentage, 8)}%`,
                          backgroundColor: cat.colorHex,
                        }}
                        className={`h-full rounded-full transition-all duration-700 shadow-xs ${cat.color || 'bg-emerald-800'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Pipeline Funnel Stages */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-[#0A2B1A] text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-700" />
                  Application Funnel Stages
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Candidate Pipeline
                </span>
              </div>

              <div className="space-y-2.5">
                {applicationStatusStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-emerald-900 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{stage.stage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[#0A2B1A]">{stage.count}</span>
                        <span className="text-[11px] text-slate-400 font-medium">({stage.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.max(stage.percentage, 8)}%`,
                          backgroundColor: stage.colorHex,
                        }}
                        className={`h-full rounded-full ${stage.color || 'bg-emerald-700'} transition-all duration-700 shadow-xs`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supplementary Charts Row: Top Employers & Work Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Hiring Companies by Volume */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-[#0A2B1A] text-sm sm:text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  Top Hiring Companies by Volume
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Top verified employer partners by active openings & candidate volume
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                Ranked
              </span>
            </div>

            <div className="space-y-3">
              {employerHiringVolume.map((emp, index) => {
                const rankColors = [
                  'bg-amber-400 text-amber-950 font-black',
                  'bg-slate-300 text-slate-800 font-black',
                  'bg-amber-700 text-white font-black',
                  'bg-slate-100 text-slate-600 font-bold',
                  'bg-slate-100 text-slate-600 font-bold',
                ];

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Medal */}
                      <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 shadow-xs ${rankColors[index % rankColors.length]}`}>
                        #{index + 1}
                      </span>

                      {/* Logo Avatar */}
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                        {emp.logoText || emp.company?.substring(0, 2).toUpperCase() || 'CO'}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#0A2B1A] truncate hover:text-emerald-800 transition-colors">
                          {emp.company}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="truncate">{emp.industry || 'Technology'}</span>
                          <span>•</span>
                          <span className="text-emerald-800 font-bold flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-emerald-700" />
                            {emp.openJobs || emp.activeRoles || 2} active roles
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Applications Count */}
                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-emerald-800 block leading-tight">
                        {emp.applicationsReceived || 24}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Applications
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work Model & Location Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-[#0A2B1A] text-sm sm:text-base flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-teal-700" />
                    Work Model Distribution
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Breakdown of flexible workplace arrangements across active roles
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                  Arrangements
                </span>
              </div>

              <div className="space-y-4">
                {workModelDistribution.map((item, index) => {
                  const isRemote = (item.type || item.model)?.toLowerCase().includes('remote');
                  const isHybrid = (item.type || item.model)?.toLowerCase().includes('hybrid');

                  return (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isRemote
                              ? 'bg-emerald-100 text-emerald-800'
                              : isHybrid
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isRemote ? <Wifi className="w-4 h-4" /> : isHybrid ? <Laptop className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-extrabold text-[#0A2B1A] text-xs sm:text-sm block">
                              {item.type || item.model}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {isRemote ? 'Full Remote / Anywhere' : isHybrid ? '2-3 Days Office Weekly' : 'Full On-site Office'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-800 block">
                            {item.percentage}%
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.count} roles
                          </span>
                        </div>
                      </div>

                      {/* Filled Progress Bar */}
                      <div className="h-3 w-full bg-slate-200/60 rounded-full overflow-hidden p-0.5">
                        <div
                          style={{
                            width: `${Math.max(item.percentage, 8)}%`,
                            backgroundColor: item.colorHex,
                          }}
                          className={`h-full rounded-full transition-all duration-700 shadow-xs ${
                            isRemote
                              ? 'bg-gradient-to-r from-emerald-800 to-emerald-500'
                              : isHybrid
                              ? 'bg-gradient-to-r from-teal-800 to-teal-500'
                              : 'bg-gradient-to-r from-amber-700 to-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Executive Insight Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0A2B1A] to-teal-950 text-white border border-emerald-800/40 shadow-sm flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs leading-relaxed text-emerald-100 font-medium">
                <strong className="text-white font-bold">Key Insight:</strong> 87% of candidate applications prioritize Remote and Hybrid positions, driving 3.2x faster interview conversions across active platform listings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOST APPLIED JOBS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-[#0A2B1A] flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              Most Applied Jobs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Top job openings that received the highest candidate application engagement
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 hover:text-emerald-950 transition-colors bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-2 rounded-xl border border-emerald-200/70"
          >
            <span>View All Jobs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Most Applied Jobs List (4 displayed in front with pagination) */}
        <div className="space-y-3.5">
          {paginatedMostAppliedJobs.map((job, idx) => {
            const globalRank = (mostAppliedPage - 1) * mostAppliedPerPage + idx + 1;
            const applicantTotal = job.totalApplicants || job.applicantsCount || 0;
            const volumePercent = Math.round((applicantTotal / maxApplicantCount) * 100);

            return (
              <div
                key={job.id || idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/70 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                {/* Left: Rank & Title */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                      globalRank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : globalRank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : globalRank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{globalRank}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-extrabold text-[#0A2B1A] text-sm sm:text-base hover:text-emerald-800 transition-colors truncate"
                      >
                        {job.title}
                      </Link>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          job.status === 'Open' || job.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200/70'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {job.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="font-extrabold text-[#0A2B1A]">{job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="font-black text-emerald-800">
                        {formatSalaryWithSymbol(job.salaryRange || job.salary)}
                      </span>
                      {job.category && (
                        <>
                          <span>•</span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600">
                            {job.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Applicant Bar & Direct CTA */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="w-36 sm:w-44 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-[#0A2B1A]">{applicantTotal} Applicants</span>
                      <span className="text-slate-400 text-[11px] font-bold">{volumePercent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                      <div
                        style={{ width: `${Math.max(volumePercent, 6)}%` }}
                        className="h-full bg-gradient-to-r from-emerald-700 to-teal-500 rounded-full transition-all duration-700 shadow-xs"
                      />
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-emerald-800 hover:text-white hover:border-emerald-800 text-slate-700 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="hidden sm:inline">View Job</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Most Applied Jobs Pagination (4 in front, others in pagination) */}
        {totalMostAppliedItems > mostAppliedPerPage && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-extrabold">{(mostAppliedPage - 1) * mostAppliedPerPage + 1}</strong> to{' '}
              <strong className="text-slate-900 font-extrabold">
                {Math.min(mostAppliedPage * mostAppliedPerPage, totalMostAppliedItems)}
              </strong>{' '}
              of <strong className="text-slate-900 font-extrabold">{totalMostAppliedItems}</strong> most applied jobs
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMostAppliedPage((p) => Math.max(p - 1, 1))}
                disabled={mostAppliedPage === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalMostAppliedPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setMostAppliedPage(pageNum)}
                  className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    mostAppliedPage === pageNum
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setMostAppliedPage((p) => Math.min(p + 1, totalMostAppliedPages))}
                disabled={mostAppliedPage === totalMostAppliedPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MONTHLY APPLICATION STATISTICS (Detailed Breakdown Table) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-[#0A2B1A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              Monthly Application Statistics & Performance Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Comprehensive month-over-month evaluation of job posting volume, candidate responses, and interview conversions
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200/70 shadow-xs">
            <span>6-Month Total: 605 Applications</span>
          </div>
        </div>

        {/* Monthly Summary KPI Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-200 transition-all">
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider block">Peak Month</span>
            <strong className="text-base sm:text-lg font-black text-[#0A2B1A] mt-1 block">April 2026</strong>
            <span className="text-xs text-emerald-700 font-extrabold">168 Applications</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-200 transition-all">
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider block">Avg MoM Growth</span>
            <strong className="text-base sm:text-lg font-black text-[#0A2B1A] mt-1 block">+27.8%</strong>
            <span className="text-xs text-emerald-700 font-extrabold">Steady Expansion</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-200 transition-all">
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider block">Avg Conversion</span>
            <strong className="text-base sm:text-lg font-black text-[#0A2B1A] mt-1 block">41.7%</strong>
            <span className="text-xs text-teal-700 font-extrabold">Interview Advancement</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-200 transition-all">
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider block">Hires Closed</span>
            <strong className="text-base sm:text-lg font-black text-[#0A2B1A] mt-1 block">98 Hires</strong>
            <span className="text-xs text-emerald-800 font-extrabold">Past 6 Months</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto border border-slate-200/70 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-black">Month & Year</th>
                <th className="py-3.5 px-4 font-black">Applications</th>
                <th className="py-3.5 px-4 font-black">Jobs Posted</th>
                <th className="py-3.5 px-4 font-black">Interviews</th>
                <th className="py-3.5 px-4 font-black">Offers / Hires</th>
                <th className="py-3.5 px-4 font-black">Conversion</th>
                <th className="py-3.5 px-4 font-black">MoM Growth</th>
                <th className="py-3.5 px-4 font-black">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {monthlyApplicationStats.map((stat, i) => (
                <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-[#0A2B1A]">
                    {stat.month}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{stat.applications}</span>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          style={{ width: `${Math.round((stat.applications / 168) * 100)}%` }}
                          className="h-full bg-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {stat.jobsPosted}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {stat.interviews}
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-800">
                    {stat.hires}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-bold">
                    {stat.conversionRate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
                      {stat.growthRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        stat.status === 'Peak Volume'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : stat.status === 'High Demand'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : stat.status === 'Strong'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {stat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;