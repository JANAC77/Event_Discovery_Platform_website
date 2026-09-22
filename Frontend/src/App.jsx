import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventDiscovery from './pages/EventDiscovery';
import EventDetailsPage from './pages/EventDetailsPage';
import ToastNotification from './components/ToastNotification';
import { fetchEvents } from './services/api';

export default function App() {
  const [viewMode, setViewMode] = useState('grid');
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

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load public events
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
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        
        {/* Navbar */}
        <Navbar />

        {/* Page Content with Routes */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Route 1: Main Event Discovery Portal */}
            <Route
              path="/"
              element={
                <EventDiscovery
                  events={events}
                  filters={filters}
                  setFilters={setFilters}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onResetFilters={resetFilters}
                  isLoading={isLoading}
                />
              }
            />

            {/* Route 2: Dedicated Event Details Page */}
            <Route
              path="/events/:id"
              element={<EventDetailsPage />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <span className="font-bold text-slate-900">EventHub Public Portal</span>
              <span>&copy; 2026 Route Enabled (/events/:id)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span>React Router Portal (Port 5173)</span>
              <span>Admin Console (Port 5174)</span>
            </div>
          </div>
        </footer>

        {/* Toast Notification */}
        <ToastNotification
          toast={toast}
          onClose={() => setToast(null)}
        />

      </div>
    </BrowserRouter>
  );
}
