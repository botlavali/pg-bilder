import React from 'react';
import { Building2, ShieldCheck, PhoneCall, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'public_pg' | 'owner_dashboard', slug?: string) => void;
  onOpenCreatePg: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCreatePg,
  onOpenLookup
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span>PG Builder</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The complete multi-tenant SaaS platform empowering PG and hostel owners to launch branded booking websites, manage live room/bed inventory, automate rent reminders, and accept UPI payments.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant Data Isolation Enabled</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Hostel Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('public_pg', 'sv-pg-for-gents')}
                  className="hover:text-white transition-colors text-left"
                >
                  SV PG for Gents (Flagship)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('owner_dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Owner Management Suite
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCreatePg}
                  className="hover:text-white transition-colors text-left"
                >
                  Create New PG Website
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Resident Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-white transition-colors text-left"
                >
                  Track My Booking Request
                </button>
              </li>
              <li>
                <span className="text-slate-400">
                  Instant Phone OTP Verification
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Direct UPI Payment Receipts
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  Digital Rent Invoices & Agreements
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Platform Lead Support
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>valibotlavali@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 98450 12345</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Serving hostels across Bengaluru (Electronics City, Whitefield, Marathahalli, BTM Layout, HSR Layout, Koramangala).
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} PG Builder Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Tenant Isolation Verified</span>
            <span>·</span>
            <span>No Overbooking Guarantee</span>
            <span>·</span>
            <span>Zero Slop Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
