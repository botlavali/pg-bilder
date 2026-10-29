import React from 'react';
import {
  Building2,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  Send,
  BedDouble,
  ArrowRight,
  Plus,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Users
} from 'lucide-react';
import { PGProperty } from '../../types/pg';

interface PlatformLandingProps {
  properties: PGProperty[];
  onOpenCreatePg: () => void;
  onNavigateToPg: (slug: string) => void;
  onOpenOwnerDashboard: (pgId?: string) => void;
  onOpenLookup: () => void;
}

export const PlatformLanding: React.FC<PlatformLandingProps> = ({
  properties,
  onOpenCreatePg,
  onNavigateToPg,
  onOpenOwnerDashboard,
  onOpenLookup
}) => {
  return (
    <div className="space-y-16 py-10">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Multi-Tenant PG & Hostel SaaS Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Launch &amp; Manage Unlimited <br className="hidden sm:inline" />
          <span className="text-indigo-600">PG Hostel Websites</span> in Minutes
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The all-in-one software for PG and hostel owners. Generate branded websites with live room/bed bookings, OTP phone verification, automated WhatsApp/SMS rent reminders, and UPI reconciliation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenCreatePg}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your PG Website Free</span>
          </button>

          <button
            onClick={() => onNavigateToPg('sv-pg-for-gents')}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-sm transition border border-slate-300 shadow-xs flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Explore SV PG (Live Demo)</span>
          </button>
        </div>

        {/* 4 Proof Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="block font-black text-slate-900 text-lg">Unique Slug</span>
            <span className="text-slate-500">pgbuilder.in/pg/your-slug</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="block font-black text-slate-900 text-lg">Real OTP</span>
            <span className="text-slate-500">Verified Mobile Bookings</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="block font-black text-slate-900 text-lg">Bed Locks</span>
            <span className="text-slate-500">Zero Double Bookings</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="block font-black text-slate-900 text-lg">Auto Reminders</span>
            <span className="text-slate-500">WhatsApp &amp; SMS Invoices</span>
          </div>
        </div>
      </section>

      {/* FEATURED LIVE PG WEBSITES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
              Multi-Tenant Architecture
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Live Hosted PG Websites
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Each property has an isolated database, custom sharing rates, and public URL.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(pg => {
            const isFlagship = pg.slug === 'sv-pg-for-gents';
            return (
              <div
                key={pg.id}
                className={`bg-white rounded-2xl overflow-hidden border transition flex flex-col justify-between ${
                  isFlagship
                    ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600/20'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                    <img
                      src={pg.photos.hero}
                      alt={pg.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-900 font-bold text-[10px] rounded-full uppercase tracking-wider shadow-sm">
                        {pg.genderType}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-mono text-[10px] text-indigo-300">/pg/{pg.slug}</p>
                      <h3 className="font-extrabold text-lg leading-snug">{pg.name}</h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pg.area}, {pg.city}</span>
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {pg.tagline}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Starting Rent</span>
                        <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                          ₹{pg.pricing['3-sharing']?.monthlyRent || 7000}
                          <span className="text-[10px] text-slate-500 font-normal"> /mo</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Food &amp; WiFi</span>
                        <span className="text-emerald-600 font-bold text-xs">Included</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigateToPg(pg.slug)}
                    className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Website</span>
                  </button>

                  <button
                    onClick={() => onOpenOwnerDashboard(pg.id)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dashboard</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* "+ Launch Another PG" Card */}
          <button
            onClick={onOpenCreatePg}
            className="p-8 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 transition flex flex-col items-center justify-center text-center gap-3 group min-h-[340px]"
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Launch Another PG Website</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Have another building or franchise? Add unlimited PGs under your lead account.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
              Create New Property →
            </span>
          </button>
        </div>
      </section>

      {/* CORE CAPABILITIES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
            Engineered For Scale
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Everything You Need To Automate PG Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">OTP Phone Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify incoming residents with instant simulated 4-digit SMS OTPs. Eliminates fake inquiries and invalid phone numbers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Race-Safe Bed Holds</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time floor &amp; bed visualizer prevents double-booking. When a resident checks out, the bed is temporarily held until confirmed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Automated Reminders</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              1-click WhatsApp and SMS reminders for monthly rent dues, move-in instructions, rules notices, and payment acknowledgments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">UPI Reconciled Receipts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Residents scan your PG&apos;s UPI QR code and submit UTR reference. Auto-generates printable tax invoices and security deposit vouchers.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK RESIDENT LOOKUP CTA STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Already a Resident at One of Our Hostels?</h3>
            <p className="text-sm text-indigo-200 max-w-xl">
              Track your bed allotment, stay duration, payment status, and download your monthly rent receipts anytime using your mobile number.
            </p>
          </div>
          <button
            onClick={onOpenLookup}
            className="px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl text-xs sm:text-sm transition shadow-sm whitespace-nowrap shrink-0"
          >
            Track My Booking
          </button>
        </div>
      </section>
    </div>
  );
};
