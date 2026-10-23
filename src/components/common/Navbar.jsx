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
  Home,
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

  const isHomeActive = location.pathname === '/';
  const isJobsActive = location.pathname.startsWith('/jobs');
  const isCompaniesActive = location.pathname.startsWith('/companies');
  const isDashboardActive = location.pathname === '/dashboard';
  const isPortalActive =
    location.pathname.startsWith('/candidate') || location.pathname.startsWith('/recruiter');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                JobPortal
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isHomeActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                isJobsActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Jobs
            </Link>

            <Link
              to="/companies"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                isCompaniesActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Companies
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isDashboardActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to={roleDashboardPath}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isPortalActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Portal
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Auth Area & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Info Capsule */}
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2.5 py-1 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
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
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                >
                  <span>Register</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
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
              to="/"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isHomeActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-indigo-600" />
              <span>Home</span>
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isJobsActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Jobs Directory</span>
            </Link>

            <Link
              to="/companies"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isCompaniesActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Verified Companies</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isDashboardActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>Master Dashboard</span>
                </Link>

                <Link
                  to={roleDashboardPath}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isPortalActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>My {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'} Workspace</span>
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
                  className="py-2.5 px-4 rounded-xl text-sm font-semibold text-center text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
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
