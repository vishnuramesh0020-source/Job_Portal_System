import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { formatSalaryNumber } from '../utils/formatSalary';
import {
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Briefcase,
  Layers,
  Search,
  MapPin,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { activeJobs, totalCompanies, totalJobs, totalApplications } = useDashboard();
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const featuredJobs = (activeJobs || []).slice(0, 3);

  const popularTags = [
    { label: 'Engineering', query: 'Engineering' },
    { label: 'Remote', query: 'Remote' },
    { label: 'Design & Creative', query: 'Design & Creative' },
    { label: 'Cloud & DevOps', query: 'Cloud & DevOps' },
    { label: 'Data & AI', query: 'Data & AI' },
  ];

  return (
    <div className="space-y-16 py-10 sm:py-14 animate-fadeIn">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>The Next-Generation Tech Talent Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Find Your Dream Role or Hire Exceptional Talent with{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Confidence
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          A high-performance job portal connecting ambitious candidates with verified employers. Complete with interactive metrics, real-time activity feeds, and saved job watchlists.
        </p>

        {/* Hero Interactive Search Box */}
        <div className="max-w-2xl mx-auto pt-2">
          <form
            onSubmit={handleHeroSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white border border-slate-300 shadow-xl shadow-slate-200/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all"
          >
            <div className="flex items-center gap-2.5 px-3 flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search job title, skills, or company..."
                className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(tag.query)}`)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 text-slate-600 transition-colors cursor-pointer text-xs font-medium"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
              >
                <BarChart3 className="w-4 h-4" />
                Go to Master Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
              >
                My {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'} Profile
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/jobs"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
              >
                <Briefcase className="w-4 h-4" />
                Explore {totalJobs || 11}+ Open Jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/companies"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
              >
                <Building2 className="w-4 h-4" />
                Browse Companies
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="text-center p-3">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block">
              Active Openings
            </span>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-white">{totalJobs || 11}+</p>
            <span className="text-[11px] text-slate-400">Verified postings</span>
          </div>
          <div className="text-center p-3">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block">
              Hiring Companies
            </span>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-white">{totalCompanies || 10}+</p>
            <span className="text-[11px] text-slate-400">Industry leaders</span>
          </div>
          <div className="text-center p-3">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block">
              Applications
            </span>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-white">{totalApplications || 140}+</p>
            <span className="text-[11px] text-slate-400">Processed seamlessly</span>
          </div>
          <div className="text-center p-3">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block">
              Candidate Cost
            </span>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-300">100% Free</p>
            <span className="text-[11px] text-slate-400">Instant 1-click apply</span>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Featured Openings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                High-Demand Positions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Explore popular active roles with competitive salaries and remote flexibility
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>View All {totalJobs || 11} Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {job.category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                      {job.employmentType || job.type || 'Full-time'}
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{formatSalaryNumber(job.salaryRange || job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">
                    {job.applicantsCount || 0} applied
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Role Selection Dual Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidate Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                For Job Seekers
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Candidate Account
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse verified openings, apply in one click, track your application pipeline, and save jobs tailored to your career goals.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Personalized candidate dashboard & saved jobs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Live application status & activity updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Quick Apply with profile sync in Local Storage
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={isAuthenticated ? '/candidate/dashboard' : '/login'}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>{isAuthenticated ? 'Open Candidate Dashboard' : 'Sign In as Candidate'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Explore Openings →
              </Link>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                For Employers & Recruiters
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Recruiter Account
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Publish positions, showcase your company brand, review qualified candidate applications, and streamline your hiring team.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Dedicated company recruiter portal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Job listing management & candidate metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Real-time activity log & KPI tracking
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={isAuthenticated ? '/recruiter/dashboard' : '/login'}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-800"
              >
                <span>{isAuthenticated ? 'Open Recruiter Dashboard' : 'Sign In as Recruiter'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/companies"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                View Employers →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered with Modern Web Standards
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Everything you need for seamless recruitment and job search
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <BarChart3 className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Dashboard Statistics</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Monthly trends, industry categories, and application funnel stages with real-time updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <Briefcase className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Active Job Postings</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Explore active listings, 1-click bookmarks, and quick applicant workflows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <Layers className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Quick Action Cards</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Instant modals for posting openings, quick applying, and managing bookmarks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Recent Activities</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Chronological live timeline of platform actions and status progressions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;