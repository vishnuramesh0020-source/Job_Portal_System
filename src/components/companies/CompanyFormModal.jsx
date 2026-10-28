import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Globe, Mail, MapPin, Users, Loader2 } from 'lucide-react';
import { INDUSTRY_OPTIONS, EMPLOYEE_RANGES } from '../../services/companyService';

export const CompanyFormModal = ({
  isOpen,
  onClose,
  onSubmitCompany,
  initialData = null,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      industry: 'Technology',
      location: '',
      website: '',
      contactEmail: '',
      employees: '100-250 employees',
      logo: '',
      description: '',
    },
  });

  // Prepopulate form when initialData changes or modal opens
  useEffect(() => {
    if (initialData && isEditMode) {
      reset({
        name: initialData.name || '',
        industry: initialData.industry || 'Technology',
        location: initialData.location || '',
        website: initialData.website || '',
        contactEmail: initialData.contactEmail || '',
        employees: initialData.employees || '100-250 employees',
        logo: initialData.logo || '',
        description: initialData.description || '',
      });
    } else {
      reset({
        name: '',
        industry: 'Technology',
        location: 'San Francisco, CA',
        website: 'https://',
        contactEmail: '',
        employees: '100-250 employees',
        logo: '',
        description: '',
      });
    }
  }, [initialData, isEditMode, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    const success = await onSubmitCompany(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-950/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditMode ? 'Edit Company Profile' : 'Add New Company'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update company credentials, contact information, and branding'
                : 'Register a verified employer organization into the platform'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
          {/* Company Name */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Company Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Acme Innovations Corp."
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-800 bg-white'
                }`}
                {...register('name', {
                  required: 'Company name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
            </div>
            {errors.name && (
              <p className="text-rose-600 mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Industry & Employee Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Industry Category *
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-800 bg-white"
                {...register('industry', { required: 'Please select an industry' })}
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Number of Employees *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-800 bg-white"
                  {...register('employees')}
                >
                  {EMPLOYEE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Headquarters Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.location
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-800 bg-white'
                  }`}
                  {...register('location', { required: 'Location is required' })}
                />
              </div>
              {errors.location && (
                <p className="text-rose-600 mt-1 font-medium">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Official Website *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://company.com"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.website
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-800 bg-white'
                  }`}
                  {...register('website', {
                    required: 'Website is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Enter a valid URL starting with http:// or https://',
                    },
                  })}
                />
              </div>
              {errors.website && (
                <p className="text-rose-600 mt-1 font-medium">{errors.website.message}</p>
              )}
            </div>
          </div>

          {/* Contact Email & Logo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Contact Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="careers@company.com"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.contactEmail
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-800 bg-white'
                  }`}
                  {...register('contactEmail', {
                    required: 'Contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.contactEmail && (
                <p className="text-rose-600 mt-1 font-medium">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Logo Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-800 bg-white"
                {...register('logo')}
              />
            </div>
          </div>

          {/* Company Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Company Description & Mission *
            </label>
            <textarea
              rows={3}
              placeholder="Describe the company's core mission, engineering culture, and employee benefits..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-800 bg-white'
              }`}
              {...register('description', {
                required: 'Company description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              })}
            />
            {errors.description && (
              <p className="text-rose-600 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 disabled:opacity-70 text-white font-semibold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Company...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Add Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyFormModal;
