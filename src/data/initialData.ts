import {
  PGProperty,
  Floor,
  Room,
  Bed,
  Booking,
  PaymentTransaction,
  ReminderNotification,
  UserAccount,
  MaintenanceRequest
} from '../types/pg';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin_vali',
    name: 'Vali Botla',
    email: 'valibotlavali@gmail.com',
    phone: '+91 98765 43210',
    role: 'admin',
    pgIds: ['pg_sv_gents', 'pg_lakshmi_luxury'],
    businessName: 'PG Builder Admin'
  },
  {
    id: 'usr_owner_rajesh',
    name: 'Rajesh Kumar',
    email: 'rajesh.svpg@gmail.com',
    phone: '+91 98450 12345',
    role: 'owner',
    pgIds: ['pg_sv_gents'],
    businessName: 'SV Hostels Group'
  },
  {
    id: 'usr_owner_pooja',
    name: 'Pooja Hegde',
    email: 'pooja.coliving@gmail.com',
    phone: '+91 98450 67890',
    role: 'owner',
    pgIds: ['pg_lakshmi_luxury'],
    businessName: 'Sri Lakshmi Stays'
  },
  {
    id: 'usr_cust_karthik',
    name: 'Karthik Reddy',
    email: 'karthik.reddy@gmail.com',
    phone: '+91 99887 76655',
    role: 'customer',
    pgIds: ['pg_sv_gents']
  }
];

export const INITIAL_USER: UserAccount = INITIAL_USERS[0]; // Lead Admin default

export const INITIAL_PROPERTIES: PGProperty[] = [
  {
    id: 'pg_sv_gents',
    ownerId: 'usr_owner_rajesh',
    name: 'SV PG for Gents',
    slug: 'sv-pg-for-gents',
    tagline: 'Premium Co-Living & Luxury Gents PG with 3-Time Homely Food',
    description: 'Welcome to SV PG for Gents, your home away from home in Electronics City Phase 1. Designed specifically for working IT professionals and students, offering spacious sanitized rooms, high-speed 300 Mbps Wi-Fi, delicious South & North Indian meals 3 times a day, automatic laundry, 24/7 power backup, and biometric security.',
    genderType: 'gents',
    address: '#42, 3rd Cross, Neeladri Nagar, Electronics City Phase 1',
    landmark: 'Opposite Wipro Gate 5, near Infosys Campus',
    city: 'Bengaluru',
    area: 'Electronics City Phase 1',
    pincode: '560100',
    contactPhone: '+91 98450 12345',
    contactEmail: 'contact@svpg-hostel.in',
    whatsappNumber: '+919845012345',
    upiId: 'svhostel@okaxis',
    status: 'published',
    publishedAt: '2026-01-15T09:00:00Z',
    photos: {
      hero: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
      room: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
      dining: '/src/assets/images/pg_dining_food_1793280465155.jpg',
      lounge: '/src/assets/images/pg_common_lounge_1793280465671.jpg',
      exterior: '/src/assets/images/pg_building_exterior_1793280465357.jpg'
    },
    facilities: [
      'High-Speed 300 Mbps Wi-Fi (Dual Band)',
      '3 Times Unlimited South & North Indian Food',
      'Daily Room & Restroom Housekeeping',
      'Fully Automatic Washing Machines',
      '24/7 Hot Water (Solar + Geyser Backup)',
      '24/7 Power Backup (100% DG Set)',
      'CCTV Surveillance & Biometric Access',
      'RO Purified Mineral Drinking Water',
      'Attached Washrooms with Branded Fittings',
      'Individual Cupboards with Lock & Key',
      'Spacious 2-Wheeler & Car Parking',
      'Rooftop Dining & Recreation Lounge'
    ],
    pricing: {
      '1-sharing': {
        monthlyRent: 12500,
        advanceDeposit: 10000,
        available: true,
        acAvailable: true,
        acExtraMonthly: 2000,
        features: ['Private single room', 'Personal study desk', 'Attached western bath', 'High-speed LAN & WiFi']
      },
      '2-sharing': {
        monthlyRent: 8500,
        advanceDeposit: 8000,
        available: true,
        acAvailable: true,
        acExtraMonthly: 1500,
        features: ['Spacious 2-bed room', 'Dual wardrobes', 'Attached balcony', 'Daily cleaning']
      },
      '3-sharing': {
        monthlyRent: 7000,
        advanceDeposit: 6000,
        available: true,
        acAvailable: false,
        acExtraMonthly: 0,
        features: ['Cozy 3-sharing room', 'Individual lockers', 'Hot water 24/7', 'Homely buffet food']
      },
      '4-sharing': {
        monthlyRent: 6000,
        advanceDeposit: 5000,
        available: false,
        acAvailable: false,
        acExtraMonthly: 0,
        features: ['Budget friendly', 'Spacious layout', 'All meals included', 'Washing machine access']
      }
    },
    mealPlan: [
      { day: 'Monday', breakfast: 'Idli, Vada, Sambar & Coconut Chutney + Tea/Coffee', lunch: 'Rice, Dal Tadka, Seasonal Veg Curry, Curd & Papad', dinner: 'Phulka Roti, Paneer Butter Masala, Jeera Rice & Dal Fry' },
      { day: 'Tuesday', breakfast: 'Masala Dosa, Aloo Bhaji, Chutney + Tea/Coffee', lunch: 'Rice, Sambar, Aloo Gobi Fry, Rasam & Curd', dinner: 'Chapati, Egg Curry / Veg Korma, Steamed Rice & Dal' },
      { day: 'Wednesday', breakfast: 'Puri Bhaji / Upma with Chutney + Tea/Coffee', lunch: 'Rice, Dal Makhani, Bhindi Masala, Curd & Pickle', dinner: 'Chicken Biryani / Special Paneer Biryani, Mirchi Ka Salan, Raita' },
      { day: 'Thursday', breakfast: 'Set Dosa with Vegetable Saagu + Tea/Coffee', lunch: 'Rice, Tomato Dal, Beans Poriyal, Rasam & Buttermilk', dinner: 'Tandoori Roti, Rajma Masala, Steamed Rice & Gulab Jamun' },
      { day: 'Friday', breakfast: 'Poha & Sev / Medu Vada with Sambar + Tea/Coffee', lunch: 'Rice, Dal Palak, Paneer Bhurji, Curd & Papad', dinner: 'Chapati, Veg Kadai / Chicken Curry, Fried Rice & Dal' },
      { day: 'Saturday', breakfast: 'Uttapam with Onion & Tomato + Tea/Coffee', lunch: 'Lemon Rice / Veg Pulao, Curd Rice & Potato Chips', dinner: 'Poori, Chana Masala, Steamed Rice, Rasam & Sweet Kheer' },
      { day: 'Sunday', breakfast: 'Mysore Masala Dosa / Bread Omelette + Tea/Coffee', lunch: 'Sunday Special Chicken Biryani / Paneer Biryani Feast + Ice Cream', dinner: 'Light Khichdi / Roti with Dal Tadka & Aloo Jeera' }
    ],
    houseRules: [
      'Gate Closing Time: 10:30 PM (Inform warden in advance for late office shifts)',
      'Strictly No Smoking, Alcohol or illegal substances allowed inside hostel premises',
      '30 Days prior notice required before vacating to refund security deposit',
      'Maintain quiet hours after 11:00 PM in corridors and room wings',
      'Outside visitors/day guests allowed in reception lounge only between 9 AM to 7 PM',
      'Electricity bill split proportionally for rooms with individual AC sub-meters'
    ],
    noticePeriodDays: 30,
    gateClosingTime: '10:30 PM'
  },
  {
    id: 'pg_lakshmi_luxury',
    ownerId: 'usr_lead_vali',
    name: 'Sri Lakshmi Luxury Co-Living',
    slug: 'sri-lakshmi-luxury',
    tagline: 'Modern Unisex Co-Living Suites with Gym, Coworking & Rooftop Cafe',
    description: 'Experience upscale co-living near Whitefield Tech Park. Premium air-conditioned rooms, ergonomic workstations, high-speed fiber internet, housekeeping, healthy gourmet meals, and round-the-clock security.',
    genderType: 'coliving',
    address: '#112, ITPL Main Road, Hope Farm Junction',
    landmark: 'Behind Ascendas Park Square Mall',
    city: 'Bengaluru',
    area: 'Whitefield',
    pincode: '560066',
    contactPhone: '+91 98450 67890',
    contactEmail: 'stay@srilakshmicoliving.com',
    whatsappNumber: '+919845067890',
    upiId: 'srilakshmi@icici',
    status: 'published',
    publishedAt: '2026-02-01T10:00:00Z',
    photos: {
      hero: '/src/assets/images/pg_common_lounge_1793280465671.jpg',
      room: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
      dining: '/src/assets/images/pg_dining_food_1793280465155.jpg',
      lounge: '/src/assets/images/pg_common_lounge_1793280465671.jpg',
      exterior: '/src/assets/images/pg_building_exterior_1793280465357.jpg'
    },
    facilities: [
      'High-Speed 500 Mbps Wi-Fi & Work Desks',
      'Chef-Prepared Breakfast & Dinner Buffet',
      'Rooftop Fitness Gym & Yoga Deck',
      'Automatic Washing Machines & Dryers',
      '24/7 Power Backup with Dual Generator',
      'Electronic Keycard Lock on Every Room',
      'RO Water Dispensers on Every Floor',
      'Underground Car & Bike Parking'
    ],
    pricing: {
      '1-sharing': {
        monthlyRent: 15000,
        advanceDeposit: 15000,
        available: true,
        acAvailable: true,
        acExtraMonthly: 2500,
        features: ['Executive Studio', 'Queen Bed', '43-inch Smart TV', 'Ergonomic Chair']
      },
      '2-sharing': {
        monthlyRent: 9500,
        advanceDeposit: 10000,
        available: true,
        acAvailable: true,
        acExtraMonthly: 1500,
        features: ['Deluxe Twin Sharing', 'Balcony Access', 'Private Wardrobes', 'Daily Cleaning']
      },
      '3-sharing': {
        monthlyRent: 8000,
        advanceDeposit: 8000,
        available: true,
        acAvailable: false,
        acExtraMonthly: 0,
        features: ['Comfort Trio', 'Attached Bathroom', 'All Meals Included', 'Gym Access']
      },
      '4-sharing': {
        monthlyRent: 6500,
        advanceDeposit: 6000,
        available: false,
        acAvailable: false,
        acExtraMonthly: 0,
        features: ['Standard Shared', 'Lockers', 'Hot Water', 'WiFi Included']
      }
    },
    mealPlan: [
      { day: 'Monday to Sunday', breakfast: 'Gourmet Healthy Breakfast Buffet', lunch: 'Lunch Packed on Demand', dinner: 'Multi-Cuisine Dinner Buffet' }
    ],
    houseRules: [
      'Keycard access 24/7 with zero gate curfew for residents',
      'Maintain decorum and zero noise in corridors after midnight',
      'Visitors permitted in community lounge and rooftop cafe until 10 PM'
    ],
    noticePeriodDays: 30,
    gateClosingTime: '24/7 Open (Keycard)'
  }
];

export const INITIAL_FLOORS: Floor[] = [
  { id: 'flr_sv_1', pgId: 'pg_sv_gents', floorNumber: 1, name: 'Ground Floor' },
  { id: 'flr_sv_2', pgId: 'pg_sv_gents', floorNumber: 2, name: '1st Floor' },
  { id: 'flr_sv_3', pgId: 'pg_sv_gents', floorNumber: 3, name: '2nd Floor' }
];

export const INITIAL_ROOMS: Room[] = [
  // Ground Floor
  { id: 'rm_sv_101', pgId: 'pg_sv_gents', floorId: 'flr_sv_1', roomNumber: '101', sharingType: '2-sharing', isAC: false, hasAttachedBathroom: true, status: 'active' },
  { id: 'rm_sv_102', pgId: 'pg_sv_gents', floorId: 'flr_sv_1', roomNumber: '102', sharingType: '1-sharing', isAC: true, hasAttachedBathroom: true, status: 'active' },
  { id: 'rm_sv_103', pgId: 'pg_sv_gents', floorId: 'flr_sv_1', roomNumber: '103', sharingType: '3-sharing', isAC: false, hasAttachedBathroom: true, status: 'active' },

  // 1st Floor
  { id: 'rm_sv_201', pgId: 'pg_sv_gents', floorId: 'flr_sv_2', roomNumber: '201', sharingType: '2-sharing', isAC: true, hasAttachedBathroom: true, status: 'active' },
  { id: 'rm_sv_202', pgId: 'pg_sv_gents', floorId: 'flr_sv_2', roomNumber: '202', sharingType: '2-sharing', isAC: false, hasAttachedBathroom: true, status: 'active' },
  { id: 'rm_sv_203', pgId: 'pg_sv_gents', floorId: 'flr_sv_2', roomNumber: '203', sharingType: '3-sharing', isAC: false, hasAttachedBathroom: true, status: 'active' },

  // 2nd Floor
  { id: 'rm_sv_301', pgId: 'pg_sv_gents', floorId: 'flr_sv_3', roomNumber: '301', sharingType: '1-sharing', isAC: true, hasAttachedBathroom: true, status: 'active' },
  { id: 'rm_sv_302', pgId: 'pg_sv_gents', floorId: 'flr_sv_3', roomNumber: '302', sharingType: '2-sharing', isAC: false, hasAttachedBathroom: true, status: 'active' }
];

export const INITIAL_BEDS: Bed[] = [
  // Room 101 (2-sharing)
  { id: 'bed_101_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_101', floorId: 'flr_sv_1', bedLabel: 'Bed A', status: 'occupied', currentTenantName: 'Karthik Reddy', currentTenantPhone: '+91 99887 76655', currentBookingId: 'bk_sv_001' },
  { id: 'bed_101_b', pgId: 'pg_sv_gents', roomId: 'rm_sv_101', floorId: 'flr_sv_1', bedLabel: 'Bed B', status: 'available' },

  // Room 102 (1-sharing)
  { id: 'bed_102_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_102', floorId: 'flr_sv_1', bedLabel: 'Bed A (Single)', status: 'occupied', currentTenantName: 'Rohan Sharma', currentTenantPhone: '+91 98711 22334', currentBookingId: 'bk_sv_002' },

  // Room 103 (3-sharing)
  { id: 'bed_103_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_103', floorId: 'flr_sv_1', bedLabel: 'Bed A', status: 'occupied', currentTenantName: 'Suresh Kumar', currentTenantPhone: '+91 97400 11223', currentBookingId: 'bk_sv_003' },
  { id: 'bed_103_b', pgId: 'pg_sv_gents', roomId: 'rm_sv_103', floorId: 'flr_sv_1', bedLabel: 'Bed B', status: 'available' },
  { id: 'bed_103_c', pgId: 'pg_sv_gents', roomId: 'rm_sv_103', floorId: 'flr_sv_1', bedLabel: 'Bed C', status: 'held', holdExpiresAt: Date.now() + 3600000 },

  // Room 201 (2-sharing AC)
  { id: 'bed_201_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_201', floorId: 'flr_sv_2', bedLabel: 'Bed A', status: 'occupied', currentTenantName: 'Naveen Teja', currentTenantPhone: '+91 96112 33445', currentBookingId: 'bk_sv_004' },
  { id: 'bed_201_b', pgId: 'pg_sv_gents', roomId: 'rm_sv_201', floorId: 'flr_sv_2', bedLabel: 'Bed B', status: 'available' },

  // Room 202 (2-sharing)
  { id: 'bed_202_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_202', floorId: 'flr_sv_2', bedLabel: 'Bed A', status: 'available' },
  { id: 'bed_202_b', pgId: 'pg_sv_gents', roomId: 'rm_sv_202', floorId: 'flr_sv_2', bedLabel: 'Bed B', status: 'available' },

  // Room 203 (3-sharing)
  { id: 'bed_203_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_203', floorId: 'flr_sv_2', bedLabel: 'Bed A', status: 'occupied', currentTenantName: 'Vikram Joshi', currentTenantPhone: '+91 95221 44556', currentBookingId: 'bk_sv_005' },
  { id: 'bed_203_b', pgId: 'pg_sv_gents', roomId: 'rm_sv_203', floorId: 'flr_sv_2', bedLabel: 'Bed B', status: 'available' },
  { id: 'bed_203_c', pgId: 'pg_sv_gents', roomId: 'rm_sv_203', floorId: 'flr_sv_2', bedLabel: 'Bed C', status: 'available' },

  // Room 301 (1-sharing AC)
  { id: 'bed_301_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_301', floorId: 'flr_sv_3', bedLabel: 'Bed A (Single AC)', status: 'available' },

  // Room 302 (2-sharing)
  { id: 'bed_302_a', pgId: 'pg_sv_gents', roomId: 'rm_sv_302', floorId: 'flr_sv_3', bedLabel: 'Bed A', status: 'occupied', currentTenantName: 'Abhishek Roy', currentTenantPhone: '+91 94331 55667', currentBookingId: 'bk_sv_006' },
  { id: 'bed_302_b', pgId: 'pg_sv_gents', roomId: 'rm_sv_302', floorId: 'flr_sv_3', bedLabel: 'Bed B', status: 'maintenance' }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Karthik Reddy',
    customerPhone: '+91 99887 76655',
    customerEmail: 'karthik.reddy@gmail.com',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-4921',
    floorId: 'flr_sv_1',
    roomId: 'rm_sv_101',
    roomNumber: '101',
    bedId: 'bed_101_a',
    bedLabel: 'Bed A',
    sharingType: '2-sharing',
    isAC: false,
    moveInDate: '2026-02-01',
    durationMonths: 6,
    monthlyRent: 8500,
    advanceDeposit: 8000,
    totalPaid: 16500,
    status: 'checked-in',
    paymentStatus: 'succeeded',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-992100452',
    createdAt: '2026-01-20T10:15:00Z',
    notes: 'Working at Wipro Technologies. Verified Aadhaar and employment ID.'
  },
  {
    id: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Rohan Sharma',
    customerPhone: '+91 98711 22334',
    customerEmail: 'rohan.sharma.dev@gmail.com',
    idProofType: 'PAN',
    idProofNumber: 'ABCPS8912K',
    floorId: 'flr_sv_1',
    roomId: 'rm_sv_102',
    roomNumber: '102',
    bedId: 'bed_102_a',
    bedLabel: 'Bed A (Single)',
    sharingType: '1-sharing',
    isAC: true,
    moveInDate: '2026-02-10',
    durationMonths: 12,
    monthlyRent: 14500,
    advanceDeposit: 10000,
    totalPaid: 24500,
    status: 'checked-in',
    paymentStatus: 'succeeded',
    paymentMode: 'bank_transfer',
    transactionReference: 'NEFT-HDFC-8839211',
    createdAt: '2026-01-25T14:30:00Z',
    notes: 'Software Engineer at Infosys. Single AC room.'
  },
  {
    id: 'bk_sv_003',
    bookingReference: 'SVPG-2026-8943',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Naveen Teja',
    customerPhone: '+91 96112 33445',
    customerEmail: 'naveen.teja@techcorp.in',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-6712',
    floorId: 'flr_sv_2',
    roomId: 'rm_sv_201',
    roomNumber: '201',
    bedId: 'bed_201_a',
    bedLabel: 'Bed A',
    sharingType: '2-sharing',
    isAC: true,
    moveInDate: '2026-03-01',
    durationMonths: 6,
    monthlyRent: 9500,
    advanceDeposit: 9500,
    totalPaid: 9500,
    status: 'checked-in',
    paymentStatus: 'pending',
    paymentMode: 'upi',
    createdAt: '2026-02-20T11:00:00Z',
    notes: 'Room 201 AC. October rent pending payment.'
  },
  {
    id: 'bk_sv_004',
    bookingReference: 'SVPG-2026-8944',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Vikram Seth',
    customerPhone: '+91 97401 88990',
    customerEmail: 'vikram.seth91@gmail.com',
    idProofType: 'PAN',
    idProofNumber: 'BKLPS2291Q',
    floorId: 'flr_sv_2',
    roomId: 'rm_sv_202',
    roomNumber: '202',
    bedId: 'bed_202_a',
    bedLabel: 'Bed A',
    sharingType: '2-sharing',
    isAC: false,
    moveInDate: '2026-03-15',
    durationMonths: 12,
    monthlyRent: 8500,
    advanceDeposit: 8500,
    totalPaid: 8500,
    status: 'checked-in',
    paymentStatus: 'pending',
    paymentMode: 'upi',
    createdAt: '2026-03-05T09:30:00Z',
    notes: 'Room 202 Bed A. Rent overdue by 5 days.'
  },
  {
    id: 'bk_sv_005',
    bookingReference: 'SVPG-2026-8945',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Suresh Nair',
    customerPhone: '+91 98860 44556',
    customerEmail: 'suresh.nair@accenture.com',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-3341',
    floorId: 'flr_sv_2',
    roomId: 'rm_sv_203',
    roomNumber: '203',
    bedId: 'bed_203_a',
    bedLabel: 'Bed A',
    sharingType: '3-sharing',
    isAC: false,
    moveInDate: '2026-04-01',
    durationMonths: 6,
    monthlyRent: 7500,
    advanceDeposit: 7500,
    totalPaid: 7500,
    status: 'checked-in',
    paymentStatus: 'pending',
    paymentMode: 'upi',
    createdAt: '2026-03-25T16:15:00Z',
    notes: 'Room 203 Bed A. Rent overdue by 3 days.'
  },
  {
    id: 'bk_sv_006',
    bookingReference: 'SVPG-2026-8946',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Abhishek Roy',
    customerPhone: '+91 94331 55667',
    customerEmail: 'abhishek.roy@cognizant.com',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-8820',
    floorId: 'flr_sv_3',
    roomId: 'rm_sv_302',
    roomNumber: '302',
    bedId: 'bed_302_a',
    bedLabel: 'Bed A',
    sharingType: '2-sharing',
    isAC: false,
    moveInDate: '2026-04-10',
    durationMonths: 6,
    monthlyRent: 8500,
    advanceDeposit: 8500,
    totalPaid: 8500,
    status: 'checked-in',
    paymentStatus: 'pending',
    paymentMode: 'cash',
    createdAt: '2026-04-02T12:00:00Z',
    notes: 'Room 302 Bed A. Rent overdue by 8 days.'
  },
  {
    id: 'bk_sv_007_pending',
    bookingReference: 'SVPG-2026-9105',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    customerName: 'Aditya Varma',
    customerPhone: '+91 98480 33221',
    customerEmail: 'aditya.varma@outlook.com',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-9014',
    floorId: 'flr_sv_2',
    roomId: 'rm_sv_201',
    roomNumber: '201',
    bedId: 'bed_201_b',
    bedLabel: 'Bed B',
    sharingType: '2-sharing',
    isAC: true,
    moveInDate: '2026-11-05',
    durationMonths: 6,
    monthlyRent: 10000,
    advanceDeposit: 8000,
    totalPaid: 8000,
    status: 'requested',
    paymentStatus: 'succeeded',
    paymentMode: 'upi',
    transactionReference: 'UPI-GPAY-77281034',
    createdAt: '2026-10-28T18:20:00Z',
    notes: 'Submitted online booking with ₹8,000 token advance. Pending owner confirmation.'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  // May 2026
  {
    id: 'pay_hist_05_1',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    payerName: 'Karthik Reddy',
    payerPhone: '+91 99887 76655',
    amount: 17000,
    paymentType: 'advance',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-552109',
    status: 'succeeded',
    recordedAt: '2026-05-02T10:00:00Z',
    receiptNumber: 'RCP-2026-05-01'
  },
  {
    id: 'pay_hist_05_2',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    payerName: 'Rohan Sharma',
    payerPhone: '+91 98711 22334',
    amount: 28000,
    paymentType: 'monthly_rent',
    paymentMode: 'bank_transfer',
    transactionReference: 'NEFT-05-9921',
    status: 'succeeded',
    recordedAt: '2026-05-05T14:00:00Z',
    receiptNumber: 'RCP-2026-05-02'
  },
  // June 2026
  {
    id: 'pay_hist_06_1',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    payerName: 'Karthik Reddy',
    payerPhone: '+91 99887 76655',
    amount: 25500,
    paymentType: 'monthly_rent',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-662109',
    status: 'succeeded',
    recordedAt: '2026-06-03T11:00:00Z',
    receiptNumber: 'RCP-2026-06-01'
  },
  {
    id: 'pay_hist_06_2',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    payerName: 'Naveen Teja',
    payerPhone: '+91 96112 33445',
    amount: 32500,
    paymentType: 'advance',
    paymentMode: 'upi',
    transactionReference: 'UPI-GPAY-6631',
    status: 'succeeded',
    recordedAt: '2026-06-08T15:00:00Z',
    receiptNumber: 'RCP-2026-06-02'
  },
  // July 2026
  {
    id: 'pay_hist_07_1',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    payerName: 'Suresh Kumar',
    payerPhone: '+91 97400 11223',
    amount: 34000,
    paymentType: 'monthly_rent',
    paymentMode: 'cash',
    transactionReference: 'CASH-07-001',
    status: 'succeeded',
    recordedAt: '2026-07-02T16:00:00Z',
    receiptNumber: 'RCP-2026-07-01'
  },
  {
    id: 'pay_hist_07_2',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    payerName: 'Rohan Sharma',
    payerPhone: '+91 98711 22334',
    amount: 38500,
    paymentType: 'monthly_rent',
    paymentMode: 'upi',
    transactionReference: 'UPI-PAYTM-7712',
    status: 'succeeded',
    recordedAt: '2026-07-05T12:00:00Z',
    receiptNumber: 'RCP-2026-07-02'
  },
  // August 2026
  {
    id: 'pay_hist_08_1',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    payerName: 'Karthik Reddy',
    payerPhone: '+91 99887 76655',
    amount: 35000,
    paymentType: 'monthly_rent',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-8812',
    status: 'succeeded',
    recordedAt: '2026-08-03T09:30:00Z',
    receiptNumber: 'RCP-2026-08-01'
  },
  {
    id: 'pay_hist_08_2',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    payerName: 'Vikram Joshi',
    payerPhone: '+91 95221 44556',
    amount: 33000,
    paymentType: 'advance',
    paymentMode: 'bank_transfer',
    transactionReference: 'NEFT-08-4421',
    status: 'succeeded',
    recordedAt: '2026-08-07T14:30:00Z',
    receiptNumber: 'RCP-2026-08-02'
  },
  // September 2026
  {
    id: 'pay_hist_09_1',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    payerName: 'Karthik Reddy',
    payerPhone: '+91 99887 76655',
    amount: 42500,
    paymentType: 'monthly_rent',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-991201',
    status: 'succeeded',
    recordedAt: '2026-09-02T10:15:00Z',
    receiptNumber: 'RCP-2026-09-01'
  },
  {
    id: 'pay_hist_09_2',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    payerName: 'Abhishek Roy',
    payerPhone: '+91 94331 55667',
    amount: 42000,
    paymentType: 'monthly_rent',
    paymentMode: 'cash',
    transactionReference: 'CASH-09-002',
    status: 'succeeded',
    recordedAt: '2026-09-06T18:00:00Z',
    receiptNumber: 'RCP-2026-09-02'
  },
  // October 2026 (Current)
  {
    id: 'pay_sv_001',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_001',
    bookingReference: 'SVPG-2026-8941',
    payerName: 'Karthik Reddy',
    payerPhone: '+91 99887 76655',
    amount: 16500,
    paymentType: 'advance',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-992100452',
    status: 'succeeded',
    recordedAt: '2026-10-20T10:20:00Z',
    receiptNumber: 'RCP-SV-2026-001',
    notes: 'First month rent ₹8,500 + security deposit ₹8,000'
  },
  {
    id: 'pay_sv_002',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_002',
    bookingReference: 'SVPG-2026-8942',
    payerName: 'Rohan Sharma',
    payerPhone: '+91 98711 22334',
    amount: 24500,
    paymentType: 'monthly_rent',
    paymentMode: 'bank_transfer',
    transactionReference: 'NEFT-HDFC-8839211',
    status: 'succeeded',
    recordedAt: '2026-10-25T14:35:00Z',
    receiptNumber: 'RCP-SV-2026-002',
    notes: '1-Sharing AC advance & 1st month rent'
  },
  {
    id: 'pay_sv_003',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_007_pending',
    bookingReference: 'SVPG-2026-9105',
    payerName: 'Aditya Varma',
    payerPhone: '+91 98480 33221',
    amount: 8000,
    paymentType: 'advance',
    paymentMode: 'upi',
    transactionReference: 'UPI-GPAY-77281034',
    status: 'succeeded',
    recordedAt: '2026-10-28T18:25:00Z',
    receiptNumber: 'RCP-SV-2026-003',
    notes: 'Advance booking reservation deposit'
  },
  {
    id: 'pay_sv_004',
    pgId: 'pg_sv_gents',
    bookingId: 'bk_sv_004',
    bookingReference: 'SVPG-2026-8944',
    payerName: 'Naveen Teja',
    payerPhone: '+91 96112 33445',
    amount: 43000,
    paymentType: 'monthly_rent',
    paymentMode: 'upi',
    transactionReference: 'UPI-AXIS-10332',
    status: 'succeeded',
    recordedAt: '2026-10-29T04:10:00Z',
    receiptNumber: 'RCP-SV-2026-004',
    notes: 'October monthly rents collected'
  }
];


export const INITIAL_REMINDERS: ReminderNotification[] = [
  {
    id: 'rem_sv_001',
    pgId: 'pg_sv_gents',
    residentName: 'Karthik Reddy',
    residentPhone: '+91 99887 76655',
    residentEmail: 'karthik.reddy@gmail.com',
    channel: 'whatsapp',
    templateType: 'rent_due',
    title: 'Monthly Rent Reminder - November 2026',
    message: 'Dear Karthik, friendly reminder that your monthly rent of ₹8,500 for Bed 101-A at SV PG for Gents is due on 1st Nov. Kindly pay via UPI to svhostel@okaxis. Thank you!',
    status: 'delivered',
    sentAt: '2026-10-28T09:00:00Z'
  },
  {
    id: 'rem_sv_002',
    pgId: 'pg_sv_gents',
    residentName: 'Aditya Varma',
    residentPhone: '+91 98480 33221',
    residentEmail: 'aditya.varma@outlook.com',
    channel: 'sms',
    templateType: 'booking_confirmation',
    title: 'Booking Request Received - SV PG for Gents',
    message: 'Hello Aditya, your booking request SVPG-2026-9105 for Bed 201-B has been received. Token advance ₹8,000 verified. Warden will contact you shortly.',
    status: 'delivered',
    sentAt: '2026-10-28T18:26:00Z'
  }
];

export const INITIAL_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'mnt_001',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    bookingId: 'bk_sv_001',
    residentName: 'Karthik Reddy',
    residentPhone: '+91 99887 76655',
    roomNumber: '101',
    bedLabel: 'Bed A',
    category: 'wifi',
    title: 'Wi-Fi disconnects intermittently in Room 101 corner',
    description: 'The 5GHz signal drops every 30 minutes during evening peak hours. Please reboot or check the 1st floor repeater.',
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2026-10-28T11:20:00Z',
    updatedAt: '2026-10-28T14:00:00Z',
    assignedStaff: 'Raju (Network Tech)',
    resolutionNotes: 'Mesh node repositioned, firmware updated. Monitoring stability.'
  },
  {
    id: 'mnt_002',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    bookingId: 'bk_sv_002',
    residentName: 'Suresh Babu',
    residentPhone: '+91 98451 22334',
    roomNumber: '101',
    bedLabel: 'Bed B',
    category: 'plumbing',
    title: 'Bathroom washbasin tap dripping water',
    description: 'Cold water tap washer seems loose and drips continuously overnight.',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-10-29T06:15:00Z',
    assignedStaff: 'Unassigned'
  },
  {
    id: 'mnt_003',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    bookingId: 'bk_sv_003',
    residentName: 'Rahul Sharma',
    residentPhone: '+91 98765 11223',
    roomNumber: '201',
    bedLabel: 'Bed A',
    category: 'electrical',
    title: 'Study lamp wall socket switch loose',
    description: 'Switch sparked slightly when plugging in laptop charger. Needs electrician inspection.',
    priority: 'urgent',
    status: 'in-progress',
    createdAt: '2026-10-28T19:40:00Z',
    updatedAt: '2026-10-29T08:00:00Z',
    assignedStaff: 'Manju (Electrician)',
    resolutionNotes: 'Power turned off for that specific socket box. Replacement socket ordered.'
  },
  {
    id: 'mnt_004',
    pgId: 'pg_sv_gents',
    pgName: 'SV PG for Gents',
    residentName: 'Kiran Rao',
    residentPhone: '+91 91234 56789',
    roomNumber: '301',
    bedLabel: 'Bed A',
    category: 'cleaning',
    title: 'Balcony floor deep scrubbing requested',
    description: 'Balcony floor has dust accumulated after recent rainfall.',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-10-27T10:00:00Z',
    resolvedAt: '2026-10-27T16:30:00Z',
    assignedStaff: 'Ramesh (Housekeeping)',
    resolutionNotes: 'Balcony and drains thoroughly jet-cleaned and sanitized.'
  }
];

