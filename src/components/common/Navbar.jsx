import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Briefcase,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  User,
  Building2,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes during render
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleDashboardPath =
    user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password';

  const isJobsActive =
    location.pathname.startsWith('/jobs') || location.pathname.startsWith('/search') || location.pathname === '/';
  const isCompaniesActive = location.pathname.startsWith('/companies');
  const isDashboardActive = location.pathname === '/dashboard';
  const isReportsActive = location.pathname.startsWith('/reports');
  const isPortalActive =
    location.pathname.startsWith('/candidate') || location.pathname.startsWith('/recruiter');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/jobs" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-[#0A2B1A] via-[#0F3822] to-emerald-800 bg-clip-text text-transparent">
                VS Job Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Hidden on Auth/Login pages) */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              <Link
                to="/jobs"
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  isJobsActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/40'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-800" />
                Jobs
              </Link>

              <Link
                to="/companies"
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  isCompaniesActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/40'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-800" />
                Companies
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      isDashboardActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/40'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-800" />
                    Dashboard
                  </Link>

                  <Link
                    to="/reports"
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      isReportsActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/40'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-800" />
                    Reports
                  </Link>

                  <Link
                    to={roleDashboardPath}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      isPortalActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/40'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-800" />
                    {user?.role === 'recruiter' ? 'Recruiter Portal' : 'Candidate Profile'}
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right Action / Auth Area & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Info Capsule */}
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2.5 py-1 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs leading-tight">
                    <p className="font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                      {user?.fullName}
                    </p>
                    <span
                      className={`inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                        user?.role === 'recruiter'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </Link>

                {/* Desktop Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-sm shadow-emerald-900/20 transition-all"
                  >
                    <span>Register</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Hamburger Toggle (Hidden on Auth pages) */}
            {!isAuthPage && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-800" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-800" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {!isAuthPage && isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{user?.fullName}</p>
                <span
                  className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${
                    user?.role === 'recruiter'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {user?.role} Portal
                </span>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            <Link
              to="/jobs"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isJobsActive
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-800" />
              <span>Jobs Directory</span>
            </Link>

            <Link
              to="/companies"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isCompaniesActive
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-800" />
              <span>Verified Companies</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isDashboardActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-800" />
                  <span>Master Dashboard</span>
                </Link>

                <Link
                  to="/reports"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isReportsActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-800" />
                  <span>Reports & Analytics</span>
                </Link>

                <Link
                  to={roleDashboardPath}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isPortalActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-800" />
                  <span>{user?.role === 'recruiter' ? 'Recruiter Portal' : 'Candidate Profile'}</span>
                </Link>
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="py-2.5 px-4 rounded-xl text-sm font-semibold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 px-4 rounded-xl text-sm font-bold text-center text-white bg-emerald-800 hover:bg-emerald-900 shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
