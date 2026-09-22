import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Globe, User, Share2, ExternalLink, ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { fetchEventById } from '../services/api';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchEventById(id);
        setEvent(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadEventDetails();
    }
  }, [id]);

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
        title: event?.name,
        text: event?.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event URL copied to clipboard!');
    }
  };

  const STATUS_BADGES = {
    UPCOMING: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    ONGOING: 'bg-blue-50 text-blue-700 border-blue-300',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-300',
    DRAFT: 'bg-amber-50 text-amber-700 border-amber-300'
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-extrabold text-slate-600">Loading Event Details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'The requested event could not be retrieved.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-extrabold border border-slate-200/90 shadow-xs transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Discovery Portal</span>
        </Link>

        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span>Route:</span>
          <span className="px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 font-mono font-bold">
            /events/{id}
          </span>
        </div>
      </div>

      {/* Main Details Card Container */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl">
        
        {/* Banner Hero */}
        <div className="relative h-72 sm:h-96 w-full bg-slate-100 overflow-hidden">
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
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-md border border-blue-400">
                {event.category}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-black bg-purple-600 text-white shadow-md border border-purple-400">
                {event.industry}
              </span>
            </div>

            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-md backdrop-blur-md ${STATUS_BADGES[event.status] || STATUS_BADGES.UPCOMING}`}>
              {event.status}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                {event.name}
              </h1>
              <p className="text-sm text-slate-600 font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Hosted & Organized by <strong className="text-slate-900">{event.organizer}</strong></span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Share</span>
              </button>

              {event.website && (
                <a
                  href={event.website.startsWith('http') ? event.website : `https://${event.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Schedule Card */}
            <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-100 flex items-start gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-black tracking-wider text-blue-900">Date & Schedule</h4>
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-blue-600">Starts:</span> {formatDate(event.startDate)}
                </p>
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-purple-600">Ends:</span> {formatDate(event.endDate)}
                </p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-100 flex items-start gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-black tracking-wider text-rose-900">Venue & Location</h4>
                <p className="text-sm font-black text-slate-900">{event.venue}</p>
                <p className="text-sm text-slate-600 font-semibold">{event.city}, {event.country}</p>
              </div>
            </div>

          </div>

          {/* About Section */}
          <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200/90">
            <h3 className="text-xs uppercase font-black tracking-wider text-slate-500 mb-3">About This Event</h3>
            <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line font-medium">
              {event.description}
            </p>
          </div>

          {/* Organizer Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                {event.organizer ? event.organizer.charAt(0).toUpperCase() : 'O'}
              </div>
              <div>
                <p className="font-black text-slate-900 text-base">{event.organizer}</p>
                <p className="text-slate-500 text-xs font-semibold">{event.website || 'Official Organizer Partner'}</p>
              </div>
            </div>

            {event.website && (
              <a
                href={event.website.startsWith('http') ? event.website : `https://${event.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
              >
                Contact Organizer
              </a>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
