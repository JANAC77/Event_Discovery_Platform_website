import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbar from './components/AdminNavbar';
import Dashboard from './pages/Dashboard';
import EventDetailsModal from './components/EventDetailsModal';
import AdminEventModal from './components/AdminEventModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ToastNotification from './components/ToastNotification';
import { fetchEvents, createEvent, updateEvent, deleteEvent, seedDatabase } from './services/api';

export default function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, ongoing: 0, completed: 0, draft: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [selectedEventForDelete, setSelectedEventForDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchEvents();
      setEvents(result.data || []);
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      showToast(error.message || 'Error connecting to Backend API', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleCreateSubmit = async (formData) => {
    setActionLoading(true);
    try {
      await createEvent(formData);
      showToast(`Event '${formData.name}' created successfully in MongoDB!`, 'success');
      setIsCreateModalOpen(false);
      loadEvents();
    } catch (error) {
      showToast(error.message || 'Failed to create event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSubmit = async (formData) => {
    if (!selectedEventForEdit) return;
    setActionLoading(true);
    try {
      await updateEvent(selectedEventForEdit.id, formData);
      showToast(`Event '${formData.name}' updated successfully!`, 'success');
      setSelectedEventForEdit(null);
      loadEvents();
    } catch (error) {
      showToast(error.message || 'Failed to update event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEventForDelete) return;
    setActionLoading(true);
    try {
      await deleteEvent(selectedEventForDelete.id);
      showToast(`Event '${selectedEventForDelete.name}' removed from MongoDB`, 'success');
      setSelectedEventForDelete(null);
      loadEvents();
    } catch (error) {
      showToast(error.message || 'Failed to delete event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      const res = await seedDatabase();
      showToast(res.message || 'Database re-seeded successfully in MongoDB Atlas!', 'success');
      loadEvents();
    } catch (error) {
      showToast(error.message || 'Failed to seed database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Admin Navbar */}
      <AdminNavbar
        onOpenCreateModal={() => {
          setSelectedEventForEdit(null);
          setIsCreateModalOpen(true);
        }}
        onSeedDatabase={handleSeedDatabase}
      />

      {/* Main Admin Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard
          events={events}
          stats={stats}
          onOpenCreateModal={() => {
            setSelectedEventForEdit(null);
            setIsCreateModalOpen(true);
          }}
          onEdit={(evt) => setSelectedEventForEdit(evt)}
          onDeleteRequest={(evt) => setSelectedEventForDelete(evt)}
          onViewDetails={(evt) => setSelectedEventForDetails(evt)}
          onSeedDatabase={handleSeedDatabase}
          isLoading={isLoading}
        />
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">EventHub Admin Console</span>
            <span>&copy; 2026 MongoDB Atlas Sync</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Port 5174</span>
            <span>REST API Backend on :5000</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EventDetailsModal
        event={selectedEventForDetails}
        onClose={() => setSelectedEventForDetails(null)}
        onEdit={(evt) => {
          setSelectedEventForDetails(null);
          setSelectedEventForEdit(evt);
        }}
      />

      <AdminEventModal
        isOpen={isCreateModalOpen || Boolean(selectedEventForEdit)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedEventForEdit(null);
        }}
        onSubmit={selectedEventForEdit ? handleUpdateSubmit : handleCreateSubmit}
        eventToEdit={selectedEventForEdit}
        isLoading={actionLoading}
      />

      <DeleteConfirmModal
        isOpen={Boolean(selectedEventForDelete)}
        onClose={() => setSelectedEventForDelete(null)}
        onConfirm={handleDeleteConfirm}
        eventTitle={selectedEventForDelete?.name || ''}
        isLoading={actionLoading}
      />

      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}
