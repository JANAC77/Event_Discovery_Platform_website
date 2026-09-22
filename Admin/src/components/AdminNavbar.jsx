import React, { useState } from 'react';
import { ShieldCheck, Plus, ExternalLink, Menu, X } from 'lucide-react';

export default function AdminNavbar({ onOpenCreateModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-purple-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Admin Logo with Generated Asset */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-purple-200 shadow-md">
              <img
                src="/logo.jpg"
                alt="EventHub Logo"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
                  EventHub <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Admin</span>
                </span>
                <span className="hidden sm:inline text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                  CONTROL CENTER
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">MongoDB Atlas Full CRUD Console</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold whitespace-nowrap border border-slate-200 transition-all hover:scale-[1.02]"
            >
              <span>View Discovery Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </a>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold whitespace-nowrap shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add New Event</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="p-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-200 bg-white p-4 space-y-3 animate-fadeIn shadow-2xl">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCreateModal();
            }}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </button>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-800 border border-slate-200"
          >
            <span>Public Discovery Portal</span>
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>
        </div>
      )}

    </header>
  );
}
