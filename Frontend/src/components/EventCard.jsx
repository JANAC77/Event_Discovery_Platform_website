import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building, ArrowRight, UserCheck, Tag } from 'lucide-react';

const STATUS_CONFIG = {
  UPCOMING: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Upcoming' },
  ONGOING: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500 animate-pulse', label: 'Live Now' },
  COMPLETED: { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: 'Completed' },
  DRAFT: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Draft' },
};

// Helper function to create URL slug from event name
const createSlug = (name) => {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function EventCard({ event, onViewDetails }) {
  const statusInfo = STATUS_CONFIG[event.status] || STATUS_CONFIG.UPCOMING;
  const eventSlug = createSlug(event.name) || event.id;

  const formatDateRange = (startStr, endStr) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const startMonth = start.toLocaleString('default', { month: 'short' });
      const endMonth = end.toLocaleString('default', { month: 'short' });
      const year = start.getFullYear();

      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
      }
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
    } catch (e) {
      return 'Date TBD';
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col group h-full bg-white border border-slate-200 shadow-md hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      
      {/* Event Banner Image Link */}
      <Link to={`/events/${eventSlug}`} className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 block">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Status Pill */}
        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${statusInfo.bg}`}>
          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
          <span>{statusInfo.label}</span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-blue-700 border border-blue-200 backdrop-blur-md shadow-sm">
          {event.category}
        </div>

        {/* Date Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-slate-900/90 text-white px-3 py-1 rounded-xl border border-slate-700 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Industry tag */}
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-600">
            <Tag className="w-3.5 h-3.5 text-purple-500" />
            <span>{event.industry}</span>
          </div>

          {/* Event Title Link */}
          <Link 
            to={`/events/${eventSlug}`}
            className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors block line-clamp-2 mb-2 tracking-tight"
          >
            {event.name}
          </Link>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
            {event.description}
          </p>

          {/* Location & Venue */}
          <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3 mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{event.city}, {event.country}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Building className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[120px] font-semibold">{event.organizer}</span>
          </div>

          <Link
            to={`/events/${eventSlug}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold border border-blue-200 hover:border-blue-600 transition-all shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
