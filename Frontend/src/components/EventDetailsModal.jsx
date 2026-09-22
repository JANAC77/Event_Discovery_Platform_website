import React from 'react';
import { X, Calendar, MapPin, Building, Globe, User, Share2, ExternalLink, Tag } from 'lucide-react';

export default function EventDetailsModal({ event, onClose }) {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const STATUS_BADGES = {
    UPCOMING: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    ONGOING: 'bg-blue-50 text-blue-700 border-blue-300',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-300',
    DRAFT: 'bg-amber-50 text-amber-700 border-amber-300'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center border border-slate-200 backdrop-blur-md transition-all shadow-lg hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Image */}
        <div className="relative h-56 sm:h-72 w-full bg-slate-100 shrink-0 overflow-hidden">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
            alt={event.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md border border-blue-400">
                {event.category}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md border border-purple-400">
                {event.industry}
              </span>
            </div>

            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-md backdrop-blur-md ${STATUS_BADGES[event.status] || STATUS_BADGES.UPCOMING}`}>
              {event.status}
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white">
          
          {/* Header Title & Share */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tight">
                {event.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 font-medium">
                <User className="w-4 h-4 text-blue-600" />
                <span>Organized by <strong className="text-slate-900">{event.organizer}</strong></span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Share</span>
              </button>

              {event.website && (
                <a
                  href={event.website.startsWith('http') ? event.website : `https://${event.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Schedule Card */}
            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-blue-900">Date & Schedule</h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  <span className="text-blue-600 font-bold">Starts:</span> {formatDate(event.startDate)}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  <span className="text-purple-600 font-bold">Ends:</span> {formatDate(event.endDate)}
                </p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-rose-900">Venue Location</h4>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{event.venue}</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{event.city}, {event.country}</p>
              </div>
            </div>

          </div>

          {/* Description Block */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-3">About This Event</h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
              {event.description}
            </p>
          </div>

          {/* Organizer Info */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {event.organizer ? event.organizer.charAt(0).toUpperCase() : 'O'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{event.organizer}</p>
                <p className="text-slate-500 text-[11px] font-medium">{event.website || 'Official Organizer Partner'}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
