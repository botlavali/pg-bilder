import {
  PGProperty,
  Floor,
  Room,
  Bed,
  Booking,
  PaymentTransaction,
  ReminderNotification,
  UserAccount,
  BedStatus,
  SharingType,
  PendingRentResident,
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus
} from '../types/pg';
import {
  INITIAL_USER,
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_FLOORS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_REMINDERS,
  INITIAL_MAINTENANCE_REQUESTS
} from '../data/initialData';

const KEYS = {
  USER: 'pgbuilder_user',
  USERS: 'pgbuilder_users',
  PROPERTIES: 'pgbuilder_properties',
  FLOORS: 'pgbuilder_floors',
  ROOMS: 'pgbuilder_rooms',
  BEDS: 'pgbuilder_beds',
  BOOKINGS: 'pgbuilder_bookings',
  PAYMENTS: 'pgbuilder_payments',
  REMINDERS: 'pgbuilder_reminders',
  MAINTENANCE: 'pgbuilder_maintenance',
  ACTIVE_PG_ID: 'pgbuilder_active_pg_id',
  OTPS: 'pgbuilder_otps'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export const storageService = {
  // User Management & Roles
  getAllUsers(): UserAccount[] {
    return getStored<UserAccount[]>(KEYS.USERS, INITIAL_USERS);
  },

  getUser(): UserAccount {
    return getStored<UserAccount>(KEYS.USER, INITIAL_USER);
  },

  setUser(user: UserAccount): void {
    setStored(KEYS.USER, user);
    // Also sync in all users
    const allUsers = this.getAllUsers();
    const idx = allUsers.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      allUsers[idx] = user;
    } else {
      allUsers.push(user);
    }
    setStored(KEYS.USERS, allUsers);
  },

  registerUser(data: {
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'owner' | 'customer';
    businessName?: string;
    password?: string;
  }): UserAccount {
    const allUsers = this.getAllUsers();
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      businessName: data.businessName,
      password: data.password || 'password123',
      pgIds: []
    };
    allUsers.push(newUser);
    setStored(KEYS.USERS, allUsers);
    this.setUser(newUser);
    return newUser;
  },

  // Role-based Tenant Scoping
  getPropertiesForUser(user: UserAccount): PGProperty[] {
    const all = this.getAllProperties();
    if (user.role === 'admin') {
      // Admin sees ALL properties on the platform
      return all;
    }
    if (user.role === 'owner') {
      // Owner only sees their OWN properties!
      return all.filter(p => p.ownerId === user.id || (user.pgIds && user.pgIds.includes(p.id)));
    }
    // Customer sees all published properties
    return all.filter(p => p.status === 'published');
  },

  // Active PG Selection for Lead/Owner
  getActivePgId(): string {
    const properties = this.getAllProperties();
    const stored = getStored<string>(KEYS.ACTIVE_PG_ID, properties[0]?.id || 'pg_sv_gents');
    return properties.some(p => p.id === stored) ? stored : (properties[0]?.id || 'pg_sv_gents');
  },

  setActivePgId(pgId: string): void {
    setStored(KEYS.ACTIVE_PG_ID, pgId);
  },

  // Properties / Multi-Tenant PGs
  getAllProperties(): PGProperty[] {
    return getStored<PGProperty[]>(KEYS.PROPERTIES, INITIAL_PROPERTIES);
  },

  getPropertyById(id: string): PGProperty | undefined {
    return this.getAllProperties().find(p => p.id === id);
  },

  getPropertyBySlug(slug: string): PGProperty | undefined {
    return this.getAllProperties().find(p => p.slug.toLowerCase() === slug.toLowerCase());
  },

  saveProperty(property: PGProperty): void {
    const list = this.getAllProperties();
    const idx = list.findIndex(p => p.id === property.id);
    if (idx >= 0) {
      list[idx] = property;
    } else {
      list.push(property);
    }
    setStored(KEYS.PROPERTIES, list);
  },

  createProperty(data: {
    name: string;
    slug: string;
    tagline: string;
    description?: string;
    genderType: 'gents' | 'ladies' | 'coliving';
    address: string;
    area: string;
    city: string;
    pincode: string;
    contactPhone: string;
    contactEmail: string;
    whatsappNumber: string;
    upiId: string;
    startingRent: number;
    floorsCount: number;
    roomsPerFloor: number;
    facilities?: string[];
    houseRules?: string[];
    mealPlan?: any[];
    photos?: {
      hero: string;
      room: string;
      dining: string;
      lounge: string;
      exterior: string;
    };
  }): PGProperty {
    const id = `pg_${Date.now()}`;
    const user = this.getUser();

    // Default room pricing based on startingRent
    const monthlyRent = Number(data.startingRent) || 7500;
    const newProperty: PGProperty = {
      id,
      ownerId: user.id,
      name: data.name,
      slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      tagline: data.tagline || 'Modern & Comfortable Paying Guest Accommodation',
      description: data.description || `${data.name} offers clean rooms, hygienic food 3 times a day, high-speed WiFi, daily housekeeping, 24/7 hot water, and secure living in ${data.area}, ${data.city}.`,
      genderType: data.genderType,
      address: data.address,
      landmark: `Near ${data.area} main road`,
      city: data.city,
      area: data.area,
      pincode: data.pincode,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      whatsappNumber: data.whatsappNumber.replace(/[^0-9]/g, ''),
      upiId: data.upiId || 'hostel@upi',
      status: 'published',
      publishedAt: new Date().toISOString(),
      photos: data.photos || {
        hero: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
        room: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
        dining: '/src/assets/images/pg_dining_food_1793280465155.jpg',
        lounge: '/src/assets/images/pg_common_lounge_1793280465671.jpg',
        exterior: '/src/assets/images/pg_building_exterior_1793280465357.jpg'
      },
      facilities: data.facilities || [
        'High-Speed Wi-Fi',
        '3 Times Homely Food',
        'Daily Room Cleaning',
        'Automatic Washing Machines',
        '24/7 Hot Water',
        'Power Backup',
        'CCTV Surveillance',
        'RO Drinking Water',
        'Attached Bathrooms',
        'Two Wheeler Parking'
      ],
      pricing: {
        '1-sharing': {
          monthlyRent: Math.round(monthlyRent * 1.5),
          advanceDeposit: Math.round(monthlyRent * 1.5),
          available: true,
          acAvailable: true,
          acExtraMonthly: 2000,
          features: ['Private room', 'Personal desk', 'Attached bath']
        },
        '2-sharing': {
          monthlyRent: monthlyRent,
          advanceDeposit: monthlyRent,
          available: true,
          acAvailable: true,
          acExtraMonthly: 1500,
          features: ['Spacious 2-bed room', 'Dual wardrobes', 'Daily housekeeping']
        },
        '3-sharing': {
          monthlyRent: Math.round(monthlyRent * 0.8),
          advanceDeposit: Math.round(monthlyRent * 0.8),
          available: true,
          acAvailable: false,
          acExtraMonthly: 0,
          features: ['3-bed sharing', 'Lockers', 'All meals included']
        },
        '4-sharing': {
          monthlyRent: Math.round(monthlyRent * 0.65),
          advanceDeposit: Math.round(monthlyRent * 0.65),
          available: true,
          acAvailable: false,
          acExtraMonthly: 0,
          features: ['Economical sharing', 'RO water', 'WiFi']
        }
      },
      mealPlan: data.mealPlan || [
        { day: 'Monday to Sunday', breakfast: 'Idli, Dosa, Poha, Puri with Chutney/Sambar + Tea', lunch: 'Rice, Dal, Veg Curry, Rasam, Curd', dinner: 'Roti, Paneer/Veg Curry, Rice, Dal' }
      ],
      houseRules: data.houseRules || [
        'Gate Closing Time: 10:30 PM',
        'Strictly No Smoking or Alcohol inside premises',
        '30 days advance notice before vacating required for deposit refund',
        'Visitors allowed in common lobby area only'
      ],
      noticePeriodDays: 30,
      gateClosingTime: '10:30 PM'
    };

    this.saveProperty(newProperty);

    // Auto generate floors, rooms, and beds for this new property
    const floorsCount = Math.max(1, Math.min(6, data.floorsCount || 2));
    const roomsPerFloor = Math.max(1, Math.min(8, data.roomsPerFloor || 3));

    const allFloors = this.getAllFloors();
    const allRooms = this.getAllRooms();
    const allBeds = this.getAllBeds();

    for (let f = 1; f <= floorsCount; f++) {
      const floorId = `flr_${id}_${f}`;
      const floorName = f === 1 ? 'Ground Floor' : `${f - 1}${f === 2 ? 'st' : f === 3 ? 'nd' : f === 4 ? 'rd' : 'th'} Floor`;
      allFloors.push({ id: floorId, pgId: id, floorNumber: f, name: floorName });

      for (let r = 1; r <= roomsPerFloor; r++) {
        const roomNumber = `${f}0${r}`;
        const roomId = `rm_${id}_${roomNumber}`;
        const sharing: SharingType = r === 1 ? '1-sharing' : r === 2 ? '2-sharing' : '3-sharing';
        const bedCount = sharing === '1-sharing' ? 1 : sharing === '2-sharing' ? 2 : 3;

        allRooms.push({
          id: roomId,
          pgId: id,
          floorId,
          roomNumber,
          sharingType: sharing,
          isAC: r === 1,
          hasAttachedBathroom: true,
          status: 'active'
        });

        for (let b = 0; b < bedCount; b++) {
          const bedLabel = bedCount === 1 ? 'Bed A (Single)' : `Bed ${String.fromCharCode(65 + b)}`;
          allBeds.push({
            id: `bed_${roomId}_${b}`,
            pgId: id,
            roomId,
            floorId,
            bedLabel,
            status: 'available'
          });
        }
      }
    }

    setStored(KEYS.FLOORS, allFloors);
    setStored(KEYS.ROOMS, allRooms);
    setStored(KEYS.BEDS, allBeds);

    // Update user's pgIds
    user.pgIds = Array.from(new Set([...user.pgIds, id]));
    this.setUser(user);
    this.setActivePgId(id);

    return newProperty;
  },

  // Floors
  getAllFloors(): Floor[] {
    return getStored<Floor[]>(KEYS.FLOORS, INITIAL_FLOORS);
  },

  getFloorsByPgId(pgId: string): Floor[] {
    return this.getAllFloors().filter(f => f.pgId === pgId).sort((a, b) => a.floorNumber - b.floorNumber);
  },

  addFloor(pgId: string, name: string): Floor {
    const list = this.getAllFloors();
    const existing = list.filter(f => f.pgId === pgId);
    const floorNumber = existing.length + 1;
    const newFloor: Floor = {
      id: `flr_${pgId}_${Date.now()}`,
      pgId,
      floorNumber,
      name: name || `Floor ${floorNumber}`
    };
    list.push(newFloor);
    setStored(KEYS.FLOORS, list);
    return newFloor;
  },

  // Rooms
  getAllRooms(): Room[] {
    return getStored<Room[]>(KEYS.ROOMS, INITIAL_ROOMS);
  },

  getRoomsByPgId(pgId: string): Room[] {
    return this.getAllRooms().filter(r => r.pgId === pgId);
  },

  addRoom(pgId: string, floorId: string, roomNumber: string, sharingType: SharingType, isAC: boolean): Room {
    const list = this.getAllRooms();
    const roomId = `rm_${pgId}_${Date.now()}`;
    const newRoom: Room = {
      id: roomId,
      pgId,
      floorId,
      roomNumber,
      sharingType,
      isAC,
      hasAttachedBathroom: true,
      status: 'active'
    };
    list.push(newRoom);
    setStored(KEYS.ROOMS, list);

    // Add beds for this room
    const bedCount = sharingType === '1-sharing' ? 1 : sharingType === '2-sharing' ? 2 : sharingType === '3-sharing' ? 3 : 4;
    const allBeds = this.getAllBeds();
    for (let b = 0; b < bedCount; b++) {
      const label = bedCount === 1 ? 'Bed A (Single)' : `Bed ${String.fromCharCode(65 + b)}`;
      allBeds.push({
        id: `bed_${roomId}_${b}`,
        pgId,
        roomId,
        floorId,
        bedLabel: label,
        status: 'available'
      });
    }
    setStored(KEYS.BEDS, allBeds);

    return newRoom;
  },

  // Beds
  getAllBeds(): Bed[] {
    return getStored<Bed[]>(KEYS.BEDS, INITIAL_BEDS);
  },

  getBedsByPgId(pgId: string): Bed[] {
    return this.getAllBeds().filter(b => b.pgId === pgId);
  },

  updateBedStatus(bedId: string, status: BedStatus, tenantName?: string, tenantPhone?: string, bookingId?: string): void {
    const list = this.getAllBeds();
    const bed = list.find(b => b.id === bedId);
    if (bed) {
      bed.status = status;
      if (status === 'occupied') {
        bed.currentTenantName = tenantName;
        bed.currentTenantPhone = tenantPhone;
        bed.currentBookingId = bookingId;
      } else if (status === 'available') {
        bed.currentTenantName = undefined;
        bed.currentTenantPhone = undefined;
        bed.currentBookingId = undefined;
        bed.holdExpiresAt = undefined;
      }
      setStored(KEYS.BEDS, list);
    }
  },

  // Bookings
  getAllBookings(): Booking[] {
    return getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  getBookingsByPgId(pgId: string): Booking[] {
    return this.getAllBookings().filter(b => b.pgId === pgId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createBooking(data: {
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
    paymentMode: 'upi' | 'cash' | 'bank_transfer';
    transactionReference?: string;
    paidAmount?: number;
  }): Booking {
    const allBookings = this.getAllBookings();
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `SVPG-${new Date().getFullYear()}-${refNum}`;

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingReference: bookingRef,
      pgId: data.pgId,
      pgName: data.pgName,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      idProofType: data.idProofType,
      idProofNumber: data.idProofNumber,
      floorId: data.floorId,
      roomId: data.roomId,
      roomNumber: data.roomNumber,
      bedId: data.bedId,
      bedLabel: data.bedLabel,
      sharingType: data.sharingType,
      isAC: data.isAC,
      moveInDate: data.moveInDate,
      durationMonths: data.durationMonths,
      monthlyRent: data.monthlyRent,
      advanceDeposit: data.advanceDeposit,
      totalPaid: data.paidAmount ?? (data.paymentMode === 'upi' ? data.advanceDeposit : 0),
      status: 'requested',
      paymentStatus: (data.paidAmount ?? 0) > 0 ? 'succeeded' : 'pending',
      paymentMode: data.paymentMode,
      transactionReference: data.transactionReference,
      createdAt: new Date().toISOString(),
      notes: `Online booking request from ${data.customerName}. Move in: ${data.moveInDate}`
    };

    allBookings.unshift(newBooking);
    setStored(KEYS.BOOKINGS, allBookings);

    // Bed set to 'held' temporarily to prevent double booking!
    this.updateBedStatus(data.bedId, 'held', data.customerName, data.customerPhone, newBooking.id);

    // If payment recorded, also log payment transaction
    if ((data.paidAmount ?? 0) > 0) {
      this.recordPayment({
        pgId: data.pgId,
        bookingId: newBooking.id,
        bookingReference: newBooking.bookingReference,
        payerName: data.customerName,
        payerPhone: data.customerPhone,
        amount: data.paidAmount || data.advanceDeposit,
        paymentType: 'advance',
        paymentMode: data.paymentMode,
        transactionReference: data.transactionReference || `TXN-${Date.now().toString().slice(-6)}`,
        status: 'succeeded',
        notes: `Advance deposit payment for booking ${newBooking.bookingReference}`
      });
    }

    // Auto-create booking confirmation reminder notification
    this.sendReminder({
      pgId: data.pgId,
      residentName: data.customerName,
      residentPhone: data.customerPhone,
      residentEmail: data.customerEmail,
      channel: 'sms',
      templateType: 'booking_confirmation',
      title: `Booking Request Confirmed - ${data.pgName}`,
      message: `Dear ${data.customerName}, your booking ref ${newBooking.bookingReference} for ${data.roomNumber} (${data.bedLabel}) at ${data.pgName} is submitted! Move-in date: ${data.moveInDate}. Contact PG at ${data.customerPhone}.`
    });

    return newBooking;
  },

  approveBooking(bookingId: string): void {
    const list = this.getAllBookings();
    const booking = list.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'confirmed';
      setStored(KEYS.BOOKINGS, list);

      // Bed marked occupied
      this.updateBedStatus(booking.bedId, 'occupied', booking.customerName, booking.customerPhone, booking.id);

      // Send SMS/WhatsApp confirmation reminder
      this.sendReminder({
        pgId: booking.pgId,
        residentName: booking.customerName,
        residentPhone: booking.customerPhone,
        residentEmail: booking.customerEmail,
        channel: 'whatsapp',
        templateType: 'check_in_welcome',
        title: `Booking Approved! Welcome to ${booking.pgName}`,
        message: `Congratulations ${booking.customerName}! Your booking ${booking.bookingReference} for Room ${booking.roomNumber} (${booking.bedLabel}) has been approved by the PG owner. Please show this message upon arrival.`
      });
    }
  },

  checkInBooking(bookingId: string): void {
    const list = this.getAllBookings();
    const booking = list.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'checked-in';
      booking.checkInDate = new Date().toISOString();
      setStored(KEYS.BOOKINGS, list);
      this.updateBedStatus(booking.bedId, 'occupied', booking.customerName, booking.customerPhone, booking.id);

      // Send Welcome check-in message
      this.sendReminder({
        pgId: booking.pgId,
        residentName: booking.customerName,
        residentPhone: booking.customerPhone,
        residentEmail: booking.customerEmail,
        channel: 'whatsapp',
        templateType: 'check_in_welcome',
        title: `Check-in Complete - ${booking.pgName}`,
        message: `Welcome to ${booking.pgName}! You are successfully checked into Room ${booking.roomNumber} (${booking.bedLabel}). WiFi password: SVPG@Guest2026. Warden contact: +91 98450 12345.`
      });
    }
  },

  checkOutBooking(bookingId: string): void {
    const list = this.getAllBookings();
    const booking = list.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'checked-out';
      booking.checkOutDate = new Date().toISOString();
      booking.notes = (booking.notes || '') + ` (Checked out on ${new Date().toLocaleDateString('en-IN')})`;
      setStored(KEYS.BOOKINGS, list);

      // Release bed back to available!
      this.updateBedStatus(booking.bedId, 'available');

      // Send checkout / vacating settlement notice
      this.sendReminder({
        pgId: booking.pgId,
        residentName: booking.customerName,
        residentPhone: booking.customerPhone,
        residentEmail: booking.customerEmail,
        channel: 'sms',
        templateType: 'rules_notice',
        title: `Check-out Confirmation - ${booking.pgName}`,
        message: `Dear ${booking.customerName}, your check-out from Room ${booking.roomNumber} is complete. Security deposit refund settlement initiated. Thank you for staying with us!`
      });
    }
  },

  cancelBooking(bookingId: string, reason?: string): void {
    const list = this.getAllBookings();
    const booking = list.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.notes = (booking.notes || '') + ` (Cancelled: ${reason || 'User/Owner requested'})`;
      setStored(KEYS.BOOKINGS, list);
      this.updateBedStatus(booking.bedId, 'available');
    }
  },

  // Residents with Pending Rent Payments
  getPendingRentResidents(pgId: string): PendingRentResident[] {
    const allBookings = this.getBookingsByPgId(pgId);
    const checkedIn = allBookings.filter(b => b.status === 'checked-in');
    const allPayments = this.getPaymentsByPgId(pgId);
    const allReminders = this.getRemindersByPgId(pgId);

    const pendingList: PendingRentResident[] = [];

    for (const b of checkedIn) {
      const paymentsForBooking = allPayments.filter(
        p => p.bookingId === b.id && p.status === 'succeeded'
      );
      const lastPayment = paymentsForBooking[0];
      const lastReminder = allReminders.find(
        r => r.residentPhone === b.customerPhone || r.residentName === b.customerName
      );

      let daysOverdue = 0;
      if (b.notes?.includes('overdue by 8 days')) daysOverdue = 8;
      else if (b.notes?.includes('overdue by 5 days')) daysOverdue = 5;
      else if (b.notes?.includes('overdue by 3 days')) daysOverdue = 3;
      else if (b.notes?.includes('pending payment')) daysOverdue = 1;
      else if (b.paymentStatus === 'pending') daysOverdue = 4;
      else {
        daysOverdue = 0; // Upcoming / due 5th Nov
      }

      const dueStatus: 'overdue' | 'due_today' | 'upcoming' =
        daysOverdue > 0 ? 'overdue' : daysOverdue === 0 ? 'due_today' : 'upcoming';

      const dueDate = daysOverdue > 0 ? `${daysOverdue} days overdue (Due 5th Oct)` : '5th Nov 2026';

      pendingList.push({
        bookingId: b.id,
        bookingReference: b.bookingReference,
        pgId: b.pgId,
        residentName: b.customerName,
        residentPhone: b.customerPhone,
        residentEmail: b.customerEmail,
        roomNumber: b.roomNumber,
        bedLabel: b.bedLabel,
        sharingType: b.sharingType,
        monthlyRent: b.monthlyRent,
        amountDue: b.monthlyRent,
        dueDate,
        daysOverdue,
        dueStatus,
        lastPaymentDate: lastPayment ? lastPayment.recordedAt : undefined,
        lastReminderSentAt: lastReminder ? lastReminder.sentAt : undefined
      });
    }

    return pendingList.sort((a, b) => b.daysOverdue - a.daysOverdue || b.amountDue - a.amountDue);
  },

  // Recharts 6-Month Monthly Revenue Trend helper
  getMonthlyRevenueTrend(pgId: string) {
    const months = [
      { key: '2026-05', month: 'May', full: 'May 2026' },
      { key: '2026-06', month: 'Jun', full: 'June 2026' },
      { key: '2026-07', month: 'Jul', full: 'July 2026' },
      { key: '2026-08', month: 'Aug', full: 'August 2026' },
      { key: '2026-09', month: 'Sep', full: 'September 2026' },
      { key: '2026-10', month: 'Oct', full: 'October 2026' }
    ];

    const allPayments = this.getPaymentsByPgId(pgId).filter(p => p.status === 'succeeded');

    return months.map(m => {
      const monthPayments = allPayments.filter(p => p.recordedAt.startsWith(m.key));
      const rent = monthPayments
        .filter(p => p.paymentType === 'monthly_rent')
        .reduce((sum, p) => sum + p.amount, 0);
      const advance = monthPayments
        .filter(p => p.paymentType === 'advance' || p.paymentType === 'security_deposit')
        .reduce((sum, p) => sum + p.amount, 0);
      const total = rent + advance;

      return {
        month: m.month,
        fullMonth: m.full,
        rent,
        advance,
        total,
        transactions: monthPayments.length
      };
    });
  },

  // Payments
  getAllPayments(): PaymentTransaction[] {
    return getStored<PaymentTransaction[]>(KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  getPaymentsByPgId(pgId: string): PaymentTransaction[] {
    return this.getAllPayments().filter(p => p.pgId === pgId).sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  },

  recordPayment(data: {
    pgId: string;
    bookingId: string;
    bookingReference: string;
    payerName: string;
    payerPhone: string;
    amount: number;
    paymentType: 'advance' | 'monthly_rent' | 'security_deposit';
    paymentMode: 'upi' | 'cash' | 'bank_transfer';
    transactionReference: string;
    status: 'succeeded' | 'pending' | 'failed';
    notes?: string;
  }): PaymentTransaction {
    const list = this.getAllPayments();
    const rcpNum = Math.floor(100 + Math.random() * 900);
    const receiptNumber = `RCP-${new Date().getFullYear()}-${rcpNum}`;

    const newPayment: PaymentTransaction = {
      id: `pay_${Date.now()}`,
      pgId: data.pgId,
      bookingId: data.bookingId,
      bookingReference: data.bookingReference,
      payerName: data.payerName,
      payerPhone: data.payerPhone,
      amount: data.amount,
      paymentType: data.paymentType,
      paymentMode: data.paymentMode,
      transactionReference: data.transactionReference || `TXN-${Date.now()}`,
      status: data.status,
      recordedAt: new Date().toISOString(),
      receiptNumber,
      notes: data.notes
    };

    list.unshift(newPayment);
    setStored(KEYS.PAYMENTS, list);

    // Update booking paid total if succeeded
    if (data.status === 'succeeded') {
      const allBookings = this.getAllBookings();
      const b = allBookings.find(bk => bk.id === data.bookingId);
      if (b) {
        b.totalPaid = (b.totalPaid || 0) + data.amount;
        b.paymentStatus = 'succeeded';
        setStored(KEYS.BOOKINGS, allBookings);
      }
    }

    return newPayment;
  },

  // Reminders / Messages / Mails (User emphasis: "send remeinders mesages mails all i wnat")
  getAllReminders(): ReminderNotification[] {
    return getStored<ReminderNotification[]>(KEYS.REMINDERS, INITIAL_REMINDERS);
  },

  getRemindersByPgId(pgId: string): ReminderNotification[] {
    return this.getAllReminders().filter(r => r.pgId === pgId).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  },

  sendReminder(data: {
    pgId: string;
    residentName: string;
    residentPhone: string;
    residentEmail: string;
    channel: 'whatsapp' | 'sms' | 'email';
    templateType: 'rent_due' | 'booking_confirmation' | 'check_in_welcome' | 'payment_receipt' | 'rules_notice';
    title: string;
    message: string;
  }): ReminderNotification {
    const list = this.getAllReminders();
    const newReminder: ReminderNotification = {
      id: `rem_${Date.now()}`,
      pgId: data.pgId,
      residentName: data.residentName,
      residentPhone: data.residentPhone,
      residentEmail: data.residentEmail,
      channel: data.channel,
      templateType: data.templateType,
      title: data.title,
      message: data.message,
      status: 'delivered',
      sentAt: new Date().toISOString()
    };
    list.unshift(newReminder);
    setStored(KEYS.REMINDERS, list);
    return newReminder;
  },

  // OTP Simulation Engine
  generateOTP(phone: string): { code: string; expiresAt: number } {
    // Generate 4 digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
    const otps = getStored<Record<string, { code: string; expiresAt: number }>>(KEYS.OTPS, {});
    otps[phone] = { code, expiresAt };
    setStored(KEYS.OTPS, otps);
    return { code, expiresAt };
  },

  verifyOTP(phone: string, inputCode: string): boolean {
    const otps = getStored<Record<string, { code: string; expiresAt: number }>>(KEYS.OTPS, {});
    const entry = otps[phone];
    if (!entry) {
      // Allow testing fallback code '1234' for quick frictionless test
      return inputCode === '1234';
    }
    if (Date.now() > entry.expiresAt) return false;
    return entry.code === inputCode.trim() || inputCode === '1234';
  },

  // Maintenance Requests (User requirement: residents report issues & owners track pending, in-progress, resolved)
  getAllMaintenanceRequests(): MaintenanceRequest[] {
    return getStored<MaintenanceRequest[]>(KEYS.MAINTENANCE, INITIAL_MAINTENANCE_REQUESTS);
  },

  getMaintenanceRequestsByPgId(pgId: string): MaintenanceRequest[] {
    return this.getAllMaintenanceRequests()
      .filter(m => m.pgId === pgId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createMaintenanceRequest(data: {
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
  }): MaintenanceRequest {
    const list = this.getAllMaintenanceRequests();
    const newReq: MaintenanceRequest = {
      id: `mnt_${Date.now()}`,
      pgId: data.pgId,
      pgName: data.pgName,
      bookingId: data.bookingId,
      residentName: data.residentName,
      residentPhone: data.residentPhone,
      roomNumber: data.roomNumber,
      bedLabel: data.bedLabel,
      category: data.category,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      assignedStaff: 'Unassigned'
    };
    list.unshift(newReq);
    setStored(KEYS.MAINTENANCE, list);
    return newReq;
  },

  updateMaintenanceStatus(
    id: string,
    status: MaintenanceStatus,
    notes?: string,
    assignedStaff?: string
  ): MaintenanceRequest | undefined {
    const list = this.getAllMaintenanceRequests();
    const item = list.find(m => m.id === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      if (status === 'resolved') {
        item.resolvedAt = new Date().toISOString();
      }
      if (notes !== undefined) {
        item.resolutionNotes = notes;
      }
      if (assignedStaff !== undefined) {
        item.assignedStaff = assignedStaff;
      }
      setStored(KEYS.MAINTENANCE, list);
      return item;
    }
    return undefined;
  },

  // Resident Lookup
  lookupBookings(query: string): Booking[] {
    const clean = query.trim().toLowerCase();
    const all = this.getAllBookings();
    return all.filter(b =>
      b.customerPhone.includes(clean) ||
      b.bookingReference.toLowerCase().includes(clean) ||
      b.customerEmail.toLowerCase().includes(clean)
    );
  },

  // Reset to initial demo data
  resetDemoData(): void {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.PROPERTIES);
    localStorage.removeItem(KEYS.FLOORS);
    localStorage.removeItem(KEYS.ROOMS);
    localStorage.removeItem(KEYS.BEDS);
    localStorage.removeItem(KEYS.BOOKINGS);
    localStorage.removeItem(KEYS.PAYMENTS);
    localStorage.removeItem(KEYS.REMINDERS);
    localStorage.removeItem(KEYS.MAINTENANCE);
    localStorage.removeItem(KEYS.ACTIVE_PG_ID);
    localStorage.removeItem(KEYS.OTPS);
  }
};

