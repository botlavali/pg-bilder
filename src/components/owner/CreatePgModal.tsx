import React, { useState } from 'react';
import {
  X,
  Building2,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Coffee,
  Wifi,
  Users,
  Copy,
  ExternalLink,
  Laptop,
  HeartHandshake
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PGProperty } from '../../types/pg';

interface CreatePgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newProperty: PGProperty) => void;
}

interface TemplateOption {
  id: 'sv_classic_gents' | 'urban_coliving' | 'royal_ladies';
  name: string;
  category: 'gents' | 'ladies' | 'coliving';
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  defaultStartingRent: number;
  highlightBullets: string[];
  facilities: string[];
  houseRules: string[];
  accentColor: string;
  previewHero: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'sv_classic_gents',
    name: 'SV Classic Gents Executive PG',
    category: 'gents',
    badge: 'Classic Gents (Like SV-PG)',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    tagline: 'Premium Co-Living & Luxury Gents PG with 3-Time Homely Food & Biometric Access',
    description: 'Designed specifically for working IT professionals and students in tech corridors. Offers spacious sanitized rooms, 300 Mbps high-speed Wi-Fi, authentic South & North Indian meals 3 times a day, automatic laundry, 24/7 power backup, and biometric security.',
    defaultStartingRent: 7500,
    accentColor: 'indigo',
    previewHero: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
    highlightBullets: [
      '3-Times Homely South & North Food',
      'High-Speed 300 Mbps Fiber Wi-Fi',
      'Biometric Gate Entry & CCTV',
      'Daily Room Housekeeping'
    ],
    facilities: [
      'High-Speed 300 Mbps Wi-Fi',
      '3 Times Homely South & North Meals',
      'Daily Room Cleaning & Sanitation',
      'Automatic Washing Machines & Drying Area',
      '24/7 Hot Water (Solar + Geyser)',
      '100% Power Backup with Inverter',
      'CCTV Surveillance in all common areas',
      'Biometric Access Control System',
      'RO UV Mineral Drinking Water',
      'Attached Bathrooms in all rooms',
      'Two-Wheeler Covered Parking',
      'Individual Cupboards with Lock & Key'
    ],
    houseRules: [
      'Gate Closing Time: 10:30 PM (Biometric access post hours with prior notice)',
      'Strictly No Smoking, Alcohol or illegal substances inside premises',
      '30 days advance notice before vacating required for deposit refund',
      'Visitors allowed only in reception and lobby area until 8:00 PM',
      'Keep room clean and maintain noise decorum after 10:00 PM'
    ]
  },
  {
    id: 'urban_coliving',
    name: 'Metro Co-Living & Coworking Suites',
    category: 'coliving',
    badge: 'Modern Unisex Co-Living',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    tagline: 'Contemporary Unisex Co-Living with Ergonomic Workstations & Community Lounge',
    description: 'A vibrant co-living community for startup founders, remote engineers, and creative professionals. Features dedicated work pods, 500 Mbps redundant fiber internet, designer common lounge, modern pantry with microwave & refrigerator, and weekly networking events.',
    defaultStartingRent: 9500,
    accentColor: 'emerald',
    previewHero: '/src/assets/images/pg_common_lounge_1793280465671.jpg',
    highlightBullets: [
      'Dedicated Ergonomic Coworking Desks',
      '500 Mbps Dual-Band Redundant Internet',
      'Rooftop Cafe & Gaming Zone',
      'Smart Digital RFID Door Locks'
    ],
    facilities: [
      'Ultra-Fast 500 Mbps Redundant Wi-Fi',
      'Ergonomic Work Desks in every room',
      'Rooftop Cafe & Chill-Out Terrace Lounge',
      'Community Kitchenette (Microwave, Fridge, Coffee)',
      'Smart Digital Keycard & Pin Door Locks',
      'Daily Professional Housekeeping',
      'Modern Laundry Room with Dryers',
      '24/7 CCTV & Professional Security Guard',
      'Weekly Housekeeping Linen Exchange',
      'Gym & Fitness Studio Access'
    ],
    houseRules: [
      'Quiet Hours in sleeping pods: 11:00 PM - 7:00 AM',
      'Shared coworking area is available 24/7 for residents',
      'Strictly No Smoking or Vaping inside rooms',
      '30 days written vacating notice via Resident Portal',
      'Respect diversity and community co-living etiquette'
    ]
  },
  {
    id: 'royal_ladies',
    name: 'Royal Ladies & Executive Haven',
    category: 'ladies',
    badge: 'Premium Ladies Only',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    tagline: 'Ultra-Secure & Hygienic Luxury Ladies PG with 24/7 Resident Lady Warden',
    description: 'Premium, safe sanctuary for working women and female college students. Features 3-tier round-the-clock security, 24/7 resident lady warden, nutritious dietitian-approved meals, biometric gates, elevator, private balconies, and zero compromise on safety.',
    defaultStartingRent: 8500,
    accentColor: 'rose',
    previewHero: '/src/assets/images/pg_room_showcase_1793280463442.jpg',
    highlightBullets: [
      '3-Tier Security with 24/7 Lady Warden',
      'Nutritious Home-Cooked Food (3 Times)',
      'Biometric Turnstiles & Corridor CCTV',
      'Private Balcony & Attached Bath'
    ],
    facilities: [
      '3-Tier Security with 24/7 Lady Warden',
      'Biometric Gate Entry & CCTV Surveillance',
      '3 Times Nutritious & Hygienic Meals',
      'Daily Deep Cleaning & Waste Management',
      'High-Speed Wi-Fi across all floors',
      'Automatic Washing Machines',
      '24/7 Instant Hot Water & Power Backup',
      'Passenger Elevator to all floors',
      'Spacious Wardrobes with Dressing Mirror',
      'Safe Walking Distance to Tech Parks & Metro'
    ],
    houseRules: [
      'Gate Closing Time: 9:30 PM (Permission required for late night shifts)',
      'Male visitors strictly prohibited on residential floors',
      'Parents & female guardians permitted with prior intimation to Warden',
      '30 days advance notice before vacating required for deposit refund',
      'Strictly alcohol-free and tobacco-free environment'
    ]
  }
];

export const CreatePgModal: React.FC<CreatePgModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<'sv_classic_gents' | 'urban_coliving' | 'royal_ladies'>('sv_classic_gents');
  const [name, setName] = useState('Sri Venkateshwara Luxury PG');
  const [slug, setSlug] = useState('sv-luxury-pg');
  const [tagline, setTagline] = useState('Premium Co-Living & Luxury Gents PG with 3-Time Homely Food & Biometric Access');
  const [genderType, setGenderType] = useState<'gents' | 'ladies' | 'coliving'>('gents');
  const [address, setAddress] = useState('#88, 2nd Main Road, Electronic City Phase 1');
  const [area, setArea] = useState('Electronic City');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560100');
  const [contactPhone, setContactPhone] = useState('+91 98450 12345');
  const [contactEmail, setContactEmail] = useState('contact@svpg-hostel.in');
  const [whatsappNumber, setWhatsappNumber] = useState('9845012345');
  const [upiId, setUpiId] = useState('svhostel@okaxis');
  const [startingRent, setStartingRent] = useState(7500);
  const [floorsCount, setFloorsCount] = useState(3);
  const [roomsPerFloor, setRoomsPerFloor] = useState(3);
  const [error, setError] = useState('');

  // Generated Link state
  const [createdProperty, setCreatedProperty] = useState<PGProperty | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  const handleSelectTemplate = (template: TemplateOption) => {
    setSelectedTemplateId(template.id);
    setName(template.name);
    const newSlug = template.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(newSlug);
    setTagline(template.tagline);
    setGenderType(template.category);
    setStartingRent(template.defaultStartingRent);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('Please provide a property name and URL slug.');
      return;
    }

    const existing = storageService.getPropertyBySlug(slug);
    if (existing) {
      setError(`The URL slug "${slug}" is already in use by another property. Please choose a different name or suffix.`);
      return;
    }

    setError('');

    const newPg = storageService.createProperty({
      name,
      slug,
      tagline: tagline || currentTemplate.tagline,
      description: currentTemplate.description,
      genderType,
      address: address || `#10, Main Road, ${area}`,
      area: area || 'Electronic City',
      city: city || 'Bengaluru',
      pincode: pincode || '560100',
      contactPhone: contactPhone || '+91 98450 12345',
      contactEmail: contactEmail || 'info@pgbuilder.in',
      whatsappNumber: whatsappNumber || '9845012345',
      upiId: upiId || 'hostel@upi',
      startingRent: Number(startingRent) || currentTemplate.defaultStartingRent,
      floorsCount: Number(floorsCount) || 3,
      roomsPerFloor: Number(roomsPerFloor) || 3,
      facilities: currentTemplate.facilities,
      houseRules: currentTemplate.houseRules
    });

    setCreatedProperty(newPg);
  };

  const handleFinishAndOpen = () => {
    if (createdProperty) {
      onCreated(createdProperty);
      setCreatedProperty(null);
      onClose();
    }
  };

  const handleCopyUrl = () => {
    if (createdProperty) {
      const fullUrl = `${window.location.origin}/pg/${createdProperty.slug}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Launch Unlimited Dedicated PG Websites
              </h3>
              <p className="text-xs text-slate-500">
                Choose a proven website template, customize settings, and get a dedicated link for your PG
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUCCESS VIEW AFTER WEBSITE IS CREATED */}
        {createdProperty ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Website Live &amp; Ready
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {createdProperty.name} is Published!
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Your standalone PG website is generated with bookable beds, QR payment checkout, meal menus, house rules, and resident ticket reporting.
              </p>
            </div>

            {/* Generated Link Box */}
            <div className="max-w-xl mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Unique Standalone Public Website URL:</span>
                <span className="text-emerald-700 font-bold">Active · Responsive</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/pg/${createdProperty.slug}`}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-indigo-700 font-bold select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Anyone clicking this link views only your PG website (styled like <span className="font-semibold text-slate-700">sv-pg-for-gents.vercel.app</span>) with direct bed booking, live occupancy, and payment QR.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleFinishAndOpen}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-200 flex items-center gap-2"
              >
                <span>Open Standalone PG Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  storageService.setActivePgId(createdProperty.id);
                  onCreated(createdProperty);
                  onClose();
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition"
              >
                Manage in Owner Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* CREATION FORM BODY */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* STEP 1: CHOOSE FROM 3 WEBSITE TEMPLATES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Step 1: Choose Website Template Style</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Select a ready-to-use template inspired by successful PG websites. You can customize all content.
                  </p>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  3 Templates Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TEMPLATES.map(tmpl => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${tmpl.badgeColor}`}>
                          {tmpl.badge}
                        </span>

                        <h5 className="text-sm font-bold text-slate-900 leading-snug">
                          {tmpl.name}
                        </h5>

                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {tmpl.tagline}
                        </p>

                        <div className="pt-2 border-t border-slate-200/80 space-y-1">
                          {tmpl.highlightBullets.map((bullet, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[10px]">Starting from</span>
                        <span className="font-extrabold text-slate-900">₹{tmpl.defaultStartingRent.toLocaleString('en-IN')}/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: PROPERTY DETAILS & SLUG */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Step 2: Customize Your Property Details &amp; Public Link</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property / Hostel Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Sai Ram Luxury PG"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dedicated Website URL Slug *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. sri-sai-ram-pg"
                      value={slug}
                      onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition font-mono font-medium shadow-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span>Your Dedicated Link:</span>
                    <span className="font-mono text-indigo-600 font-bold">/pg/{slug || 'my-pg'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hostel Type / Category *
                  </label>
                  <select
                    value={genderType}
                    onChange={e => setGenderType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition bg-white"
                  >
                    <option value="gents">Gents PG (Men only)</option>
                    <option value="ladies">Ladies PG (Women only)</option>
                    <option value="coliving">Unisex Co-Living</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Living with 3 Times Homely Food"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Locality / Tech Park Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electronic City Phase 1"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="560100"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Physical Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="#42, 3rd Cross, Near Wipro Gate 5, Electronic City"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp (Reminders &amp; Inquiries) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9845012345"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hostel UPI ID (Rent QR) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="hostel@okaxis"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition font-mono font-medium"
                  />
                </div>
              </div>

              {/* Building Floor & Room Pre-population */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Auto-Generated Floor &amp; Bed Capacity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Starting Rent (₹ / mo)
                    </label>
                    <input
                      type="number"
                      min={3000}
                      step={500}
                      value={startingRent}
                      onChange={e => setStartingRent(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Number of Floors
                    </label>
                    <select
                      value={floorsCount}
                      onChange={e => setFloorsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value={1}>1 Floor (Ground)</option>
                      <option value={2}>2 Floors (G + 1)</option>
                      <option value={3}>3 Floors (G + 2)</option>
                      <option value={4}>4 Floors (G + 3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Rooms per Floor
                    </label>
                    <select
                      value={roomsPerFloor}
                      onChange={e => setRoomsPerFloor(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value={2}>2 Rooms per floor</option>
                      <option value={3}>3 Rooms per floor</option>
                      <option value={4}>4 Rooms per floor</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pre-generates {floorsCount * roomsPerFloor} rooms (1, 2, 3-sharing) with individual beds. You can edit any room or bed anytime.
                </p>
              </div>

              {error && (
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-semibold">
                  {error}
                </p>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish PG Website &amp; Generate Link</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
