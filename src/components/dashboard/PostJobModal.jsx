import { useForm } from 'react-hook-form';
import { X, Briefcase } from 'lucide-react';

export const PostJobModal = ({ isOpen, onClose, onSubmitJob, defaultCompany = 'TechCorp Solutions' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      company: defaultCompany,
      category: 'Engineering',
      location: 'Remote, US',
      type: 'Full-Time',
      salary: '$120,000 - $145,000',
      description: '',
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (formData) => {
    const res = await onSubmitJob(formData);
    if (res.success) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Post a New Job Opening</h3>
            <p className="text-xs text-slate-500">Live job listings update platform metrics instantly</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
          {/* Job Title */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer (React 19)"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              {...register('title', { required: 'Job title is required' })}
            />
            {errors.title && <p className="text-rose-600 mt-1">{errors.title.message}</p>}
          </div>

          {/* Company & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                {...register('company', { required: 'Company name is required' })}
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-slate-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('category')}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design & UI/UX</option>
                <option value="Product">Product Management</option>
                <option value="DevOps">Cloud & DevOps</option>
                <option value="Data & AI">Data Science & AI</option>
                <option value="Marketing">Growth & Marketing</option>
                <option value="Security">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Location & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Remote, US or Austin, TX"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                {...register('location')}
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-slate-700 mb-1">
                Employment Type
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('type')}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Contract">Contract</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Salary Compensation Range
            </label>
            <input
              type="text"
              placeholder="e.g. $120,000 - $145,000"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              {...register('salary')}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Job Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe core responsibilities and qualifications..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              {...register('description')}
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100 transition-all cursor-pointer"
            >
              Publish Job Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;
