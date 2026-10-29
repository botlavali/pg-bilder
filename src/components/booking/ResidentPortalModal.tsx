import React, { useState } from 'react';
import {
  X,
  User,
  BedDouble,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  Building2,
  Wrench,
  Plus,
  Send,
  PhoneCall
} from 'lucide-react';
import {
  Booking,
  UserAccount,
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenancePriority
} from '../../types/pg';
import { storageService } from '../../services/storageService';

interface ResidentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onViewReceipt: (booking: Booking) => void;
  onRefreshData: () => void;
}

export const ResidentPortalModal: React.FC<ResidentPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onViewReceipt,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'stays' | 'maintenance'>('stays');
  const [vacatingBookingId, setVacatingBookingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState('');

  // Maintenance form state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [issueCategory, setIssueCategory] = useState<MaintenanceCategory>('plumbing');
  const [issuePriority, setIssuePriority] = useState<MaintenancePriority>('medium');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  if (!isOpen) return null;

  const allBookings = storageService.getAllBookings();
  const myBookings = allBookings.filter(
    b =>
      b.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      b.customerPhone.replace(/\D/g, '').includes(currentUser.phone.replace(/\D/g, '')) ||
      b.customerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const activeStay = myBookings.find(b => b.status === 'checked-in' || b.status === 'confirmed');

  const allMaintenance = storageService.getAllMaintenanceRequests();
  const myMaintenanceRequests = allMaintenance.filter(
    m =>
      (activeStay && m.pgId === activeStay.pgId && m.roomNumber === activeStay.roomNumber) ||
      m.residentPhone.replace(/\D/g, '').includes(currentUser.phone.replace(/\D/g, '')) ||
      m.residentName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const handleRequestCheckout = (booking: Booking) => {
    storageService.checkOutBooking(booking.id);
    setSuccessNotice(`Check-out vacating request submitted for Room ${booking.roomNumber}. The warden will process your deposit settlement.`);
    setVacatingBookingId(null);
    onRefreshData();
  };

  const handleReportMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    const targetBooking = myBookings.find(b => b.id === selectedBookingId) || activeStay || myBookings[0];
    const property = targetBooking
      ? storageService.getPropertyById(targetBooking.pgId)
      : storageService.getAllProperties()[0];

    storageService.createMaintenanceRequest({
      pgId: targetBooking?.pgId || property?.id || 'pg_sv_gents',
      pgName: targetBooking?.pgName || property?.name || 'SV PG for Gents',
      bookingId: targetBooking?.id,
      residentName: currentUser.name,
      residentPhone: currentUser.phone,
      roomNumber: targetBooking?.roomNumber || '101',
      bedLabel: targetBooking?.bedLabel,
      category: issueCategory,
      title: issueTitle.trim(),
      description: issueDescription.trim(),
      priority: issuePriority
    });

    setSuccessNotice(`Maintenance ticket "${issueTitle}" submitted successfully! The PG owner and warden have been notified.`);
    setIsNewTicketOpen(false);
    setIssueTitle('');
    setIssueDescription('');
    onRefreshData();
    setTimeout(() => setSuccessNotice(''), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Resident Portal</h3>
              <p className="text-[11px] text-slate-500">
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.phone})
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

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('stays')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'stays'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>My Bookings &amp; Stays ({myBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'maintenance'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Maintenance &amp; Complaints ({myMaintenanceRequests.length})</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* TAB 1: MY STAYS & BOOKINGS */}
          {activeTab === 'stays' && (
            <div>
              {myBookings.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      My Registered Stays ({myBookings.length})
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {myBookings.map(b => (
                      <div
                        key={b.id}
                        className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                              <span>{b.pgName}</span>
                            </div>
                            <span className="font-mono text-[11px] text-slate-500">
                              Ref: {b.bookingReference} · Booked on {new Date(b.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                b.status === 'checked-in'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'confirmed'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : b.status === 'checked-out'
                                  ? 'bg-slate-200 text-slate-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.status === 'checked-in' ? 'Active Resident (Checked-In)' : b.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block">Room &amp; Bed</span>
                            <span className="font-bold text-slate-800 text-sm">
                              Room {b.roomNumber} ({b.bedLabel})
                            </span>
                            <span className="text-[10px] text-slate-500 block capitalize">
                              {b.sharingType.replace('-', ' ')} {b.isAC ? '· AC' : ''}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block">Move-in Date</span>
                            <span className="font-semibold text-slate-800">{b.moveInDate}</span>
                            <span className="text-[10px] text-slate-500 block">
                              Duration: {b.durationMonths} Months
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block">Monthly Rent</span>
                            <span className="font-bold text-slate-800 tabular-nums text-sm">
                              ₹{b.monthlyRent.toLocaleString('en-IN')}/mo
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold block">
                              Meals &amp; WiFi Incl.
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block">Advance Paid</span>
                            <span className="font-bold text-indigo-700 tabular-nums text-sm">
                              ₹{b.totalPaid.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-500 block uppercase">
                              Via {b.paymentMode}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onViewReceipt(b);
                                onClose();
                              }}
                              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-indigo-600" />
                              <span>View Official Receipt</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBookingId(b.id);
                                setActiveTab('maintenance');
                                setIsNewTicketOpen(true);
                              }}
                              className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Report Room Issue</span>
                            </button>
                          </div>

                          {b.status === 'checked-in' && (
                            <div>
                              {vacatingBookingId === b.id ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-rose-700 font-medium">Confirm check-out?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRequestCheckout(b)}
                                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                                  >
                                    Yes, Vacate Bed
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setVacatingBookingId(null)}
                                    className="px-2 py-1 text-slate-500 hover:bg-slate-200 text-xs rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setVacatingBookingId(b.id)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                                >
                                  <LogOut className="w-3.5 h-3.5" />
                                  <span>Submit Check-Out Notice</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">No Bookings Found Under This Profile</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven&apos;t reserved a bed yet. Browse available hostels like SV PG for Gents and book your room in seconds!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESIDENT MAINTENANCE & COMPLAINT SYSTEM */}
          {activeTab === 'maintenance' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Room Maintenance &amp; Complaints
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Report plumbing, Wi-Fi, electrical, or cleaning issues directly to hostel management.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(!isNewTicketOpen)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isNewTicketOpen ? 'Close Form' : 'Report New Issue'}</span>
                </button>
              </div>

              {/* New Ticket Form Drawer */}
              {isNewTicketOpen && (
                <form
                  onSubmit={handleReportMaintenance}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    New Maintenance Ticket
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Select Stay / Room
                      </label>
                      <select
                        value={selectedBookingId}
                        onChange={e => setSelectedBookingId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        {myBookings.map(b => (
                          <option key={b.id} value={b.id}>
                            Room {b.roomNumber} ({b.pgName})
                          </option>
                        ))}
                        {myBookings.length === 0 && <option value="">Room 101 (General)</option>}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Issue Category *
                      </label>
                      <select
                        value={issueCategory}
                        onChange={e => setIssueCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="plumbing">Plumbing (Tap / Flush / Leakage)</option>
                        <option value="electrical">Electrical (Switch / Bulb / Power)</option>
                        <option value="wifi">Wi-Fi &amp; Internet</option>
                        <option value="carpentry">Carpentry &amp; Cupboard / Lock</option>
                        <option value="cleaning">Room Housekeeping &amp; Cleaning</option>
                        <option value="appliance">Appliance (Geyser / Washing Machine)</option>
                        <option value="pest_control">Pest Control</option>
                        <option value="other">Other Concern</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={issuePriority}
                        onChange={e => setIssuePriority(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="low">Low (Cosmetic / Can wait 48 hours)</option>
                        <option value="medium">Medium (Standard 24-hour turnaround)</option>
                        <option value="high">High (Impacting sleep or study)</option>
                        <option value="urgent">Urgent (Water flood / Spark / No Wi-Fi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Short Issue Summary *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bathroom tap leaking continuously"
                        value={issueTitle}
                        onChange={e => setIssueTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Detailed Problem Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Please describe when it started and any specific details to help the technician..."
                      value={issueDescription}
                      onChange={e => setIssueDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsNewTicketOpen(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      Submit Maintenance Ticket
                    </button>
                  </div>
                </form>
              )}

              {/* Tickets List */}
              <div className="space-y-3">
                {myMaintenanceRequests.map(ticket => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            ticket.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ticket.status === 'in-progress'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ticket.status === 'resolved' && <CheckCircle2 className="w-3 h-3" />}
                          {ticket.status === 'in-progress' && <Wrench className="w-3 h-3" />}
                          {ticket.status === 'pending' && <Clock className="w-3 h-3" />}
                          <span>{ticket.status}</span>
                        </span>

                        <span className="font-bold text-slate-900">
                          Room {ticket.roomNumber} ({ticket.category})
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900 text-xs">{ticket.title}</h5>
                      <p className="text-[11px] text-slate-600">{ticket.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="text-slate-500">
                        Assigned: <strong className="text-slate-700">{ticket.assignedStaff || 'Pending Assignment'}</strong>
                      </div>

                      {ticket.resolutionNotes && (
                        <div className="text-emerald-700 italic">
                          Notes: {ticket.resolutionNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {myMaintenanceRequests.length === 0 && !isNewTicketOpen && (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <Wrench className="w-8 h-8 text-slate-300 mx-auto" />
                    <h5 className="text-xs font-bold text-slate-700">No Maintenance Tickets Filed</h5>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Experiencing any room, electrical, or plumbing issue? Click &ldquo;Report New Issue&rdquo; above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
