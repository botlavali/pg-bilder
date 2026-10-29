import React from 'react';
import { X, Printer, CheckCircle, Building2 } from 'lucide-react';
import { Booking, PaymentTransaction, PGProperty } from '../../types/pg';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking;
  payment?: PaymentTransaction;
  property?: PGProperty;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  booking,
  payment,
  property
}) => {
  if (!isOpen || (!booking && !payment)) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = payment?.receiptNumber || `RCP-${booking?.bookingReference || '2026'}`;
  const dateStr = payment?.recordedAt || booking?.createdAt || new Date().toISOString();
  const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const payerName = payment?.payerName || booking?.customerName || 'Resident';
  const payerPhone = payment?.payerPhone || booking?.customerPhone || '';
  const amount = payment?.amount || booking?.totalPaid || booking?.advanceDeposit || 0;
  const pgName = property?.name || booking?.pgName || 'SV PG for Gents';
  const pgAddress = property?.address || 'Electronics City Phase 1, Bengaluru, Karnataka';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Official Rent & Deposit Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 space-y-6" id="printable-receipt">
          {/* Brand & Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{pgName}</h2>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">{pgAddress}</p>
              <p className="text-xs text-slate-500">Phone: {property?.contactPhone || '+91 98450 12345'}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                <span>PAID RECEIPT</span>
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-2">{receiptNo}</p>
              <p className="text-xs text-slate-500">{formattedDate}</p>
            </div>
          </div>

          {/* Customer & Booking Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-medium">Billed To (Resident):</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{payerName}</p>
              <p className="text-slate-600">{payerPhone}</p>
              {booking?.idProofNumber && (
                <p className="text-slate-500 text-[11px] mt-0.5">
                  ID: {booking.idProofType} ({booking.idProofNumber})
                </p>
              )}
            </div>
            <div className="text-right sm:text-left">
              <span className="text-slate-400 font-medium">Room & Allotment:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                Room {booking?.roomNumber || '101'} · {booking?.bedLabel || 'Bed A'}
              </p>
              <p className="text-slate-600 capitalize">
                {booking?.sharingType ? `${booking.sharingType.replace('-', ' ')} ${booking.isAC ? '(AC)' : ''}` : '2 Sharing'}
              </p>
              {booking?.bookingReference && (
                <p className="text-indigo-600 font-mono font-semibold text-[11px] mt-0.5">
                  Ref: {booking.bookingReference}
                </p>
              )}
            </div>
          </div>

          {/* Payment Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Stay Duration</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">
                      {payment?.paymentType === 'advance' ? 'Security Deposit & Advance Token' : 'Monthly Accommodation & Food Rent'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Includes 3 Times Food, WiFi, Housekeeping & Utilities
                    </p>
                  </td>
                  <td className="p-3 text-center tabular-nums">
                    {booking?.durationMonths ? `${booking.durationMonths} Months` : '1 Month'}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                    ₹{amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-semibold border-t border-slate-200 text-xs">
                <tr>
                  <td colSpan={2} className="p-3 text-slate-700">
                    Total Amount Received
                  </td>
                  <td className="p-3 text-right text-indigo-700 font-bold text-sm tabular-nums">
                    ₹{amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Method & Transaction Ref */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-200 pt-4">
            <div>
              <span className="font-medium text-slate-700">Payment Mode: </span>
              <span className="uppercase font-semibold text-slate-900">
                {payment?.paymentMode || booking?.paymentMode || 'UPI'}
              </span>
              {(payment?.transactionReference || booking?.transactionReference) && (
                <span className="ml-2 font-mono text-[11px] text-slate-600">
                  (Ref: {payment?.transactionReference || booking?.transactionReference})
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-600 font-semibold">
                ✓ Electronically Authenticated
              </span>
            </div>
          </div>

          {/* Terms Note */}
          <p className="text-[11px] text-slate-400 italic leading-relaxed text-center border-t border-dashed border-slate-200 pt-3">
            * This is an official digital receipt generated by PG Builder SaaS for {pgName}. Notice period for vacating is 30 days. Security deposit refundable as per hostel terms.
          </p>
        </div>
      </div>
    </div>
  );
};
