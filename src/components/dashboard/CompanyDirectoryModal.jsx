import { useState } from 'react';
import { X, Building2, MapPin, Briefcase, Search } from 'lucide-react';

export const CompanyDirectoryModal = ({ isOpen, onClose, companies = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-100">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Verified Companies Directory ({companies.length})
            </h3>
            <p className="text-xs text-slate-500">
              Partner organizations actively hiring on JobPortal
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, industry, or location..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-white"
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto divide-y divide-slate-100 flex-1 pr-1 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">
              No companies match your search.
            </p>
          ) : (
            filtered.map((comp) => (
              <div
                key={comp.id}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-indigo-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {comp.logoText || 'CO'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{comp.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {comp.industry} • {comp.employees} employees
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {comp.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Briefcase className="w-3 h-3" />
                    {comp.activeJobs} Active {comp.activeJobs === 1 ? 'Job' : 'Jobs'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDirectoryModal;
