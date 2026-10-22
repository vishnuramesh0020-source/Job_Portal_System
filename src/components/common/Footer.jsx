import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">JobPortal System</span>
            <span className="text-xs text-slate-500 ml-2">
              © {currentYear} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-indigo-600 transition-colors">
              Register
            </Link>
            <Link to="/forgot-password" className="hover:text-indigo-600 transition-colors">
              Forgot Password
            </Link>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Built with React, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
