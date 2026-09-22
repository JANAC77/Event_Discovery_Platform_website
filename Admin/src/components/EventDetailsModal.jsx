import React from 'react';
import { X, Calendar, MapPin, Building, Globe, User, Share2, ExternalLink, Edit3 } from 'lucide-react';

export default function EventDetailsModal({ event, onClose, onEdit }) {
  if (!event) return null;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const STATUS_BADGES = {
    UPCOMING: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    ONGOING: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    COMPLETED: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    DRAFT: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-[#0b0f19] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 backdrop-blur-md transition-all shadow-xl hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-56 sm:h-72 w-full bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600/90 text-white shadow-lg backdrop-blur-md border border-blue-400/30">
                {event.category}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-600/90 text-white shadow-lg backdrop-blur-md border border-purple-400/30">
                {event.industry}
              </span>
            </div>

            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md shadow-lg ${STATUS_BADGES[event.status] || STATUS_BADGES.UPCOMING}`}>
              {event.status}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                {event.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Organized by <strong className="text-slate-200">{event.organizer}</strong></span>
              </p>
            </div>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(event);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Event</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Date & Schedule</h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  <span className="text-blue-400">Starts:</span> {formatDate(event.startDate)}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  <span className="text-purple-400">Ends:</span> {formatDate(event.endDate)}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Venue Location</h4>
                <p className="text-xs sm:text-sm font-bold text-slate-100">{event.venue}</p>
                <p className="text-xs sm:text-sm text-slate-400">{event.city}, {event.country}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80">
            <h3 className="text-sm uppercase font-bold tracking-wider text-slate-300 mb-3">About This Event</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
              {event.description}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
