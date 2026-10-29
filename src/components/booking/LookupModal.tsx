import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, AlertCircle, FileText, PhoneCall, Building2 } from 'lucide-react';
import { Booking } from '../../types/pg';
import { storageService } from '../../services/storageService';

interface LookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewReceipt: (booking: Booking) => void;
}

export const LookupModal: React.FC<LookupModalProps> = ({
  isOpen,
  onClose,
  onViewReceipt
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Booking[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = storageService.lookupBookings(query);
    setResults(found);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'checked-in':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Checked-In
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold text-xs bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'requested':
      case 'held':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-xs bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-slate-500 capitalize">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Track My Booking</h3>
              <p className="text-[11px] text-slate-500">
                Lookup your bed allotment, status & payment receipts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter 10-digit Phone or Ref (e.g. 9988776655)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-slate-400">Quick Test:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('9988776655');
                const found = storageService.lookupBookings('9988776655');
                setResults(found);
                setHasSearched(true);
              }}
              className="text-indigo-600 hover:underline font-mono"
            >
              9988776655 (Karthik)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setQuery('SVPG-2026-9105');
                const found = storageService.lookupBookings('SVPG-2026-9105');
                setResults(found);
                setHasSearched(true);
              }}
              className="text-indigo-600 hover:underline font-mono"
            >
              SVPG-2026-9105
            </button>
          </div>

          {/* Results List */}
          {hasSearched && (
            <div className="space-y-3 pt-2">
              {results && results.length > 0 ? (
                results.map(b => (
                  <div
                    key={b.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{b.pgName}</span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{b.customerName}</p>
                        <p className="text-slate-500 font-mono text-[11px]">{b.bookingReference}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(b.status)}
                        <p className="text-[11px] text-slate-500 mt-1">Move-in: {b.moveInDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400">Allotment:</span>
                        <p className="font-semibold text-slate-800">
                          Room {b.roomNumber} ({b.bedLabel})
                        </p>
                      </div>
                      <div className="text-right sm:text-left">
                        <span className="text-slate-400">Monthly Rent:</span>
                        <p className="font-semibold text-slate-800 tabular-nums">
                          ₹{b.monthlyRent.toLocaleString('en-IN')}/mo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-500">
                        Paid Advance: <strong className="text-slate-900 tabular-nums">₹{b.totalPaid.toLocaleString('en-IN')}</strong> ({b.paymentMode.toUpperCase()})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onViewReceipt(b);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-semibold">No booking records found for &quot;{query}&quot;</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Please double-check your mobile number or contact the hostel warden directly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
