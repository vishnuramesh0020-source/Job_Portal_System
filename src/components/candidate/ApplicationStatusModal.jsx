import {
  X,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  User,
  Mail,
  Phone,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatSalaryNumber } from '../../utils/formatSalary';

export const ApplicationStatusModal = ({
  isOpen,
  onClose,
  application,
  onWithdraw,
}) => {
  if (!isOpen || !application) return null;

  const isWithdrawn = application.status?.toLowerCase() === 'withdrawn';
  const isRejected = application.status?.toLowerCase() === 'rejected';

  // Define the 4 standard application milestones
  const stages = [
    {
      id: 'submitted',
      label: 'Application Submitted',
      description: 'Your application & profile were successfully delivered.',
      isDone: true,
      date: application.appliedDate
        ? new Date(application.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Submitted',
    },
    {
      id: 'review',
      label: 'Resume & Profile Screening',
      description: 'Hiring team is evaluating your experience and tech stack.',
      isDone:
        application.status === 'Under Review' ||
        application.status === 'Shortlisted' ||
        application.status === 'Interview Scheduled' ||
        application.status === 'Offer Extended' ||
        application.status === 'Offered',
      isCurrent: application.status === 'Under Review',
    },
    {
      id: 'interview',
      label: 'Interview Process',
      description: 'Technical assessment, coding challenges, or team rounds.',
      isDone:
        application.status === 'Interview Scheduled' ||
        application.status === 'Offer Extended' ||
        application.status === 'Offered',
      isCurrent: application.status === 'Interview Scheduled',
    },
    {
      id: 'decision',
      label: isWithdrawn
        ? 'Application Withdrawn'
        : isRejected
        ? 'Application Closed'
        : 'Final Decision & Offer',
      description: isWithdrawn
        ? `Application was withdrawn by candidate (${application.withdrawReason || 'Candidate request'}).`
        : isRejected
        ? 'Candidate was not moved forward for this position.'
        : application.status === 'Offer Extended' || application.status === 'Offered'
        ? 'Official job offer extended to candidate!'
        : 'Offer negotiation & hiring team final determination.',
      isDone:
        isWithdrawn ||
        isRejected ||
        application.status === 'Offer Extended' ||
        application.status === 'Offered',
      isCurrent:
        application.status === 'Offer Extended' ||
        application.status === 'Offered',
      isError: isWithdrawn || isRejected,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto space-y-6">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {application.jobTitle || 'Application Details'}
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  isWithdrawn
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : application.statusColor?.includes('emerald') || application.status === 'Interview Scheduled'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : application.statusColor?.includes('amber') || application.status === 'Under Review'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : application.statusColor?.includes('indigo') || application.status === 'Shortlisted'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                {application.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
              <span>{application.company}</span>
              {application.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-normal text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {application.location}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Details Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60 text-xs text-slate-600">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Applied On
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {application.appliedDate
                ? new Date(application.appliedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Salary Compensation
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              {formatSalaryNumber(application.salary || 'Competitive')}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Verification
            </span>
            <span className="font-semibold text-indigo-700 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Profile Matched
            </span>
          </div>
        </div>

        {/* Visual Application Status Progression Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            Application Progress & Milestones
          </h3>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 pl-8">
            {stages.map((stage, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[30px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    stage.isError
                      ? 'bg-rose-50 border-rose-500 text-rose-600'
                      : stage.isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : stage.isCurrent
                      ? 'bg-white border-amber-500 text-amber-500 animate-pulse'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {stage.isError ? (
                    <X className="w-3 h-3" />
                  ) : stage.isDone ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    stage.isCurrent
                      ? 'bg-amber-50/60 border-amber-200'
                      : stage.isDone
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-50/40 border-slate-200/50 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs font-bold ${
                        stage.isError
                          ? 'text-rose-700'
                          : stage.isDone
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    {stage.date && (
                      <span className="text-[10px] font-medium text-slate-400">
                        {stage.date}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Submission Details */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            Submitted Candidate Details
          </h3>

          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-800">
                  {application.candidateName || 'Alex Johnson'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate text-slate-700">
                  {application.candidateEmail || 'candidate@jobportal.com'}
                </span>
              </div>
              {application.candidatePhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-700">
                    {application.candidatePhone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-semibold text-slate-800">
                  {application.resumeName || 'Resume_Attached.pdf'}
                </span>
              </div>
            </div>

            {application.coverNote && (
              <div className="pt-2 border-t border-slate-200/60 mt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Applicant Cover Note
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {application.coverNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div>
            {!isWithdrawn && onWithdraw && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onWithdraw(application);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Withdraw Application
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {application.jobId && (
              <Link
                to={`/jobs/${application.jobId}`}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>Job Posting</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusModal;
