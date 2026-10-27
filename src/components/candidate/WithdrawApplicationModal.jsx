import { useState } from 'react';
import { X, AlertTriangle, AlertCircle, Building2 } from 'lucide-react';

const WITHDRAW_REASONS = [
  'Accepted another job offer',
  'Salary or compensation expectations mismatch',
  'Location or commute is no longer suitable',
  'Applied by mistake / position not relevant',
  'Personal or family reasons',
  'Other',
];

export const WithdrawApplicationModal = ({
  isOpen,
  onClose,
  application,
  onConfirmWithdraw,
}) => {
  const [selectedReason, setSelectedReason] = useState(WITHDRAW_REASONS[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullReason =
      selectedReason === 'Other' && customNotes.trim()
        ? `Other: ${customNotes.trim()}`
        : customNotes.trim()
        ? `${selectedReason} - ${customNotes.trim()}`
        : selectedReason;

    await onConfirmWithdraw(application.id, fullReason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-5 animate-scaleUp">
        {/* Top Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Withdraw Application?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              UI action • Remove candidacy from recruiter consideration
            </p>
          </div>
        </div>

        {/* Target Position Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
          <h4 className="text-xs font-bold text-slate-900">
            {application.jobTitle}
          </h4>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{application.company}</span>
          </p>
        </div>

        {/* Warning Callout */}
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Withdrawing will mark your application as <strong>Withdrawn</strong>. Recruiters will be notified that you are no longer pursuing this opening.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Reason for Withdrawal *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-600 font-medium"
            >
              {WITHDRAW_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Any feedback or brief notes for the recruitment team..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Keep Application
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Withdrawing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawApplicationModal;
