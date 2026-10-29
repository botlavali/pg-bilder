export type SharingType = '1-sharing' | '2-sharing' | '3-sharing' | '4-sharing';

export type BedStatus = 'available' | 'held' | 'occupied' | 'maintenance';

export type BookingStatus =
  | 'requested'
  | 'held'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'partial';

export type PaymentMode = 'upi' | 'cash' | 'bank_transfer';

export type ReminderChannel = 'whatsapp' | 'sms' | 'email';

export type ReminderTemplateType =
  | 'rent_due'
  | 'booking_confirmation'
  | 'check_in_welcome'
  | 'payment_receipt'
  | 'rules_notice';

export interface Bed {
  id: string;
  pgId: string;
  roomId: string;
  floorId: string;
  bedLabel: string; // e.g. "Bed A", "Bed B"
  status: BedStatus;
  currentBookingId?: string;
  currentTenantName?: string;
  currentTenantPhone?: string;
  holdExpiresAt?: number; // timestamp
}

export interface Room {
  id: string;
  pgId: string;
  floorId: string;
  roomNumber: string; // e.g. "101", "102"
  sharingType: SharingType;
  isAC: boolean;
  hasAttachedBathroom: boolean;
  status: 'active' | 'maintenance';
}

export interface Floor {
  id: string;
  pgId: string;
  floorNumber: number;
  name: string; // e.g. "Ground Floor", "1st Floor"
}

export interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface SharingPricingConfig {
  monthlyRent: number;
  advanceDeposit: number;
  available: boolean;
  acAvailable: boolean;
  acExtraMonthly: number;
  features: string[];
}

export interface PGProperty {
  id: string;
  ownerId: string;
  name: string;
  slug: string; // e.g. "sv-pg-for-gents"
  tagline: string;
  description: string;
  genderType: 'gents' | 'ladies' | 'coliving';
  address: string;
  landmark: string;
  city: string;
  area: string;
  pincode: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  upiId: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt: string;
  photos: {
    hero: string;
    room: string;
    dining: string;
    lounge: string;
    exterior: string;
  };
  facilities: string[];
  pricing: Record<SharingType, SharingPricingConfig>;
  mealPlan: MealDay[];
  houseRules: string[];
  noticePeriodDays: number;
  gateClosingTime: string;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "SVPG-8491"
  pgId: string;
  pgName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  idProofType: 'Aadhaar' | 'PAN' | 'Driving License' | 'Passport';
  idProofNumber: string;
  floorId: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedLabel: string;
  sharingType: SharingType;
  isAC: boolean;
  moveInDate: string;
  durationMonths: number;
  monthlyRent: number;
  advanceDeposit: number;
  totalPaid: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  transactionReference?: string;
  createdAt: string;
  checkInDate?: string;
  checkOutDate?: string;
  holdExpiresAt?: number;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  pgId: string;
  bookingId: string;
  bookingReference: string;
  payerName: string;
  payerPhone: string;
  amount: number;
  paymentType: 'advance' | 'monthly_rent' | 'security_deposit';
  paymentMode: PaymentMode;
  transactionReference: string;
  status: 'succeeded' | 'pending' | 'failed';
  recordedAt: string;
  receiptNumber: string;
  notes?: string;
}

export interface ReminderNotification {
  id: string;
  pgId: string;
  residentName: string;
  residentPhone: string;
  residentEmail: string;
  channel: ReminderChannel;
  templateType: ReminderTemplateType;
  title: string;
  message: string;
  status: 'delivered' | 'sent' | 'pending';
  sentAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'owner' | 'customer';
  pgIds: string[];
  password?: string;
  businessName?: string;
}

export interface PendingRentResident {
  bookingId: string;
  bookingReference: string;
  pgId: string;
  residentName: string;
  residentPhone: string;
  residentEmail: string;
  roomNumber: string;
  bedLabel: string;
  sharingType: SharingType;
  monthlyRent: number;
  amountDue: number;
  dueDate: string;
  daysOverdue: number;
  dueStatus: 'overdue' | 'due_today' | 'upcoming';
  lastPaymentDate?: string;
  lastReminderSentAt?: string;
}

export interface SmsDispatchResult {
  messageSid: string;
  bookingId: string;
  residentName: string;
  recipientPhone: string;
  roomNumber: string;
  amountDue: number;
  message: string;
  characterCount: number;
  segmentCount: number;
  status: 'delivered' | 'failed' | 'queued';
  carrierCode: string;
  sentAt: string;
}

export interface BulkSmsReport {
  batchId: string;
  pgId: string;
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  totalAmountReminded: number;
  totalSegmentsUsed: number;
  dispatchedAt: string;
  results: SmsDispatchResult[];
}

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'wifi'
  | 'carpentry'
  | 'cleaning'
  | 'appliance'
  | 'pest_control'
  | 'other';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MaintenanceStatus = 'pending' | 'in-progress' | 'resolved';

export interface MaintenanceRequest {
  id: string;
  pgId: string;
  pgName: string;
  bookingId?: string;
  residentName: string;
  residentPhone: string;
  roomNumber: string;
  bedLabel?: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  assignedStaff?: string;
  resolutionNotes?: string;
}


