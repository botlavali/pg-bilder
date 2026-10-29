import React, { useState } from 'react';
import {
  X,
  BedDouble,
  Calendar,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Bed, Room, Floor, PGProperty, Booking } from '../../types/pg';
import { storageService } from '../../services/storageService';
import { OtpModal } from '../common/OtpModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PGProperty;
  selectedBed: Bed | null;
  rooms: Room[];
  floors: Floor[];
  onBookingComplete: (newBooking: Booking) => void;
  onViewReceipt: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  property,
  selectedBed,
  rooms,
  floors,
  onBookingComplete,
  onViewReceipt
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Info, 2: Payment, 3: Completed
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [idProofType, setIdProofType] = useState<'Aadhaar' | 'PAN' | 'Driving License' | 'Passport'>('Aadhaar');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [moveInDate, setMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [durationMonths, setDurationMonths] = useState(6);
  const [paymentChoice, setPaymentChoice] = useState<'upi' | 'cash'>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedBed) return null;

  const currentRoom = rooms.find(r => r.id === selectedBed.roomId);
  const currentFloor = floors.find(f => f.id === selectedBed.floorId);
  const sharingType = currentRoom?.sharingType || '2-sharing';
  const pricingConfig = property.pricing[sharingType] || property.pricing['2-sharing'];
  const monthlyRent = pricingConfig.monthlyRent + (currentRoom?.isAC ? pricingConfig.acExtraMonthly : 0);
  const advanceDeposit = pricingConfig.advanceDeposit;

  const handleProceedToOtpOrPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid full name and 10-digit mobile number.');
      return;
    }
    if (!idProofNumber.trim()) {
      setErrorMsg('Please provide your identity proof number.');
      return;
    }
    setErrorMsg('');

    if (!isOtpVerified) {
      setIsOtpOpen(true);
    } else {
      setStep(2);
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpVerified(true);
    setIsOtpOpen(false);
    setStep(2);
  };

  const handleFinalizeBooking = () => {
    if (paymentChoice === 'upi' && !transactionRef.trim()) {
      setErrorMsg('Please enter your UPI transaction reference / UTR number.');
      return;
    }
    setErrorMsg('');

    const newBooking = storageService.createBooking({
      pgId: property.id,
      pgName: property.name,
      customerName,
      customerPhone,
      customerEmail,
      idProofType,
      idProofNumber,
      floorId: selectedBed.floorId,
      roomId: selectedBed.roomId,
      roomNumber: currentRoom?.roomNumber || '101',
      bedId: selectedBed.id,
      bedLabel: selectedBed.bedLabel,
      sharingType,
      isAC: !!currentRoom?.isAC,
      moveInDate,
      durationMonths,
      monthlyRent,
      advanceDeposit,
      paymentMode: paymentChoice,
      transactionReference: transactionRef || undefined,
      paidAmount: paymentChoice === 'upi' ? advanceDeposit : 0
    });

    setConfirmedBooking(newBooking);
    onBookingComplete(newBooking);
    setStep(3);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                {property.name}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {step === 1 && 'Reserve Bed & Resident Details'}
                {step === 2 && 'Confirm & Payment Mode'}
                {step === 3 && 'Booking Confirmed!'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Steps Tracker */}
          <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-500">
            <span className={step >= 1 ? 'text-indigo-600 font-bold' : ''}>1. Resident Info</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-indigo-600 font-bold' : ''}>2. Advance Deposit</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-emerald-600 font-bold' : ''}>3. Confirmed Slip</span>
          </div>

          {/* Bed Summary Strip */}
          <div className="px-6 py-3 bg-indigo-50/60 border-b border-indigo-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 text-white rounded-md">
                <BedDouble className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  Room {currentRoom?.roomNumber || '101'} · {selectedBed.bedLabel}
                </p>
                <p className="text-slate-500 capitalize">
                  {currentFloor?.name} · {sharingType.replace('-', ' ')} {currentRoom?.isAC ? '· AC' : '· Non-AC'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 tabular-nums">
                ₹{monthlyRent.toLocaleString('en-IN')}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
              </p>
              <p className="text-[11px] text-indigo-700 font-semibold tabular-nums">
                ₹{advanceDeposit.toLocaleString('en-IN')} Advance
              </p>
            </div>
          </div>

          {/* STEP 1: Resident Info Form */}
          {step === 1 && (
            <form onSubmit={handleProceedToOtpOrPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per Govt ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karthik Reddy"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (for OTP & SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="karthik@gmail.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Identity Proof Document *
                  </label>
                  <select
                    value={idProofType}
                    onChange={e => setIdProofType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition bg-white"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ID Document Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5421 9876 1023"
                    value={idProofNumber}
                    onChange={e => setIdProofNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Move-in Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={moveInDate}
                      onChange={e => setMoveInDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stay Duration (Months)
                  </label>
                  <select
                    value={durationMonths}
                    onChange={e => setDurationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition bg-white"
                  >
                    <option value={1}>1 Month (Short Stay)</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months (Recommended)</option>
                    <option value={11}>11 Months (Standard Agreement)</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Verify Phone & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant OTP verification prevents ghost bookings</span>
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: Advance Payment & UPI */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Mobile Verified: <strong>{customerPhone}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Payment Option for Advance Token
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('upi')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      paymentChoice === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">UPI Instant Pay</span>
                      <QrCode className="w-4 h-4 text-indigo-600" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      GPay, PhonePe, Paytm, BHIM. Instant bed allotment.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('cash')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      paymentChoice === 'cash'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Pay at PG (Cash)</span>
                      <BedDouble className="w-4 h-4 text-slate-600" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Temporary hold for 2 hours. Pay cash upon check-in.
                    </p>
                  </button>
                </div>
              </div>

              {/* UPI QR Display */}
              {paymentChoice === 'upi' ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-semibold text-slate-600">Advance Security Amount</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      ₹{advanceDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Simulated Clean QR Code */}
                    <div className="w-24 h-24 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <QrCode className="w-16 h-16 text-slate-800" />
                      <span className="text-[8px] font-bold text-indigo-600 uppercase">Scan & Pay</span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-slate-900">Hostel UPI ID:</p>
                      <p className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-indigo-600 text-xs font-bold inline-block">
                        {property.upiId}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Scan from Google Pay, PhonePe or Paytm app to transfer ₹{advanceDeposit}.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter UPI Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 402918820194 or UPI-GPAY-XXXX"
                      value={transactionRef}
                      onChange={e => setTransactionRef(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Offline / Cash Payment Notice:</p>
                  <p>
                    Your bed will be kept on temporary hold for 2 hours. Please visit the PG warden at {property.address} with your ID proof and advance cash to complete check-in.
                  </p>
                </div>
              )}

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeBooking}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Confirm Booking Request</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed Voucher Slip */}
          {step === 3 && confirmedBooking && (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
                  Reservation Received
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Booking Reference #{confirmedBooking.bookingReference}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Thank you {confirmedBooking.customerName}! Your bed has been reserved at {property.name}.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Allotted Room & Bed:</span>
                  <span className="font-bold text-slate-900">
                    Room {confirmedBooking.roomNumber} · {confirmedBooking.bedLabel}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Move-in Date:</span>
                  <span className="font-semibold text-slate-900">{confirmedBooking.moveInDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Monthly Rent:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ₹{confirmedBooking.monthlyRent.toLocaleString('en-IN')}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Advance Paid:</span>
                  <span className="font-bold text-emerald-600 tabular-nums">
                    ₹{confirmedBooking.totalPaid.toLocaleString('en-IN')} ({confirmedBooking.paymentMode.toUpperCase()})
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onViewReceipt(confirmedBooking)}
                  className="flex-1 py-2.5 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-xl text-xs transition border border-indigo-200 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download / Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Phone OTP Verification Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        phone={customerPhone}
        onSuccess={handleOtpSuccess}
        onClose={() => setIsOtpOpen(false)}
        title="Verify Resident Mobile Number"
        description="To ensure safety and confirm your bed reservation, please enter the code sent to:"
      />
    </>
  );
};
