import { useForm } from 'react-hook-form';
import { X, Send } from 'lucide-react';

export const QuickApplyModal = ({
  isOpen,
  onClose,
  onSubmitApplication,
  jobs = [],
  selectedJob = null,
  currentUser = null,
}) => {
  const defaultJobId = selectedJob?.id || (jobs[0]?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      jobId: defaultJobId,
      candidateName: currentUser?.fullName || 'Alex Johnson',
      candidateEmail: currentUser?.email || 'candidate@jobportal.com',
      candidatePhone: currentUser?.phone || '+1 (555) 234-5678',
      portfolioUrl: 'https://portfolio.example.com',
      coverNote: 'Excited about this opportunity and look forward to speaking with the team.',
    },
  });

  if (!isOpen) return null;

  const handleApply = async (formData) => {
    const res = await onSubmitApplication(formData.jobId, {
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      candidatePhone: formData.candidatePhone,
      candidateId: currentUser?.id || 'cand-user',
    });

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
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-100">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Submit Job Application</h3>
            <p className="text-xs text-slate-500">
              Apply to active verified openings & boost total applications metric
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleApply)} className="space-y-4 text-xs">
          {/* Target Job Selection */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Select Position to Apply *
            </label>
            <select
              defaultValue={defaultJobId}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-white"
              {...register('jobId', { required: 'Please select a job' })}
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company} ({job.salary})
                </option>
              ))}
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Applicant Full Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              {...register('candidateName', { required: 'Name is required' })}
            />
            {errors.candidateName && (
              <p className="text-rose-600 mt-1">{errors.candidateName.message}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                {...register('candidateEmail', { required: 'Email is required' })}
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                {...register('candidatePhone')}
              />
            </div>
          </div>

          {/* Portfolio / LinkedIn */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Portfolio / GitHub / Resume Link
            </label>
            <input
              type="url"
              placeholder="https://github.com/yourhandle"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              {...register('portfolioUrl')}
            />
          </div>

          {/* Cover Note */}
          <div>
            <label className="block font-semibold uppercase text-slate-700 mb-1">
              Quick Cover Note (Optional)
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              {...register('coverNote')}
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-100 transition-all cursor-pointer"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickApplyModal;
