import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  BedDouble,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MessageCircle,
  Mail,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Sliders,
  Eye,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Wrench,
  CheckSquare,
  Tag,
  PhoneCall
} from 'lucide-react';
import {
  PGProperty,
  Floor,
  Room,
  Bed,
  Booking,
  PaymentTransaction,
  ReminderNotification,
  BedStatus,
  SharingType,
  UserAccount,
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus
} from '../../types/pg';
import { storageService } from '../../services/storageService';
import { BulkReminderModal } from './BulkReminderModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface OwnerDashboardProps {
  properties: PGProperty[];
  activeProperty: PGProperty;
  onSelectProperty: (property: PGProperty) => void;
  floors: Floor[];
  rooms: Room[];
  beds: Bed[];
  bookings: Booking[];
  payments: PaymentTransaction[];
  reminders: ReminderNotification[];
  currentUser: UserAccount;
  onOpenCreatePg: () => void;
  onViewPublicPg: (slug: string) => void;
  onViewReceipt: (booking?: Booking, payment?: PaymentTransaction) => void;
  onRefreshData: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  properties,
  activeProperty,
  onSelectProperty,
  floors,
  rooms,
  beds,
  bookings,
  payments,
  reminders,
  currentUser,
  onOpenCreatePg,
  onViewPublicPg,
  onViewReceipt,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'bookings' | 'maintenance' | 'reminders' | 'payments' | 'editor'>('overview');
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [selectedFloorForInventory, setSelectedFloorForInventory] = useState(floors[0]?.id || '');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'requested' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'>('all');

  // Maintenance Requests state
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRequest[]>(() =>
    storageService.getMaintenanceRequestsByPgId(activeProperty.id)
  );
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  const [maintenanceCategoryFilter, setMaintenanceCategoryFilter] = useState<string>('all');
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [newMntResidentName, setNewMntResidentName] = useState('');
  const [newMntResidentPhone, setNewMntResidentPhone] = useState('');
  const [newMntRoomNumber, setNewMntRoomNumber] = useState('');
  const [newMntBedLabel, setNewMntBedLabel] = useState('Bed A');
  const [newMntCategory, setNewMntCategory] = useState<MaintenanceCategory>('plumbing');
  const [newMntTitle, setNewMntTitle] = useState('');
  const [newMntDesc, setNewMntDesc] = useState('');
  const [newMntPriority, setNewMntPriority] = useState<MaintenancePriority>('medium');
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolvingNotes, setResolvingNotes] = useState('');
  const [resolvingStaff, setResolvingStaff] = useState('');

  useEffect(() => {
    setMaintenanceList(storageService.getMaintenanceRequestsByPgId(activeProperty.id));
  }, [activeProperty.id]);

  const pendingMaintenanceCount = maintenanceList.filter(m => m.status === 'pending').length;
  const inProgressMaintenanceCount = maintenanceList.filter(m => m.status === 'in-progress').length;
  const resolvedMaintenanceCount = maintenanceList.filter(m => m.status === 'resolved').length;

  const handleUpdateMaintenanceStatus = (id: string, newStatus: MaintenanceStatus, notes?: string, staff?: string) => {
    storageService.updateMaintenanceStatus(id, newStatus, notes, staff);
    setMaintenanceList(storageService.getMaintenanceRequestsByPgId(activeProperty.id));
    setResolvingTicketId(null);
    setResolvingNotes('');
    setResolvingStaff('');
    onRefreshData();
  };

  const handleCreateMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMntTitle.trim() || !newMntRoomNumber.trim()) return;

    storageService.createMaintenanceRequest({
      pgId: activeProperty.id,
      pgName: activeProperty.name,
      residentName: newMntResidentName.trim() || 'Resident',
      residentPhone: newMntResidentPhone.trim() || activeProperty.contactPhone,
      roomNumber: newMntRoomNumber.trim(),
      bedLabel: newMntBedLabel.trim() || undefined,
      category: newMntCategory,
      title: newMntTitle.trim(),
      description: newMntDesc.trim(),
      priority: newMntPriority
    });

    setMaintenanceList(storageService.getMaintenanceRequestsByPgId(activeProperty.id));
    setIsAddMaintenanceOpen(false);
    setNewMntTitle('');
    setNewMntDesc('');
    setNewMntRoomNumber('');
    onRefreshData();
  };


  // New Room Modal state
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloorId, setNewRoomFloorId] = useState(floors[0]?.id || '');
  const [newRoomSharing, setNewRoomSharing] = useState<SharingType>('2-sharing');
  const [newRoomAC, setNewRoomAC] = useState(false);

  // New Payment Modal state
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentBookingId, setPaymentBookingId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'bank_transfer'>('upi');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Reminders Form state
  const [reminderTarget, setReminderTarget] = useState<string>('all');
  const [reminderChannel, setReminderChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [reminderTemplate, setReminderTemplate] = useState<'rent_due' | 'booking_confirmation' | 'check_in_welcome' | 'rules_notice'>('rent_due');
  const [customReminderMsg, setCustomReminderMsg] = useState('');
  const [reminderSuccessAlert, setReminderSuccessAlert] = useState('');

  // Bulk SMS Reminders state & metrics
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const pendingRentResidents = storageService.getPendingRentResidents(activeProperty.id);
  const totalPendingRentAmount = pendingRentResidents.reduce((sum, r) => sum + r.amountDue, 0);
  const overdueResidentsCount = pendingRentResidents.filter(r => r.dueStatus === 'overdue').length;

  // Property Editor state
  const [editName, setEditName] = useState(activeProperty.name);
  const [editTagline, setEditTagline] = useState(activeProperty.tagline);
  const [editPhone, setEditPhone] = useState(activeProperty.contactPhone);
  const [editWhatsapp, setEditWhatsapp] = useState(activeProperty.whatsappNumber);
  const [editUpiId, setEditUpiId] = useState(activeProperty.upiId);
  const [editGateTime, setEditGateTime] = useState(activeProperty.gateClosingTime);
  const [editNoticeDays, setEditNoticeDays] = useState(activeProperty.noticePeriodDays);
  const [editRent1, setEditRent1] = useState(activeProperty.pricing['1-sharing']?.monthlyRent || 12500);
  const [editRent2, setEditRent2] = useState(activeProperty.pricing['2-sharing']?.monthlyRent || 8500);
  const [editRent3, setEditRent3] = useState(activeProperty.pricing['3-sharing']?.monthlyRent || 7000);
  const [editorSavedMsg, setEditorSavedMsg] = useState('');

  // Calculate Metrics
  const totalBedsCount = beds.length;
  const occupiedBedsCount = beds.filter(b => b.status === 'occupied').length;
  const availableBedsCount = beds.filter(b => b.status === 'available').length;
  const heldBedsCount = beds.filter(b => b.status === 'held').length;
  const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

  const totalRevenue = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingBookingsCount = bookings.filter(b => b.status === 'requested').length;

  // Floor-by-floor bed availability & occupancy status for Recharts visualization
  const floorOccupancyData = floors.map(floor => {
    const floorBeds = beds.filter(b => b.floorId === floor.id);
    const occupied = floorBeds.filter(b => b.status === 'occupied').length;
    const available = floorBeds.filter(b => b.status === 'available').length;
    const held = floorBeds.filter(b => b.status === 'held').length;
    const maintenance = floorBeds.filter(b => b.status === 'maintenance').length;
    const total = floorBeds.length;
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      floorId: floor.id,
      floorName: floor.name,
      Occupied: occupied,
      Available: available,
      Held: held,
      Maintenance: maintenance,
      totalBeds: total,
      occupancyRate: rate
    };
  });

  // Recharts Monthly Revenue Trend (Last 6 Months)
  const revenueTrendData = storageService.getMonthlyRevenueTrend(activeProperty.id);

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/pg/${activeProperty.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    storageService.addRoom(
      activeProperty.id,
      newRoomFloorId || floors[0]?.id,
      newRoomNumber,
      newRoomSharing,
      newRoomAC
    );

    setIsAddRoomOpen(false);
    setNewRoomNumber('');
    onRefreshData();
  };

  const handleBedStatusToggle = (bed: Bed, newStatus: BedStatus) => {
    storageService.updateBedStatus(bed.id, newStatus);
    onRefreshData();
  };

  const handleApproveBooking = (booking: Booking) => {
    storageService.approveBooking(booking.id);
    onRefreshData();
  };

  const handleCheckInBooking = (booking: Booking) => {
    storageService.checkInBooking(booking.id);
    onRefreshData();
  };

  const handleCheckOutBooking = (booking: Booking) => {
    storageService.checkOutBooking(booking.id);
    onRefreshData();
  };

  const handleCancelBooking = (booking: Booking) => {
    storageService.cancelBooking(booking.id, 'Cancelled by Owner');
    onRefreshData();
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const bk = bookings.find(b => b.id === paymentBookingId);
    if (!bk) return;

    storageService.recordPayment({
      pgId: activeProperty.id,
      bookingId: bk.id,
      bookingReference: bk.bookingReference,
      payerName: bk.customerName,
      payerPhone: bk.customerPhone,
      amount: Number(paymentAmount) || bk.monthlyRent,
      paymentType: 'monthly_rent',
      paymentMode,
      transactionReference: paymentRef || `TXN-MANUAL-${Date.now().toString().slice(-6)}`,
      status: 'succeeded',
      notes: paymentNotes || 'Manual payment recorded by PG owner'
    });

    setIsAddPaymentOpen(false);
    setPaymentBookingId('');
    setPaymentAmount('');
    setPaymentRef('');
    setPaymentNotes('');
    onRefreshData();
  };

  const handleSendReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetResidents = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in');
    if (reminderTarget !== 'all') {
      targetResidents = targetResidents.filter(b => b.id === reminderTarget);
    }

    if (targetResidents.length === 0) {
      setReminderSuccessAlert('No active residents found to notify.');
      return;
    }

    targetResidents.forEach(res => {
      let msg = customReminderMsg;
      let title = '';

      if (reminderTemplate === 'rent_due') {
        title = `Rent Due Notice - ${activeProperty.name}`;
        msg = msg || `Dear ${res.customerName}, gentle reminder that your monthly rent of ₹${res.monthlyRent.toLocaleString('en-IN')} for Room ${res.roomNumber} (${res.bedLabel}) at ${activeProperty.name} is due. Please pay via UPI to ${activeProperty.upiId}. Thank you!`;
      } else if (reminderTemplate === 'booking_confirmation') {
        title = `Booking Confirmation - ${activeProperty.name}`;
        msg = msg || `Hello ${res.customerName}, your booking ref ${res.bookingReference} for ${res.roomNumber} is approved! Warden contact: ${activeProperty.contactPhone}.`;
      } else if (reminderTemplate === 'rules_notice') {
        title = `Hostel Notice - ${activeProperty.name}`;
        msg = msg || `Notice for all residents: Please ensure gate closing time of ${activeProperty.gateClosingTime} is respected. Keep common areas quiet after 10 PM.`;
      }

      storageService.sendReminder({
        pgId: activeProperty.id,
        residentName: res.customerName,
        residentPhone: res.customerPhone,
        residentEmail: res.customerEmail,
        channel: reminderChannel,
        templateType: reminderTemplate,
        title,
        message: msg
      });
    });

    setReminderSuccessAlert(`Successfully dispatched ${reminderChannel.toUpperCase()} reminder to ${targetResidents.length} resident(s)!`);
    setCustomReminderMsg('');
    setTimeout(() => setReminderSuccessAlert(''), 4000);
    onRefreshData();
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PGProperty = {
      ...activeProperty,
      name: editName,
      tagline: editTagline,
      contactPhone: editPhone,
      whatsappNumber: editWhatsapp,
      upiId: editUpiId,
      gateClosingTime: editGateTime,
      noticePeriodDays: Number(editNoticeDays),
      pricing: {
        ...activeProperty.pricing,
        '1-sharing': { ...activeProperty.pricing['1-sharing'], monthlyRent: Number(editRent1) },
        '2-sharing': { ...activeProperty.pricing['2-sharing'], monthlyRent: Number(editRent2) },
        '3-sharing': { ...activeProperty.pricing['3-sharing'], monthlyRent: Number(editRent3) }
      }
    };
    storageService.saveProperty(updated);
    setEditorSavedMsg('Property settings and pricing updated successfully!');
    setTimeout(() => setEditorSavedMsg(''), 3000);
    onRefreshData();
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Role & Tenant Status Sub-header */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-purple-400' : 'bg-emerald-400'}`} />
            <span>
              {currentUser.role === 'admin'
                ? `Lead Admin Console: You have platform-wide access to all ${properties.length} PG properties.`
                : `Owner Portal: Managing ${activeProperty.name}. Strict tenant isolation active.`}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Logged in as: {currentUser.name} ({currentUser.role.toUpperCase()})
          </span>
        </div>
      </div>

      {/* Top Banner / Multi-PG Switcher Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {currentUser.role === 'admin' ? 'Active Property (Admin View):' : 'My PG Website:'}
            </span>
            <div className="relative">
              <select
                value={activeProperty.id}
                onChange={e => {
                  const found = properties.find(p => p.id === e.target.value);
                  if (found) {
                    storageService.setActivePgId(found.id);
                    onSelectProperty(found);
                  }
                }}
                className="bg-slate-800 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer pr-8"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewPublicPg(activeProperty.slug)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Public Website</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-slate-700"
            >
              {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSlug ? 'Copied URL!' : 'Copy /pg Link'}</span>
            </button>

            <button
              onClick={onOpenCreatePg}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New PG Website</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 overflow-x-auto py-3">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: TrendingUp },
              { id: 'inventory', label: 'Floors, Rooms & Beds', icon: BedDouble },
              { id: 'bookings', label: `Bookings & Approvals (${pendingBookingsCount} pending)`, icon: Users },
              { id: 'maintenance', label: `Maintenance Requests (${pendingMaintenanceCount} active)`, icon: Wrench },
              { id: 'reminders', label: 'Reminders & Messages (SMS/WhatsApp)', icon: Send },
              { id: 'payments', label: 'Payments & Receipts', icon: DollarSign },
              { id: 'editor', label: 'Website Customizer & Rates', icon: Sliders }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 text-xs font-bold py-1 border-b-2 transition whitespace-nowrap ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Occupancy Rate</span>
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">
                  {occupancyRate}%
                </p>
                <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>{occupiedBedsCount} Occupied</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-semibold">{availableBedsCount} Vacant</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Total Bed Capacity</span>
                  <BedDouble className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">
                  {totalBedsCount}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Across {floors.length} Floors · {rooms.length} Rooms
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Revenue Collected</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {payments.length} verified transactions
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Pending Rent Dues</span>
                  <Smartphone className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-3xl font-black text-rose-600 tabular-nums">
                  ₹{totalPendingRentAmount.toLocaleString('en-IN')}
                </p>
                <button
                  onClick={() => setIsBulkReminderOpen(true)}
                  className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                >
                  <span>{pendingRentResidents.length} Pending ({overdueResidentsCount} Overdue) →</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">New Booking Requests</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-3xl font-black text-amber-600 tabular-nums">
                  {pendingBookingsCount}
                </p>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline block"
                >
                  Review Pending Bookings →
                </button>
              </div>
            </div>

            {/* Quick Actions & Live Link Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Live Published PG Website
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    Active & Accepting Bookings
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activeProperty.name}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {window.location.origin}/pg/{activeProperty.slug}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onViewPublicPg(activeProperty.slug)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Website</span>
                </button>
                <button
                  onClick={() => setIsBulkReminderOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Bulk Rent SMS ({pendingRentResidents.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('reminders')}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Custom Reminders</span>
                </button>
                <button
                  onClick={() => setIsAddPaymentOpen(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>+ Record Payment</span>
                </button>
              </div>
            </div>

            {/* Property Occupancy Status Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Inventory Analytics
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                      Live Recharts Visualizer
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Property Occupancy Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bed vacancy and occupancy distribution across {floors.length} floors for {activeProperty.name}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
                    <span>Occupied ({occupiedBedsCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
                    <span>Available ({availableBedsCount})</span>
                  </div>
                  {heldBedsCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                      <span>Held ({heldBedsCount})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recharts BarChart */}
              <div className="w-full h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={floorOccupancyData}
                    margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="floorName"
                      tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-2 min-w-[210px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <span className="font-bold text-slate-100">{label}</span>
                                <span className="font-mono text-emerald-400 font-bold">{data?.occupancyRate}% Full</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 text-slate-300">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
                                    Occupied Beds:
                                  </span>
                                  <span className="font-bold tabular-nums text-white">{data?.Occupied}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 text-slate-300">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                                    Available Beds:
                                  </span>
                                  <span className="font-bold tabular-nums text-emerald-400">{data?.Available}</span>
                                </div>
                                {data?.Held > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-300">
                                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                                      Held Beds:
                                    </span>
                                    <span className="font-bold tabular-nums text-amber-400">{data?.Held}</span>
                                  </div>
                                )}
                                {data?.Maintenance > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-300">
                                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                                      Maintenance:
                                    </span>
                                    <span className="font-bold tabular-nums text-rose-400">{data?.Maintenance}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between border-t border-slate-800 pt-1 text-slate-400">
                                  <span>Total Floor Capacity:</span>
                                  <span className="font-bold tabular-nums text-slate-200">{data?.totalBeds} Beds</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Bar
                      dataKey="Occupied"
                      name="Occupied Beds"
                      stackId="beds"
                      fill="#4f46e5"
                    />
                    <Bar
                      dataKey="Available"
                      name="Available Beds"
                      stackId="beds"
                      fill="#10b981"
                    />
                    <Bar
                      dataKey="Held"
                      name="Held Beds"
                      stackId="beds"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Floor-by-Floor Quick Metric Cards Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                {floorOccupancyData.map(fl => (
                  <div
                    key={fl.floorId}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-2 hover:bg-slate-100/60 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{fl.floorName}</span>
                      <span className="text-xs font-mono font-bold text-indigo-700 tabular-nums">
                        {fl.occupancyRate}% Full
                      </span>
                    </div>

                    {/* Mini Stacked Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                      <div
                        style={{ width: `${fl.totalBeds > 0 ? (fl.Occupied / fl.totalBeds) * 100 : 0}%` }}
                        className="h-full bg-indigo-600 transition-all duration-300"
                        title={`${fl.Occupied} Occupied`}
                      />
                      <div
                        style={{ width: `${fl.totalBeds > 0 ? (fl.Held / fl.totalBeds) * 100 : 0}%` }}
                        className="h-full bg-amber-500 transition-all duration-300"
                        title={`${fl.Held} Held`}
                      />
                      <div
                        style={{ width: `${fl.totalBeds > 0 ? (fl.Available / fl.totalBeds) * 100 : 0}%` }}
                        className="h-full bg-emerald-500 transition-all duration-300"
                        title={`${fl.Available} Available`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{fl.Occupied} Occupied</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{fl.Available} Vacant</span>
                      <span>·</span>
                      <span className="text-slate-400">{fl.totalBeds} Total Beds</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue Trend Line/Area Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Financial Performance
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Last 6 Months Trend
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Monthly Revenue Trend
                  </h3>
                  <p className="text-xs text-slate-500">
                    Payment income from rent collections and security deposits for {activeProperty.name}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                    <span>Total Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    <span>Monthly Rent</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Advance Deposits</span>
                  </div>
                </div>
              </div>

              {/* Recharts Area / Line Chart */}
              <div className="w-full h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueTrendData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={val => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload;
                          return (
                            <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs space-y-2 min-w-[220px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <span className="font-bold text-slate-100">{data?.fullMonth || label}</span>
                                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                                  ₹{data?.total.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                    Monthly Rent:
                                  </span>
                                  <span className="font-bold tabular-nums text-white">
                                    ₹{data?.rent.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                                    Advance / Deposits:
                                  </span>
                                  <span className="font-bold tabular-nums text-amber-400">
                                    ₹{data?.advance.toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-800 pt-1 text-slate-400">
                                  <span>Recorded Payments:</span>
                                  <span className="font-bold tabular-nums text-slate-200">
                                    {data?.transactions} Transaction(s)
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total Revenue"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      dot={{ r: 4, fill: '#4f46e5', strokeWidth: 1, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rent"
                      name="Monthly Rent"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRent)"
                      dot={{ r: 3, fill: '#10b981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="advance"
                      name="Advance Deposits"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#f59e0b' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 6-Month Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">6-Month Total Volume</span>
                  <span className="text-base font-black text-slate-900 tabular-nums">
                    ₹{revenueTrendData.reduce((sum, d) => sum + d.total, 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Average Monthly Run</span>
                  <span className="text-base font-bold text-indigo-700 tabular-nums">
                    ₹{Math.round(revenueTrendData.reduce((sum, d) => sum + d.total, 0) / (revenueTrendData.length || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Highest Month</span>
                  <span className="text-base font-bold text-emerald-700 tabular-nums">
                    {revenueTrendData.reduce((prev, curr) => (curr.total > prev.total ? curr : prev), revenueTrendData[0] || { month: 'Oct', total: 0 }).month} (₹{revenueTrendData.reduce((prev, curr) => (curr.total > prev.total ? curr : prev), revenueTrendData[0] || { month: 'Oct', total: 0 }).total.toLocaleString('en-IN')})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Payment Reconciled</span>
                  <span className="text-base font-bold text-slate-800">
                    100% UPI &amp; Cash
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Bookings Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Recent Booking Requests</h4>
                  <p className="text-xs text-slate-500">Live feed of resident booking requests and holds</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  View All ({bookings.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{b.customerName}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{b.bookingReference}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700' :
                          b.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700' :
                          b.status === 'requested' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Room {b.roomNumber} ({b.bedLabel}) · {b.customerPhone} · Move-in: {b.moveInDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 tabular-nums">
                        ₹{b.totalPaid.toLocaleString('en-IN')} paid
                      </span>
                      {b.status === 'requested' && (
                        <button
                          onClick={() => handleApproveBooking(b)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => onViewReceipt(b)}
                        className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. FLOORS, ROOMS & BEDS INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bed & Room Inventory Manager</h3>
                <p className="text-xs text-slate-500">
                  Manage occupancy status, add rooms or floors, and prevent double bookings.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Room</span>
                </button>
              </div>
            </div>

            {/* Floor Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {floors.map(flr => (
                <button
                  key={flr.id}
                  onClick={() => setSelectedFloorForInventory(flr.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                    (selectedFloorForInventory || floors[0]?.id) === flr.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {flr.name}
                </button>
              ))}
            </div>

            {/* Rooms Grid for Selected Floor */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms
                .filter(r => r.floorId === (selectedFloorForInventory || floors[0]?.id))
                .map(room => {
                  const roomBeds = beds.filter(b => b.roomId === room.id);
                  return (
                    <div
                      key={room.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-slate-900">
                              Room {room.roomNumber}
                            </span>
                            {room.isAC && (
                              <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded border border-sky-200">
                                AC
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 capitalize">
                            {room.sharingType.replace('-', ' ')}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {roomBeds.filter(b => b.status === 'occupied').length}/{roomBeds.length} Occupied
                        </span>
                      </div>

                      {/* Beds list */}
                      <div className="space-y-2">
                        {roomBeds.map(bed => (
                          <div
                            key={bed.id}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs gap-2"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{bed.bedLabel}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  bed.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                                  bed.status === 'occupied' ? 'bg-slate-200 text-slate-800' :
                                  bed.status === 'held' ? 'bg-amber-100 text-amber-800' :
                                  'bg-rose-100 text-rose-800'
                                }`}>
                                  {bed.status}
                                </span>
                              </div>
                              {bed.currentTenantName && (
                                <p className="text-[11px] text-slate-600 mt-0.5">
                                  Resident: <strong>{bed.currentTenantName}</strong>
                                </p>
                              )}
                            </div>

                            {/* Status Quick Changer */}
                            <select
                              value={bed.status}
                              onChange={e => handleBedStatusToggle(bed, e.target.value as any)}
                              className="text-[11px] font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="available">Available</option>
                              <option value="occupied">Occupied</option>
                              <option value="held">Held</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. BOOKINGS & APPROVALS PIPELINE */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">All Booking Requests</h3>
                <p className="text-xs text-slate-500">
                  Review online booking requests, verify ID proof, approve or check-in residents.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkReminderOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Bulk Remind Rent ({pendingRentResidents.length} Pending)</span>
                </button>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {(['all', 'requested', 'confirmed', 'checked-in', 'cancelled'] as const).map(flt => (
                    <button
                      key={flt}
                      onClick={() => setBookingFilter(flt)}
                      className={`px-3 py-1.5 rounded-lg transition capitalize ${
                        bookingFilter === flt ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {flt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Ref / Date</th>
                      <th className="p-3.5">Resident Details</th>
                      <th className="p-3.5">Room & Bed</th>
                      <th className="p-3.5">Rent / Deposit</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-slate-900">{b.bookingReference}</p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(b.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{b.customerName}</p>
                          <p className="text-slate-500">{b.customerPhone}</p>
                          <p className="text-[11px] text-slate-400">
                            ID: {b.idProofType} ({b.idProofNumber})
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-slate-900">
                            Room {b.roomNumber} · {b.bedLabel}
                          </p>
                          <p className="text-slate-500 capitalize">
                            {b.sharingType.replace('-', ' ')} {b.isAC ? '(AC)' : ''}
                          </p>
                          <p className="text-[11px] text-slate-400">Move-in: {b.moveInDate}</p>
                        </td>

                        <td className="p-3.5 tabular-nums">
                          <p className="font-bold text-slate-900">₹{b.monthlyRent.toLocaleString('en-IN')}/mo</p>
                          <p className="text-slate-500">₹{b.advanceDeposit.toLocaleString('en-IN')} Adv</p>
                        </td>

                        <td className="p-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.paymentStatus === 'succeeded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {b.paymentStatus} ({b.paymentMode})
                          </span>
                          <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                            ₹{b.totalPaid.toLocaleString('en-IN')}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700' :
                            b.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700' :
                            b.status === 'checked-out' ? 'bg-slate-200 text-slate-800' :
                            b.status === 'requested' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {b.status === 'requested' && (
                            <button
                              onClick={() => handleApproveBooking(b)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs"
                            >
                              Approve
                            </button>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => handleCheckInBooking(b)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                            >
                              Check-In
                            </button>
                          )}

                          {b.status === 'checked-in' && (
                            <button
                              onClick={() => handleCheckOutBooking(b)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs"
                              title="Vacate and release bed back to available"
                            >
                              Check-Out
                            </button>
                          )}

                          {b.status !== 'cancelled' && b.status !== 'checked-out' && (
                            <button
                              onClick={() => handleCancelBooking(b)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            onClick={() => onViewReceipt(b)}
                            className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3B. MAINTENANCE REQUESTS & RESOLUTION TRACKER */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Maintenance Requests &amp; Issue Resolution
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {pendingMaintenanceCount} Pending Actions
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Residents report room and facility problems. Owners and wardens track resolution stages: <strong>Pending &rarr; In-Progress &rarr; Resolved</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMaintenanceOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Issue / Ticket</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Complaints</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">{maintenanceList.length}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Logged across all rooms</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">Pending Review</span>
                <span className="text-2xl font-black text-amber-600 tabular-nums">{pendingMaintenanceCount}</span>
                <span className="text-[10px] text-amber-700 block mt-1">Awaiting technician assignment</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
                <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block">In-Progress Repairs</span>
                <span className="text-2xl font-black text-indigo-600 tabular-nums">{inProgressMaintenanceCount}</span>
                <span className="text-[10px] text-indigo-700 block mt-1">Technician actively working</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Resolved &amp; Closed</span>
                <span className="text-2xl font-black text-emerald-600 tabular-nums">{resolvedMaintenanceCount}</span>
                <span className="text-[10px] text-emerald-700 block mt-1">Confirmed with resident</span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
                {[
                  { id: 'all', label: `All (${maintenanceList.length})` },
                  { id: 'pending', label: `Pending (${pendingMaintenanceCount})` },
                  { id: 'in-progress', label: `In-Progress (${inProgressMaintenanceCount})` },
                  { id: 'resolved', label: `Resolved (${resolvedMaintenanceCount})` }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMaintenanceStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      maintenanceStatusFilter === f.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Category:</span>
                <select
                  value={maintenanceCategoryFilter}
                  onChange={e => setMaintenanceCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="all">All Categories</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="wifi">Wi-Fi &amp; Internet</option>
                  <option value="carpentry">Carpentry &amp; Furniture</option>
                  <option value="cleaning">Housekeeping &amp; Deep Cleaning</option>
                  <option value="appliance">Appliance / Geyser / Washing Machine</option>
                  <option value="pest_control">Pest Control</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Tickets Cards List */}
            <div className="space-y-4">
              {maintenanceList
                .filter(m => {
                  const sMatch = maintenanceStatusFilter === 'all' || m.status === maintenanceStatusFilter;
                  const cMatch = maintenanceCategoryFilter === 'all' || m.category === maintenanceCategoryFilter;
                  return sMatch && cMatch;
                })
                .map(ticket => {
                  const isResolving = resolvingTicketId === ticket.id;

                  const getPriorityBadge = (p: MaintenancePriority) => {
                    switch (p) {
                      case 'urgent':
                        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase">Urgent</span>;
                      case 'high':
                        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">High</span>;
                      case 'medium':
                        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">Medium</span>;
                      default:
                        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">Low</span>;
                    }
                  };

                  const getStatusBadge = (s: MaintenanceStatus) => {
                    switch (s) {
                      case 'pending':
                        return (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        );
                      case 'in-progress':
                        return (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                            <span>In-Progress</span>
                          </span>
                        );
                      case 'resolved':
                        return (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Resolved</span>
                          </span>
                        );
                    }
                  };

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition hover:shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                          <span className="text-xs font-mono text-slate-400">
                            Ticket #{ticket.id.replace('mnt_', '')}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            · {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                            Room {ticket.roomNumber} {ticket.bedLabel ? `(${ticket.bedLabel})` : ''}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-slate-100 text-slate-600">
                            {ticket.category.replace('_', ' ')}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {ticket.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-1">
                          {ticket.description}
                        </p>
                      </div>

                      {/* Resident Info & Staff Assignment */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Reported By Resident:</span>
                          <span className="font-bold text-slate-800">{ticket.residentName}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] text-slate-600">{ticket.residentPhone}</span>
                            <a
                              href={`https://wa.me/${ticket.residentPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ticket.residentName)},%20regarding%20your%20maintenance%20ticket%20for%20Room%20${ticket.roomNumber}%20at%20${encodeURIComponent(activeProperty.name)}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-semibold text-[10px]"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">Assigned Staff / Technician:</span>
                          <span className="font-semibold text-slate-800">
                            {ticket.assignedStaff || 'Unassigned'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">Resolution Notes / Status:</span>
                          <span className="text-slate-700 italic">
                            {ticket.resolutionNotes || (ticket.status === 'resolved' ? 'Fixed and verified with resident.' : 'Pending resolution.')}
                          </span>
                          {ticket.resolvedAt && (
                            <span className="text-[10px] text-emerald-600 block mt-0.5">
                              Closed on {new Date(ticket.resolvedAt).toLocaleDateString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Resolution Drawer / Form if triggered */}
                      {isResolving && (
                        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                          <h5 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                            Update Resolution Notes &amp; Assigned Staff
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                Assigned Technician Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Ramesh (Plumber) / Raju (Network)"
                                value={resolvingStaff}
                                onChange={e => setResolvingStaff(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                Resolution Notes
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Replaced leaking tap washer, verified no leaks."
                                value={resolvingNotes}
                                onChange={e => setResolvingNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setResolvingTicketId(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateMaintenanceStatus(ticket.id, 'resolved', resolvingNotes, resolvingStaff)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                            >
                              Confirm Issue Resolved
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      {!isResolving && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Change Status:</span>
                            {ticket.status !== 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateMaintenanceStatus(ticket.id, 'pending')}
                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                              >
                                Mark Pending
                              </button>
                            )}
                            {ticket.status !== 'in-progress' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateMaintenanceStatus(ticket.id, 'in-progress', undefined, ticket.assignedStaff === 'Unassigned' ? 'In-house Warden' : ticket.assignedStaff)}
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                              >
                                Move to In-Progress
                              </button>
                            )}
                            {ticket.status !== 'resolved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setResolvingTicketId(ticket.id);
                                  setResolvingNotes(ticket.resolutionNotes || '');
                                  setResolvingStaff(ticket.assignedStaff || '');
                                }}
                                className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Resolved</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${ticket.residentPhone}`}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center gap-1"
                            >
                              <PhoneCall className="w-3 h-3 text-slate-500" />
                              <span>Call Resident</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {maintenanceList.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Pending Maintenance Issues!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    All hostel rooms, electricals, wifi routers, and plumbing are fully functional and in top condition.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. REMINDERS & MESSAGES (SMS, WHATSAPP, EMAIL) */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Automated Reminders, Messages & Mails
                </h3>
                <p className="text-xs text-slate-500">
                  Send rent due notices, move-in approvals, and emergency alerts directly via WhatsApp, SMS, or Email.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SMS & WhatsApp Gateway Active</span>
              </div>
            </div>

            {reminderSuccessAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{reminderSuccessAlert}</span>
              </div>
            )}

            {/* Dedicated Bulk SMS Rent Reminder Campaign Module */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800/40 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Mock SMS Service (Fast2SMS / MSG91)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      DLT Header: <strong className="text-white">SVPGST</strong>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Bulk SMS Rent Reminder Engine
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instantly scan active residents for pending monthly rent. Generates personalized SMS notices with UPI payment handles, dynamic room tags, character segment counter, and simulated carrier delivery acknowledgment.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Residents with Dues:</span>
                      <strong className="text-white font-bold tabular-nums">
                        {pendingRentResidents.length} Residents
                      </strong>
                    </div>
                    <span className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Outstanding Rent:</span>
                      <strong className="text-rose-400 font-bold tabular-nums">
                        ₹{totalPendingRentAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <span className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Overdue Status:</span>
                      <span className="text-amber-300 font-semibold tabular-nums">
                        {overdueResidentsCount} Overdue
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBulkReminderOpen(true)}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Launch Bulk Reminder ({pendingRentResidents.length} Pending)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reminder Composer Form */}
            <form onSubmit={handleSendReminderSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Compose New Reminder Dispatch
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Target Recipient *
                  </label>
                  <select
                    value={reminderTarget}
                    onChange={e => setReminderTarget(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition bg-white"
                  >
                    <option value="all">Broadcast to All Active Residents ({bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length})</option>
                    {bookings
                      .filter(b => b.status === 'confirmed' || b.status === 'checked-in')
                      .map(b => (
                        <option key={b.id} value={b.id}>
                          {b.customerName} (Room {b.roomNumber} · {b.customerPhone})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dispatch Channel *
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { id: 'sms', label: 'SMS', icon: Smartphone },
                      { id: 'email', label: 'Email', icon: Mail }
                    ].map(ch => {
                      const Icon = ch.icon;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setReminderChannel(ch.id as any)}
                          className={`flex-1 py-2 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                            reminderChannel === ch.id
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reminder Template Type
                  </label>
                  <select
                    value={reminderTemplate}
                    onChange={e => setReminderTemplate(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition bg-white"
                  >
                    <option value="rent_due">Monthly Rent Due Notice</option>
                    <option value="booking_confirmation">Booking Confirmation & Move-in</option>
                    <option value="rules_notice">Hostel Gate & Quiet Hours Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Content Preview (Editable)
                </label>
                <textarea
                  rows={3}
                  value={customReminderMsg}
                  placeholder={`Dear Resident, gentle reminder that your monthly rent for Room 101 at ${activeProperty.name} is due. Please transfer via UPI to ${activeProperty.upiId}. Thank you!`}
                  onChange={e => setCustomReminderMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none transition"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Recipients will receive simulated instant delivery and direct WhatsApp click options.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send {reminderChannel.toUpperCase()} Notification</span>
                </button>
              </div>
            </form>

            {/* Dispatch History Log */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">Communication & Notification Log</h4>
                <p className="text-xs text-slate-500">History of dispatched WhatsApp messages, SMS, and emails</p>
              </div>

              <div className="divide-y divide-slate-100">
                {reminders.map(rem => (
                  <div key={rem.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rem.residentName}</span>
                        <span className="text-slate-400 font-mono">{rem.residentPhone}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {rem.channel}
                        </span>
                        <span className="text-emerald-600 font-semibold text-[10px] flex items-center gap-0.5">
                          ✓ Delivered
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs italic">{rem.message}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(rem.sentAt).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div>
                      {rem.channel === 'whatsapp' && (
                        <a
                          href={`https://wa.me/${rem.residentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(rem.message)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg transition border border-emerald-200 flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Open in WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. PAYMENTS & RECEIPTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Transactions & Receipts</h3>
                <p className="text-xs text-slate-500">
                  Track advance tokens, rent receipts, UPI reconciliations, and cash payments.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddPaymentOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Record Manual Payment</span>
                </button>
              </div>
            </div>

            {/* Payments Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Receipt #</th>
                      <th className="p-3.5">Payer Name & Phone</th>
                      <th className="p-3.5">Type & Reference</th>
                      <th className="p-3.5">Mode</th>
                      <th className="p-3.5 text-right">Amount (₹)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Print</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.map(pay => (
                      <tr key={pay.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {pay.receiptNumber}
                          <p className="text-[10px] text-slate-400 font-normal">
                            {new Date(pay.recordedAt).toLocaleDateString('en-IN')}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{pay.payerName}</p>
                          <p className="text-slate-500">{pay.payerPhone}</p>
                        </td>

                        <td className="p-3.5">
                          <p className="font-semibold text-slate-800 capitalize">
                            {pay.paymentType.replace('_', ' ')}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {pay.transactionReference}
                          </p>
                        </td>

                        <td className="p-3.5 uppercase font-bold text-slate-700">
                          {pay.paymentMode}
                        </td>

                        <td className="p-3.5 text-right font-black text-slate-900 tabular-nums">
                          ₹{pay.amount.toLocaleString('en-IN')}
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                            {pay.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => onViewReceipt(undefined, pay)}
                            className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. WEBSITE CUSTOMIZER & RATES */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hostel Profile & Rate Editor
                </h3>
                <p className="text-xs text-slate-500">
                  Update PG branding, pricing per sharing type, UPI ID, and house rules.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewPublicPg(activeProperty.slug)}
                  className="px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition border border-indigo-200 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Public Page</span>
                </button>
              </div>
            </div>

            {editorSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{editorSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditor} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PG Hostel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editTagline}
                    onChange={e => setEditTagline(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={e => setEditWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hostel UPI ID (for QR Payments)
                  </label>
                  <input
                    type="text"
                    value={editUpiId}
                    onChange={e => setEditUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Monthly Rent Configuration (₹ / Month)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">1-Sharing Rent</label>
                    <input
                      type="number"
                      value={editRent1}
                      onChange={e => setEditRent1(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">2-Sharing Rent</label>
                    <input
                      type="number"
                      value={editRent2}
                      onChange={e => setEditRent2(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">3-Sharing Rent</label>
                    <input
                      type="number"
                      value={editRent3}
                      onChange={e => setEditRent3(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gate Closing Time
                  </label>
                  <input
                    type="text"
                    value={editGateTime}
                    onChange={e => setEditGateTime(e.target.value)}
                    placeholder="10:30 PM"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notice Period (Days)
                  </label>
                  <input
                    type="number"
                    value={editNoticeDays}
                    onChange={e => setEditNoticeDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
                >
                  Save Settings & Update Live Website
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Room</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Floor *</label>
                <select
                  value={newRoomFloorId}
                  onChange={e => setNewRoomFloorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {floors.map(fl => (
                    <option key={fl.id} value={fl.id}>{fl.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 204 or 305"
                  value={newRoomNumber}
                  onChange={e => setNewRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sharing Type *</label>
                <select
                  value={newRoomSharing}
                  onChange={e => setNewRoomSharing(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="1-sharing">1-Sharing (Single Bed)</option>
                  <option value="2-sharing">2-Sharing (Bed A, Bed B)</option>
                  <option value="3-sharing">3-Sharing (Bed A, Bed B, Bed C)</option>
                  <option value="4-sharing">4-Sharing (4 Beds)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acCheck"
                  checked={newRoomAC}
                  onChange={e => setNewRoomAC(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="acCheck" className="text-xs font-semibold text-slate-700">
                  Air Conditioned (AC Room)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Create Room & Beds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Manual Payment Modal */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Resident Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Resident / Booking *</label>
                <select
                  required
                  value={paymentBookingId}
                  onChange={e => {
                    setPaymentBookingId(e.target.value);
                    const b = bookings.find(x => x.id === e.target.value);
                    if (b) setPaymentAmount(b.monthlyRent.toString());
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Choose Resident --</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.customerName} (Room {b.roomNumber} - {b.bookingReference})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="upi">UPI Transfer</option>
                    <option value="cash">Cash in Hand</option>
                    <option value="bank_transfer">Net Banking / NEFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">UTR / Ref Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 4029104820"
                    value={paymentRef}
                    onChange={e => setPaymentRef(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Save & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk SMS Reminder Modal */}
      <BulkReminderModal
        isOpen={isBulkReminderOpen}
        onClose={() => setIsBulkReminderOpen(false)}
        property={activeProperty}
        onDispatchComplete={() => {
          onRefreshData();
          setReminderSuccessAlert('Bulk SMS rent payment reminders dispatched successfully via Fast2SMS / MSG91 Gateway!');
        }}
      />

      {/* Log New Maintenance Ticket Modal */}
      {isAddMaintenanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Log Maintenance Ticket</h4>
                  <p className="text-[11px] text-slate-500">Record a resident complaint or facility repair issue</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMaintenanceOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateMaintenanceSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101, 203"
                    value={newMntRoomNumber}
                    onChange={e => setNewMntRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bed Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Bed A / Bed B"
                    value={newMntBedLabel}
                    onChange={e => setNewMntBedLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Resident Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Karthik Reddy"
                    value={newMntResidentName}
                    onChange={e => setNewMntResidentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={newMntResidentPhone}
                    onChange={e => setNewMntResidentPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newMntCategory}
                    onChange={e => setNewMntCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="plumbing">Plumbing (Tap / Washroom)</option>
                    <option value="electrical">Electrical (Light / Socket)</option>
                    <option value="wifi">Wi-Fi &amp; Internet</option>
                    <option value="carpentry">Carpentry &amp; Wardrobe</option>
                    <option value="cleaning">Cleaning &amp; Housekeeping</option>
                    <option value="appliance">Appliance / Geyser / Washing Machine</option>
                    <option value="pest_control">Pest Control</option>
                    <option value="other">Other Facility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={newMntPriority}
                    onChange={e => setNewMntPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="low">Low (Cosmetic / Non-urgent)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Impacting Stay)</option>
                    <option value="urgent">Urgent (Immediate attention)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geyser water not heating in attached washroom"
                  value={newMntTitle}
                  onChange={e => setNewMntTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain when the issue occurs and any specific notes..."
                  value={newMntDesc}
                  onChange={e => setNewMntDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMaintenanceOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
