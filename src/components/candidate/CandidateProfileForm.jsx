import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  AlertCircle,
  Camera,
  Save,
  X,
  Check,
} from 'lucide-react';
import {
  POPULAR_SKILLS,
  AVATAR_PRESETS,
} from '../../services/candidateProfileService';
import { toast } from 'react-toastify';

export const CandidateProfileForm = ({
  initialData,
  onSave,
  onCancel,
  isCreating = false,
}) => {
  // Profile Photo state
  const [profilePhoto, setProfilePhoto] = useState(
    initialData?.profilePhoto || AVATAR_PRESETS[0]
  );
  // Skills state
  const [skills, setSkills] = useState(
    Array.isArray(initialData?.skills) && initialData.skills.length > 0
      ? initialData.skills
      : ['React 19', 'TypeScript', 'Tailwind CSS']
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [skillsError, setSkillsError] = useState('');

  // Resume state (UI only)
  const [resumeData, setResumeData] = useState(() =>
    initialData?.resume || {
      fileName: 'Alex_Johnson_Senior_Frontend_Resume.pdf',
      fileSize: '1.8 MB',
      uploadedAt: '2026-10-20T10:30:00.000Z',
    }
  );
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);

  // Form setup with React Hook Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      mobileNumber: initialData?.mobileNumber || initialData?.phone || '',
      address: initialData?.address || initialData?.location || '',
      title: initialData?.title || 'Senior Frontend Developer',
      bio: initialData?.bio || '',
      experience:
        Array.isArray(initialData?.experience) && initialData.experience.length > 0
          ? initialData.experience
          : [
              {
                id: 'exp-1',
                title: 'Senior Frontend Engineer',
                company: 'CloudSphere Global',
                location: 'Remote / Bengaluru',
                startDate: '2023',
                endDate: 'Present',
                isCurrent: true,
                description:
                  'Architected responsive enterprise analytics dashboards. Reduced bundle size by 35% with code splitting and modern bundling strategies.',
              },
            ],
      education:
        Array.isArray(initialData?.education) && initialData.education.length > 0
          ? initialData.education
          : [
              {
                id: 'edu-1',
                degree: 'B.Tech in Computer Science & Engineering',
                institution: 'National Institute of Technology',
                startYear: '2017',
                endYear: '2021',
                score: '8.9 CGPA',
              },
            ],
    },
  });

  // Dynamic experience fields
  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: 'experience',
  });

  // Dynamic education fields
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: 'education',
  });

  // Handle Skill Tag Addition
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (!trimmed) return;

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillsError(`"${trimmed}" is already added.`);
      return;
    }

    setSkills([...skills, trimmed]);
    setNewSkillInput('');
    setSkillsError('');
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    if (updated.length === 0) {
      setSkillsError('Please add at least one skill.');
    }
  };

  // Handle Photo File Upload (UI preview using FileReader)
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePhoto(event.target?.result);
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  // Handle Resume File Pick (UI Simulation)
  const handleResumeFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      toast.error('Only PDF, DOC, and DOCX files are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Resume file must be under 10MB.');
      return;
    }

    // Simulate upload progress
    setIsUploadingResume(true);
    setResumeUploadProgress(20);

    const timer1 = setTimeout(() => setResumeUploadProgress(65), 250);
    const timer2 = setTimeout(() => {
      setResumeUploadProgress(100);
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      setResumeData({
        fileName: file.name,
        fileSize: `${sizeInMb} MB`,
        uploadedAt: new Date().toISOString(),
      });
      setIsUploadingResume(false);
      toast.success(`Resume "${file.name}" uploaded successfully!`);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleRemoveResume = () => {
    setResumeData(null);
    toast.info('Resume removed.');
  };

  // Submit Handler
  const onSubmit = (formData) => {
    if (skills.length === 0) {
      setSkillsError('Please add at least one professional skill.');
      toast.error('Please add at least one skill.');
      return;
    }

    const compiledProfile = {
      ...initialData,
      id: initialData?.id || 'cand-user-default',
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      address: formData.address.trim(),
      title: formData.title.trim(),
      bio: formData.bio.trim(),
      profilePhoto: profilePhoto,
      skills: skills,
      experience: formData.experience || [],
      education: formData.education || [],
      resume: resumeData,
    };

    onSave(compiledProfile);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden animate-fadeIn"
    >
      {/* Form Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold tracking-wider uppercase mb-2 border border-emerald-400/30">
              {isCreating ? 'Create Candidate Profile' : 'Edit Candidate Profile'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isCreating ? 'Build Your Professional Profile' : 'Update Profile Details'}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              Keep your contact information, technical skills, career journey, and resume up-to-date for hiring recruiters.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Section 1: Profile Photo & Basic Identity */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-emerald-700" />
            1. Profile Photo & Identity
          </h3>

          <div className="flex flex-col md:flex-row items-start gap-6 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/60">
            {/* Photo Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-200">
                <img
                  src={profilePhoto}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = AVATAR_PRESETS[0];
                  }}
                />
              </div>

              {/* Upload Overlay */}
              <label className="absolute bottom-2 right-2 p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-md cursor-pointer transition-transform hover:scale-110">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Avatar Preset Options */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Profile Photo
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload an image from your device or select from our curated professional avatars below.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <label className="px-3 py-1.5 rounded-xl border border-dashed border-emerald-600 bg-white text-emerald-800 text-xs font-semibold hover:bg-emerald-50 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload from Device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-slate-400 font-medium">or pick avatar:</span>

                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfilePhoto(preset)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        profilePhoto === preset
                          ? 'border-emerald-600 scale-110 shadow-sm ring-2 ring-emerald-200'
                          : 'border-transparent opacity-75 hover:opacity-100 hover:scale-105'
                      }`}
                      title={`Select Avatar ${idx + 1}`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Personal & Contact Information */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Mail className="w-5 h-5 text-emerald-700" />
            2. Contact & Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.fullName
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-600'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-600'
                  }`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 60,
                      message: 'Name cannot exceed 60 characters',
                    },
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="e.g. alex.johnson@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-600'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-600'
                  }`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.mobileNumber
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-600'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-600'
                  }`}
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value:
                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/,
                      message: 'Enter a valid mobile number (at least 10 digits)',
                    },
                  })}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Address / Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 42 Silicon Boulevard, Tech Park, Bengaluru, Karnataka, India"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.address
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-600'
                      : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-600'
                  }`}
                  {...register('address', {
                    required: 'Address is required',
                    minLength: {
                      value: 5,
                      message: 'Please provide full address with city and state',
                    },
                  })}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Professional Headline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all"
                {...register('title')}
              />
            </div>
          </div>

          {/* Bio / Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Professional Summary / Bio
            </label>
            <textarea
              rows={3}
              placeholder="Brief overview of your career background, key domain strengths, and what you are looking for..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all"
              {...register('bio')}
            />
          </div>
        </div>

        {/* Section 3: Skills Management */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-700" />
              3. Skills & Technologies <span className="text-rose-500">*</span>
            </h3>
            <span className="text-xs text-slate-500">
              {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added
            </span>
          </div>

          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/60 space-y-4">
            {/* Input to add custom skill */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  placeholder="Type a skill (e.g. React 19, Docker, Python) and press Enter"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {skillsError && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {skillsError}
              </p>
            )}

            {/* Active Skills List */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Selected Candidate Skills:
              </label>
              {skills.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                  No skills selected yet. Type a skill or pick from popular recommendations below.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-emerald-700 hover:text-rose-600 transition-colors cursor-pointer"
                        title={`Remove ${skill}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Skills Quick Add Chips */}
            <div className="pt-3 border-t border-slate-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Popular Suggestions (Click to add):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-slate-400" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Work Experience */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-700" />
              4. Work Experience
            </h3>
            <button
              type="button"
              onClick={() =>
                appendExp({
                  id: `exp-${expFields.length + 1}`,
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: 'Present',
                  isCurrent: false,
                  description: '',
                })
              }
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Position
            </button>
          </div>

          <div className="space-y-4">
            {expFields.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 relative space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    Role #{index + 1}
                  </span>

                  {expFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExp(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove experience entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Job Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Job Title / Designation *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`experience.${index}.title`, {
                        required: 'Job title is required',
                      })}
                    />
                  </div>

                  {/* Company Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TechCorp Solutions"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`experience.${index}.company`, {
                        required: 'Company name is required',
                      })}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Location / Mode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru / Remote"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`experience.${index}.location`)}
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Start Period
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2022 or Jan 2022"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`experience.${index}.startDate`)}
                    />
                  </div>

                  {/* End Date */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      End Period (or Present)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Present, 2024"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`experience.${index}.endDate`)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Key Achievements & Responsibilities
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief highlights of your responsibilities, tech stacks utilized, or major impact..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                    {...register(`experience.${index}.description`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Education */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              5. Education & Qualifications
            </h3>
            <button
              type="button"
              onClick={() =>
                appendEdu({
                  id: `edu-${eduFields.length + 1}`,
                  degree: '',
                  institution: '',
                  startYear: '',
                  endYear: '',
                  score: '',
                })
              }
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Education
            </button>
          </div>

          <div className="space-y-4">
            {eduFields.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 relative space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    Degree #{index + 1}
                  </span>

                  {eduFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEdu(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove education entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Degree */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Degree / Diploma / Certificate *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech in Computer Science"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`education.${index}.degree`, {
                        required: 'Degree is required',
                      })}
                    />
                  </div>

                  {/* Institution */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      College / University / School *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`education.${index}.institution`, {
                        required: 'Institution is required',
                      })}
                    />
                  </div>

                  {/* Graduation Year */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2021"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`education.${index}.endYear`)}
                    />
                  </div>

                  {/* Score / Grade */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Grade / Percentage / CGPA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8.9 CGPA / 85%"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      {...register(`education.${index}.score`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Resume Upload (UI Only) */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              6. Resume / CV Document (UI Only)
            </h3>
            {resumeData && (
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                1 Resume Uploaded
              </span>
            )}
          </div>

          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/60 space-y-4">
            {resumeData ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {resumeData.fileName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {resumeData.fileSize} • Uploaded on{' '}
                      {new Date(resumeData.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                    Replace
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileSelect}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 text-center transition-all bg-white group cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Upload your Resume / CV
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Supports PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            )}

            {/* Upload progress feedback */}
            {isUploadingResume && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Uploading resume...</span>
                  <span>{resumeUploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${resumeUploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Bottom Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? 'Saving Changes...'
              : isCreating
              ? 'Create Candidate Profile'
              : 'Save Profile Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CandidateProfileForm;
