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

export const CompanyCard = ({ company, onEdit, onDelete, canManage = false }) => {
  const [imageError, setImageError] = useState(false);

  const getIndustryBadgeColor = (ind) => {
    switch (ind) {
      case 'Healthcare':
      case 'Digital Healthcare':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Finance & FinTech':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'AI & Data Science':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Cybersecurity':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Design & Creative':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cloud & DevOps':
      case 'Cloud & Infrastructure':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'E-Commerce':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Technology':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const companyName = (company.name || 'Verified Company').trim();
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company';
  const description =
    (company.description || '').trim() ||
    `${companyName} is an industry-leading organization delivering scalable digital systems and hiring verified engineering talent.`;
  const website = (company.website || '').trim() || `https://${slug}.com`;
  const contactEmail = (company.contactEmail || '').trim() || `contact@${slug}.com`;
  const location = (company.location || '').trim() || 'Remote, Global';
  const employees = company.employees
    ? String(company.employees).includes('employee')
      ? company.employees
      : `${company.employees} employees`
    : '100-250 employees';
  const industry = company.industry || 'Technology';
  const activeJobs = typeof company.activeJobs === 'number' ? company.activeJobs : 2;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group h-full hover:border-emerald-300">
      <div className="space-y-4">
        {/* Top Header: Logo, Name, Industry Badge, Action Buttons */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Company Logo / Avatar */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {company.logo && !imageError ? (
                <img
                  src={company.logo}
                  alt={companyName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A2B1A] to-emerald-800 text-white font-black text-sm flex items-center justify-center">
                  {company.logoText || companyName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <Link
                to={`/companies/${company.id}`}
                className="font-bold text-[#0A2B1A] text-base group-hover:text-emerald-800 transition-colors truncate block"
              >
                {companyName}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getIndustryBadgeColor(
                    industry
                  )}`}
                >
                  {industry}
                </span>
                {activeJobs > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-0.5">
                    <Briefcase className="w-2.5 h-2.5" />
                    {activeJobs} Jobs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Edit/Delete Icons (Only visible for authorized managers) */}
          {canManage && onEdit && onDelete && (
            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
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
          )}
        </div>

        {/* Company Description with uniform height & line clamp */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed h-10 overflow-hidden">
          {description}
        </p>

        {/* Details Grid (Location, Employees, Website, Contact Email) */}
        <div className="space-y-2 pt-3 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <Users className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {employees}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-800 hover:underline truncate flex items-center gap-1 font-medium"
            >
              <span className="truncate">{website.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <a
              href={`mailto:${contactEmail}`}
              className="hover:underline truncate text-slate-600"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          Verified Employer
        </span>
        <Link
          to={`/companies/${company.id}`}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-all group-hover:translate-x-0.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
