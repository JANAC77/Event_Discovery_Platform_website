import React from 'react';
import { Search, Filter, RotateCcw, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

const CATEGORY_COLORS = {
  ALL: { active: 'bg-blue-600 text-white shadow-blue-600/30', inactive: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  Conference: { active: 'bg-blue-600 text-white shadow-blue-600/30', inactive: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
  Exhibition: { active: 'bg-emerald-600 text-white shadow-emerald-600/30', inactive: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  'Trade Show': { active: 'bg-purple-600 text-white shadow-purple-600/30', inactive: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
  Summit: { active: 'bg-amber-600 text-white shadow-amber-600/30', inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
  Workshop: { active: 'bg-rose-600 text-white shadow-rose-600/30', inactive: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' },
};

const CATEGORIES = ['ALL', 'Conference', 'Exhibition', 'Trade Show', 'Summit', 'Workshop'];
const INDUSTRIES = ['ALL', 'Technology', 'Healthcare', 'Finance', 'Green Energy', 'Design', 'Cybersecurity', 'Smart Cities', 'Logistics & Retail'];
const STATUSES = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'DRAFT'];

export default function EventFilterBar({ filters, setFilters, viewMode, setViewMode, onReset, totalCount }) {

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, q: e.target.value }));
  };

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({ ...prev, category: cat }));
  };

  const handleIndustryChange = (e) => {
    setFilters(prev => ({ ...prev, industry: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'date_asc') {
      setFilters(prev => ({ ...prev, sortBy: 'startDate', sortOrder: 'asc' }));
    } else if (value === 'date_desc') {
      setFilters(prev => ({ ...prev, sortBy: 'startDate', sortOrder: 'desc' }));
    } else if (value === 'name_asc') {
      setFilters(prev => ({ ...prev, sortBy: 'name', sortOrder: 'asc' }));
    }
  };

  const hasActiveFilters = filters.q || filters.category !== 'ALL' || filters.industry !== 'ALL' || filters.status !== 'ALL';

  return (
    <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">
      
      {/* Top Search & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by name, location, city, or venue..."
            value={filters.q || ''}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder-slate-400 transition-all shadow-inner"
          />
          {filters.q && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, q: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 font-extrabold px-2.5 py-1 rounded-lg bg-slate-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & Grid/List Toggle */}
        <div className="flex items-center gap-3">
          
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2.5 rounded-2xl border border-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <select
              onChange={handleSortChange}
              value={filters.sortBy === 'name' ? 'name_asc' : (filters.sortOrder === 'desc' ? 'date_desc' : 'date_asc')}
              className="bg-transparent text-xs font-extrabold text-slate-800 outline-none cursor-pointer"
            >
              <option value="date_asc">Date: Soonest First</option>
              <option value="date_desc">Date: Latest First</option>
              <option value="name_asc">Name: A-Z</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Category Chips with Custom Color Themes */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" /> Category:
        </span>
        {CATEGORIES.map(cat => {
          const colorTheme = CATEGORY_COLORS[cat] || CATEGORY_COLORS.ALL;
          const isActive = filters.category === cat;

          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                isActive
                  ? `${colorTheme.active} shadow-md`
                  : `${colorTheme.inactive}`
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Dropdowns Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
        
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold">Industry:</span>
            <select
              value={filters.industry || 'ALL'}
              onChange={handleIndustryChange}
              className="bg-transparent text-xs font-extrabold text-slate-800 outline-none cursor-pointer"
            >
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>
                  {ind === 'ALL' ? 'All Industries' : ind}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold">Status:</span>
            <select
              value={filters.status || 'ALL'}
              onChange={handleStatusChange}
              className="bg-transparent text-xs font-extrabold text-slate-800 outline-none cursor-pointer"
            >
              {STATUSES.map(st => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-black">{totalCount}</span> events
        </div>

      </div>

    </div>
  );
}
