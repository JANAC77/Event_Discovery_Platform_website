import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, eventTitle, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-3xl border border-rose-500/30 shadow-2xl overflow-hidden p-6 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-rose-400">"{eventTitle}"</strong>? This will remove the record from MongoDB.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isLoading ? 'Deleting...' : 'Confirm Delete'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
