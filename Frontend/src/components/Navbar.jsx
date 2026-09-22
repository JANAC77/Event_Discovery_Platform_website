import React, { useState } from 'react';
import { Compass, ShieldCheck, ExternalLink, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <a href="http://localhost:5173" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-md group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all duration-300">
              <img
                src="/logo.jpg"
                alt="EventHub Logo"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Event<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Hub</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                  DISCOVERY
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">Discover &bull; Experience &bull; Connect</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="http://localhost:5173"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Discover Events</span>
            </a>

            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100/90 transition-all border border-purple-200 shadow-2xs hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Admin Panel</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            </a>
          </nav>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white p-4 space-y-3 animate-fadeIn shadow-2xl">
          <a
            href="http://localhost:5173"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md"
          >
            <Compass className="w-5 h-5" />
            <span>Discover Events</span>
          </a>

          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold bg-purple-50 text-purple-700 border border-purple-200"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Admin Control Center</span>
            </div>
            <ExternalLink className="w-4 h-4 text-purple-600" />
          </a>
        </div>
      )}

    </header>
  );
}
