import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, Calendar, CheckCircle, Clock, FileText, Activity } from 'lucide-react';

export default function Dashboard({
  events,
  stats,
  onOpenCreateModal,
  onEdit,
  onDeleteRequest,
  onViewDetails,
  isLoading
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const STATUS_BADGES = {
    UPCOMING: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    ONGOING: 'bg-blue-50 text-blue-700 border-blue-300',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-300',
    DRAFT: 'bg-amber-50 text-amber-700 border-amber-300'
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* High-Contrast Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-purple-900/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              MongoDB Atlas Live Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Event Management Console</h1>
          <p className="text-sm text-slate-300 mt-1 font-normal">
            Create, inspect, update, and remove events in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-extrabold text-slate-500">Total Events</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.total || events.length}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-extrabold text-emerald-600">Upcoming</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats.upcoming || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-extrabold text-blue-600">Live Now</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-600">{stats.ongoing || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-extrabold text-slate-500">Completed</span>
            <CheckCircle className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-3xl font-black text-slate-700">{stats.completed || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-extrabold text-amber-600">Drafts</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.draft || 0}</p>
        </div>

      </div>

      {/* Admin Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        
        {/* Table Filters */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search table by name, city, organizer, venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-900 px-3 py-2 rounded-xl outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Conference">Conference</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Summit">Summit</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-900 px-3 py-2 rounded-xl outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-black uppercase tracking-wider">
                <th className="py-4 px-6">Event Name & Organizer</th>
                <th className="py-4 px-6">Category / Industry</th>
                <th className="py-4 px-6">Event Dates</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                    Loading events from MongoDB Atlas...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                    No events found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors group">
                    
                    {/* Event Banner & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
                          alt={evt.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                        />
                        <div>
                          <p className="font-black text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {evt.name}
                          </p>
                          <p className="text-slate-500 text-xs font-semibold truncate max-w-[200px]">
                            {evt.organizer}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Industry */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {evt.category}
                        </span>
                        <p className="text-slate-600 text-[11px] font-semibold">{evt.industry}</p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>{formatDate(evt.startDate)}</div>
                      <div className="text-slate-500 text-[11px] font-normal">to {formatDate(evt.endDate)}</div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{evt.city}, {evt.country}</div>
                      <div className="text-slate-500 text-[11px] font-medium truncate max-w-[150px]">{evt.venue}</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_BADGES[evt.status] || STATUS_BADGES.UPCOMING}`}>
                        {evt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(evt)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(evt)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-purple-600 border border-slate-200 transition-colors"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(evt)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
