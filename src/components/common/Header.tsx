import React from 'react';
import {
  Building2,
  LayoutDashboard,
  Globe,
  Search,
  Plus,
  Shield,
  User,
  ChevronDown
} from 'lucide-react';
import { PGProperty, UserAccount } from '../../types/pg';

interface HeaderProps {
  currentView: 'landing' | 'public_pg' | 'owner_dashboard';
  onNavigate: (view: 'landing' | 'public_pg' | 'owner_dashboard', slug?: string) => void;
  activePg?: PGProperty;
  currentUser: UserAccount;
  onOpenCreatePg: () => void;
  onOpenLookup: () => void;
  onOpenAuth: () => void;
  onOpenResidentPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  activePg,
  currentUser,
  onOpenCreatePg,
  onOpenLookup,
  onOpenAuth,
  onOpenResidentPortal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left group transition"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                PG Builder
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                Multi-Tenant Hostel SaaS
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
              currentView === 'landing' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            All Hostels
          </button>

          <button
            onClick={() => onNavigate('public_pg', activePg?.slug || 'sv-pg-for-gents')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 flex items-center gap-1.5 ${
              currentView === 'public_pg' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Public PG Website</span>
          </button>

          {currentUser.role !== 'customer' && (
            <button
              onClick={() => onNavigate('owner_dashboard')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 flex items-center gap-1.5 ${
                currentView === 'owner_dashboard' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>{currentUser.role === 'admin' ? 'Admin Console' : 'Owner Dashboard'}</span>
            </button>
          )}

          {currentUser.role === 'customer' ? (
            <button
              onClick={onOpenResidentPortal}
              className="whitespace-nowrap transition-colors hover:text-slate-900 flex items-center gap-1.5 text-emerald-700 font-semibold"
            >
              <User className="w-4 h-4" />
              <span>My Stays &amp; Receipts</span>
            </button>
          ) : (
            <button
              onClick={onOpenLookup}
              className="whitespace-nowrap transition-colors hover:text-slate-900 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Track Booking</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action CTA & Role Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* User Account / Role Badge */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition text-xs font-semibold text-slate-700"
            title="Click to Switch User / Role"
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs ${
                currentUser.role === 'admin'
                  ? 'bg-purple-600'
                  : currentUser.role === 'owner'
                  ? 'bg-indigo-600'
                  : 'bg-emerald-600'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5" />
              ) : currentUser.role === 'owner' ? (
                <Building2 className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="block font-bold text-slate-900 truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="block text-[10px] text-slate-500 capitalize">
                {currentUser.role === 'admin' ? 'Lead Admin' : currentUser.role === 'owner' ? 'PG Owner' : 'Resident'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Primary Action Button */}
          {currentUser.role === 'customer' ? (
            <button
              onClick={onOpenResidentPortal}
              className="px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Booking Slip</span>
              <span className="sm:hidden">My Stay</span>
            </button>
          ) : (
            <button
              onClick={onOpenCreatePg}
              className="px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create PG Website</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

