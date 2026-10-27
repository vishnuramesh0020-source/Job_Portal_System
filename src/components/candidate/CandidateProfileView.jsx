import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Edit3,
  Share2,
  Download,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { calculateProfileCompletion } from '../../services/candidateProfileService';
import { toast } from 'react-toastify';

export const CandidateProfileView = ({
  profile,
  onEdit,
  onCreate,
}) => {
  const [showResumeModal, setShowResumeModal] = useState(false);

  if (!profile) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
          <Briefcase className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          No Candidate Profile Found
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Create your candidate profile today with your skills, experience, education, and resume to start applying for jobs.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Create Candidate Profile
        </button>
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion(profile);

  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    toast.success('Candidate profile link copied to clipboard!');
  };

  const handleDownloadResume = () => {
    if (!profile.resume?.fileName) {
      toast.info('No resume uploaded yet. Please edit your profile to add one.');
      return;
    }
    toast.success(`Downloading ${profile.resume.fileName}...`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner & Profile Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner Hero */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
              title="Share Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Profile</span>
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            {/* Profile Photo */}
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-200">
                <img
                  src={
                    profile.profilePhoto ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200"
                title="Verified Candidate"
              />
            </div>

            {/* Profile Completion Widget */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 min-w-[220px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Profile Strength
                </span>
                <span className="font-extrabold text-emerald-700">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                {completionPercentage === 100
                  ? 'All 9 profile fields fully verified'
                  : 'Add missing details to reach 100% completion'}
              </p>
            </div>
          </div>

          {/* Full Name & Title */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {profile.fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
                Candidate
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-800">
              {profile.title || 'Job Seeker'}
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600">
            {/* Email */}
            <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/50">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Email
                </span>
                <a
                  href={`mailto:${profile.email}`}
                  className="font-medium text-slate-800 hover:text-emerald-700 truncate block"
                >
                  {profile.email}
                </a>
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/50">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Mobile Number
                </span>
                <span className="font-medium text-slate-800">
                  {profile.mobileNumber || 'Not specified'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/50 sm:col-span-2 lg:col-span-1">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Address
                </span>
                <span
                  className="font-medium text-slate-800 truncate block"
                  title={profile.address}
                >
                  {profile.address || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio / Summary */}
          {profile.bio && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                About / Professional Summary
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Details: Left = Skills & Resume; Right = Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skills & Resume */}
        <div className="lg:col-span-1 space-y-6">
          {/* Skills Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                Technical Skills ({profile.skills?.length || 0})
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
            )}
          </div>

          {/* Resume Upload (UI Only) Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                Resume / CV (UI Only)
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                Manage
              </button>
            </div>

            {profile.resume?.fileName ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4
                      className="text-xs font-bold text-slate-900 truncate"
                      title={profile.resume.fileName}
                    >
                      {profile.resume.fileName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {profile.resume.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResumeModal(true)}
                    className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Preview
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  No resume uploaded
                </p>
                <button
                  type="button"
                  onClick={onEdit}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Experience & Education */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Experience */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-700" />
                Work Experience ({profile.experience?.length || 0})
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                + Add Experience
              </button>
            </div>

            {profile.experience && profile.experience.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {profile.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative group">
                    {/* Timeline bullet dot */}
                    <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-emerald-600 ring-2 ring-emerald-100" />

                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          {exp.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                          {exp.startDate} – {exp.endDate || 'Present'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-slate-800">
                          {exp.company}
                        </span>
                        {exp.location && <span>• {exp.location}</span>}
                      </div>

                      {exp.description && (
                        <p className="text-xs text-slate-600 leading-relaxed pt-1.5">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No work experience listed. Click edit to add your past roles.
              </p>
            )}
          </div>

          {/* Education & Qualifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                Education ({profile.education?.length || 0})
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                + Add Education
              </button>
            </div>

            {profile.education && profile.education.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {profile.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        {edu.degree}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {edu.institution}
                      </p>
                      {edu.score && (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          Score / CGPA: {edu.score}
                        </p>
                      )}
                    </div>

                    <div className="text-right sm:border-l sm:pl-4 sm:border-slate-200 self-start sm:self-auto">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Completed
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {edu.endYear || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No education history listed.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Resume Preview Modal (UI Simulation) */}
      {showResumeModal && profile.resume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Resume Preview (UI Simulation)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {profile.resume.fileName}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Size: {profile.resume.fileSize} • Uploaded:{' '}
                  {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-medium text-left">
                ✓ Ready for recruiter review. Attached to all active job applications under candidate ID #{profile.id}.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadResume();
                  setShowResumeModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Download Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfileView;
