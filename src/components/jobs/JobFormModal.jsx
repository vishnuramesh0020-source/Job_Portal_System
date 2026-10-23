import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  Briefcase,
  Building2,
  IndianRupee,
  MapPin,
  Plus,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  JOB_CATEGORIES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_STATUSES,
  LOCATION_TYPES,
  POPULAR_SKILLS,
} from '../../services/jobService';
import { formatSalaryWithSymbol } from '../../utils/formatSalary';

const DEFAULT_DEADLINE = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
const DEFAULT_SKILLS = ['React', 'TypeScript', 'Tailwind CSS'];

const JobFormModalContent = ({
  onClose,
  onSubmitJob,
  initialData = null,
  isEditMode = false,
  defaultCompany = '',
}) => {
  const [skillsList, setSkillsList] = useState(() => {
    if (initialData && isEditMode && Array.isArray(initialData.skills)) {
      return initialData.skills;
    }
    return DEFAULT_SKILLS;
  });
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      company: initialData?.company || defaultCompany || 'TechCorp Solutions',
      category: initialData?.category || 'Engineering',
      employmentType: initialData?.employmentType || initialData?.type || 'Full-time',
      experienceLevel: initialData?.experienceLevel || 'Mid Level',
      salaryRange: formatSalaryWithSymbol(initialData?.salaryRange || initialData?.salary || '12,00,000 - 18,00,000'),
      location: initialData?.location || 'Remote, US',
      locationType: initialData?.locationType || 'Remote',
      deadline: initialData?.deadline || (isEditMode ? '' : DEFAULT_DEADLINE),
      status: initialData?.status === 'Closed' ? 'Closed' : 'Open',
      description: initialData?.description || '',
      requirements: initialData?.requirements || '',
      responsibilities: initialData?.responsibilities || '',
      contactEmail: initialData?.contactEmail || (isEditMode ? '' : 'careers@company.com'),
    },
  });

  // Add a skill chip
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;
    if (!skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleFormSubmit = async (formData) => {
    const payload = {
      ...formData,
      skills: skillsList.length > 0 ? skillsList : ['General'],
    };

    const success = await onSubmitJob(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update role compensation, deadline, required skills, and status'
                : 'Publish an active position to hire talent across the JobPortal ecosystem'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
          {/* Row 1: Job Title */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Job Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer (React 19)"
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600 bg-white'
                }`}
                {...register('title', {
                  required: 'Job title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' },
                })}
              />
            </div>
            {errors.title && (
              <p className="text-rose-600 mt-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Row 2: Company Name & Job Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Hiring Company *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.company
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600 bg-white'
                  }`}
                  {...register('company', { required: 'Company name is required' })}
                />
              </div>
              {errors.company && (
                <p className="text-rose-600 mt-1 font-medium">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Job Category *
              </label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                  {...register('category', { required: 'Category is required' })}
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Employment Type & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Employment Type *
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('employmentType')}
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Experience Level *
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('experienceLevel')}
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Salary Range & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Salary Range *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. ₹15,00,000 - 22,00,000 / year"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.salaryRange
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600 bg-white'
                  }`}
                  {...register('salaryRange', { required: 'Salary range is required' })}
                />
              </div>
              {errors.salaryRange && (
                <p className="text-rose-600 mt-1 font-medium">{errors.salaryRange.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA or Remote, US"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.location
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600 bg-white'
                  }`}
                  {...register('location', { required: 'Location is required' })}
                />
              </div>
              {errors.location && (
                <p className="text-rose-600 mt-1 font-medium">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Row 5: Location Type, Application Deadline & Job Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Workplace Type
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('locationType')}
              >
                {LOCATION_TYPES.map((lt) => (
                  <option key={lt} value={lt}>
                    {lt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Application Deadline *
              </label>
              <div className="relative">
                <input
                  type="date"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.deadline
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600 bg-white'
                  }`}
                  {...register('deadline', { required: 'Application deadline is required' })}
                />
              </div>
              {errors.deadline && (
                <p className="text-rose-600 mt-1 font-medium">{errors.deadline.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Job Status (Open / Closed) *
              </label>
              <select
                className={`w-full px-3 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 transition-all ${
                  register('status').value === 'Closed'
                    ? 'border-rose-300 text-rose-700 bg-rose-50/30'
                    : 'border-slate-300 text-emerald-700 bg-emerald-50/30'
                }`}
                {...register('status')}
              >
                {JOB_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === 'Open' ? '● Open (Hiring Active)' : '✕ Closed (Filled / Inactive)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Required Skills Chips Component */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Required Skills & Technologies *
              </label>
              <span className="text-[11px] text-slate-400">
                {skillsList.length} skills added
              </span>
            </div>

            {/* Input + Add button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="Type skill & press Enter (e.g. React, TypeScript, Docker)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Current Added Skills Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1 min-h-[32px]">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Popular Suggestions quick pills */}
            <div className="pt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
              <span>Quick add:</span>
              {POPULAR_SKILLS.slice(0, 8).map((ps) => (
                <button
                  key={ps}
                  type="button"
                  onClick={() => handleAddSkill(ps)}
                  disabled={skillsList.includes(ps)}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-colors ${
                    skillsList.includes(ps)
                      ? 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
                      : 'bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border-slate-200 cursor-pointer'
                  }`}
                >
                  +{ps}
                </button>
              ))}
            </div>
          </div>

          {/* Row 7: Job Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Job Description & Overview *
            </label>
            <textarea
              rows={3}
              placeholder="Provide a comprehensive summary of the team, mission, and day-to-day impact..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600 bg-white'
              }`}
              {...register('description', {
                required: 'Job description is required',
                minLength: { value: 15, message: 'Description must be at least 15 characters' },
              })}
            />
            {errors.description && (
              <p className="text-rose-600 mt-1 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Row 8: Key Requirements & Responsibilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Candidate Requirements
              </label>
              <textarea
                rows={2}
                placeholder="Key qualifications, degree or equivalent experience..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('requirements')}
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Core Responsibilities
              </label>
              <textarea
                rows={2}
                placeholder="Daily deliverables, sprint milestones, and team deliverables..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 bg-white"
                {...register('responsibilities')}
              />
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 text-white font-semibold shadow-md shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Job...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Job Posting'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const JobFormModal = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  const key = props.initialData?.id
    ? `edit-${props.initialData.id}`
    : `create-${props.defaultCompany || 'default'}`;
  return <JobFormModalContent key={key} {...props} />;
};

export default JobFormModal;
