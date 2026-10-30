import { Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const currentYear = new Date().getFullYear();

export const Footer = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Hide footer on Login page to ensure exact single-screen no-scroll layout
  if (location.pathname === '/login') {
    return null;
  }

  const isCandidateRole = user?.role === 'candidate';

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto w-full">
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
              <Briefcase className="w-4 h-4 text-emerald-100" />
            </div>
            <span className="font-extrabold text-[#0A2B1A]">VS Job Portal</span>
            <span className="text-xs text-slate-500 ml-2">
              © {currentYear} All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
            <Link to="/jobs" className="hover:text-emerald-800 transition-colors">
              Jobs
            </Link>
            <Link to="/companies" className="hover:text-emerald-800 transition-colors">
              Companies
            </Link>
            {!isCandidateRole && (
              <>
                <Link to="/candidates" className="hover:text-emerald-800 transition-colors">
                  Candidates
                </Link>
                <Link to="/dashboard" className="hover:text-emerald-800 transition-colors">
                  Dashboard
                </Link>
                <Link to="/reports" className="hover:text-emerald-800 transition-colors">
                  Reports
                </Link>
              </>
            )}
            {user?.role === 'candidate' && (
              <Link to="/candidate/dashboard" className="hover:text-emerald-800 transition-colors">
                Candidate Portal
              </Link>
            )}
            {user?.role === 'recruiter' && (
              <Link to="/recruiter/dashboard" className="hover:text-emerald-800 transition-colors">
                Recruiter Portal
              </Link>
            )}
            <Link to="/login" className="hover:text-emerald-800 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-emerald-800 transition-colors">
              Register
            </Link>
            <Link to="/forgot-password" className="hover:text-emerald-800 transition-colors">
              Forgot Password
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational • React 19 & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
