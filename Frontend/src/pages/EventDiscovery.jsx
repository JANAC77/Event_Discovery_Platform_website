import React from 'react';
import EventCard from '../components/EventCard';
import EventFilterBar from '../components/EventFilterBar';
import { Sparkles, Compass, Globe2, CalendarDays, SearchX } from 'lucide-react';

export default function EventDiscovery({
  events,
  filters,
  setFilters,
  viewMode,
  setViewMode,
  onResetFilters,
  onViewDetails,
  isLoading
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* High-Contrast Vibrant Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 shadow-2xl border border-blue-900/50 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>2026 Global Event Discovery Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Discover Premier <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Trade Shows</span>, Expos & Summits
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Explore world-class exhibitions, technology summits, green energy expos, and executive masterclasses across major international hubs.
          </p>

          {/* Quick Metrics */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Globe2 className="w-4 h-4 text-blue-400" />
              <span>Global Cities & Venues</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              <span>Real-time Schedule Sync</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Multi-industry Filtering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Multi-filter Controls Bar */}
      <EventFilterBar
        filters={filters}
        setFilters={setFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onReset={onResetFilters}
        totalCount={events.length}
      />

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-3xl h-96 animate-pulse p-5 space-y-4 border border-slate-200 shadow-sm">
              <div className="w-full h-48 bg-slate-200 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">No Events Found</h3>
          <p className="text-sm text-slate-600">
            We couldn't find any events matching your search filters. Try adjusting your search term or category.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        /* Event Grid / List View */
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
}
