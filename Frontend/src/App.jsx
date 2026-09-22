import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import EventDiscovery from './pages/EventDiscovery';
import EventDetailsModal from './components/EventDetailsModal';
import ToastNotification from './components/ToastNotification';
import { fetchEvents } from './services/api';

export default function App() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    q: '',
    category: 'ALL',
    industry: 'ALL',
    city: 'ALL',
    status: 'ALL',
    sortBy: 'startDate',
    sortOrder: 'asc'
  });

  // Details Modal State
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load public events from API
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchEvents(filters);
      setEvents(result.data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      showToast(error.message || 'Error connecting to Backend API', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const resetFilters = () => {
    setFilters({
      q: '',
      category: 'ALL',
      industry: 'ALL',
      city: 'ALL',
      status: 'ALL',
      sortBy: 'startDate',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar />

      {/* Public Event Discovery Page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventDiscovery
          events={events}
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onResetFilters={resetFilters}
          onViewDetails={(evt) => setSelectedEventForDetails(evt)}
          isLoading={isLoading}
        />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">EventHub Public Portal</span>
            <span>&copy; 2026 Discovery Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React Portal (Port 5173)</span>
            <span>Admin Console (Port 5174)</span>
          </div>
        </div>
      </footer>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEventForDetails}
        onClose={() => setSelectedEventForDetails(null)}
      />

      {/* Toast Notification */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}
