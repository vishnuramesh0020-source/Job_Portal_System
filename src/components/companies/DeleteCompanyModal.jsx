import { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export const DeleteCompanyModal = ({
  isOpen,
  onClose,
  company,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !company) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(company.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleUp">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-100">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Delete Company?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete{' '}
              <strong className="text-slate-800">{company.name}</strong>? This action will remove the organization from the verified employer list.
            </p>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-left text-xs text-rose-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-rose-200 flex items-center justify-center font-bold shrink-0 text-rose-700">
              {company.logoText || company.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate">{company.name}</p>
              <p className="text-[11px] text-rose-600 truncate">{company.industry} • {company.location}</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-70 text-white font-semibold shadow-md shadow-rose-100 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Yes, Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCompanyModal;
