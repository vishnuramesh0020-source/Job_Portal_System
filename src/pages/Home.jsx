import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Briefcase,
  Layers,
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-16 py-12 animate-fadeIn">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Find Your Dream Role or Hire Exceptional Talent with{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Confidence
          </span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          A high-performance job portal connecting ambitious candidates with verified employers. Complete with interactive metrics, real-time activity feeds, and saved job watchlists.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
              >
                <BarChart3 className="w-5 h-5" />
                Go to Master Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
              >
                My {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'} Profile
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
              >
                Sign In to Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Role Selection Dual Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidate Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
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
            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                Sign In as Candidate <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
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
            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-800"
              >
                Sign In as Recruiter <ArrowRight className="w-4 h-4" />
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <BarChart3 className="w-7 h-7 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Dashboard Statistics</h4>
            <p className="text-xs text-slate-500 mt-1">
              Monthly trends, industry categories, and application funnel stages.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <Briefcase className="w-7 h-7 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Active Job Postings</h4>
            <p className="text-xs text-slate-500 mt-1">
              Explore active listings, 1-click bookmarks, and quick applicant workflows.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <Layers className="w-7 h-7 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Quick Action Cards</h4>
            <p className="text-xs text-slate-500 mt-1">
              Instant modals for posting openings, quick applying, and managing bookmarks.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <ShieldCheck className="w-7 h-7 text-indigo-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm">Recent Activities</h4>
            <p className="text-xs text-slate-500 mt-1">
              Chronological live timeline of platform actions and status progressions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
