import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Globe,
  Mail,
  Users,
  ExternalLink,
  Edit3,
  Trash2,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export const CompanyCard = ({ company, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const getIndustryBadgeColor = (ind) => {
    switch (ind) {
      case 'Healthcare':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Finance & FinTech':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'AI & Data Science':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cybersecurity':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Design & Creative':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cloud & DevOps':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Technology':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Top Header: Logo, Name, Industry Badge, Action Buttons */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Company Logo / Avatar */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {company.logo && !imageError ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A2B1A] to-emerald-800 text-white font-black text-sm flex items-center justify-center">
                  {company.logoText || company.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <Link
                to={`/companies/${company.id}`}
                className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-1"
              >
                {company.name}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getIndustryBadgeColor(
                    company.industry
                  )}`}
                >
                  {company.industry}
                </span>
                {company.activeJobs > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-0.5">
                    <Briefcase className="w-2.5 h-2.5" />
                    {company.activeJobs} Jobs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Edit/Delete Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(company)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Edit Company"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(company)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Company"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Company Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        {/* Details Grid (Location, Employees, Website, Contact Email) */}
        <div className="space-y-1.5 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {company.employees}
            </span>
          </div>

          {company.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-800 hover:underline truncate flex items-center gap-1 font-medium"
              >
                <span>{company.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {company.contactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={`mailto:${company.contactEmail}`}
                className="hover:underline truncate text-slate-600"
              >
                {company.contactEmail}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Verified Employer
        </span>
        <Link
          to={`/companies/${company.id}`}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
