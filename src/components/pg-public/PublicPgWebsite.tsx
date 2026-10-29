import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Shield,
  Wifi,
  Utensils,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  BedDouble,
  ChevronRight,
  Search,
  ExternalLink,
  Share2,
  CalendarDays,
  Wrench
} from 'lucide-react';
import { PGProperty, Floor, Room, Bed, Booking } from '../../types/pg';
import { BookingModal } from '../booking/BookingModal';

interface PublicPgWebsiteProps {
  property: PGProperty;
  floors: Floor[];
  rooms: Room[];
  beds: Bed[];
  onOpenLookup: () => void;
  onOpenResidentPortal?: () => void;
  onViewReceipt: (booking: Booking) => void;
  onRefreshData: () => void;
  onEditInDashboard?: () => void;
}

export const PublicPgWebsite: React.FC<PublicPgWebsiteProps> = ({
  property,
  floors,
  rooms,
  beds,
  onOpenLookup,
  onOpenResidentPortal,
  onViewReceipt,
  onRefreshData,
  onEditInDashboard
}) => {
  const [selectedFloorId, setSelectedFloorId] = useState<string>(floors[0]?.id || '');
  const [selectedBedToBook, setSelectedBedToBook] = useState<Bed | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Default to first floor if not set
  const activeFloorId = selectedFloorId || floors[0]?.id || '';
  const currentFloorRooms = rooms.filter(r => r.floorId === activeFloorId);

  // Photos array
  const galleryPhotos = [
    { url: property.photos.hero, title: 'Deluxe Bedroom' },
    { url: property.photos.dining, title: 'Hygienic Dining Buffet' },
    { url: property.photos.lounge, title: 'Coworking & High-Speed WiFi Lounge' },
    { url: property.photos.exterior, title: 'Hostel Building' }
  ];

  const handleSelectBed = (bed: Bed) => {
    if (bed.status === 'available') {
      setSelectedBedToBook(bed);
      setIsBookingModalOpen(true);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Stats calculation
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Notification / Owner Quick Banner */}
      <div className="bg-indigo-900 text-indigo-100 text-xs py-2 px-4 border-b border-indigo-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">✨ Direct PG Online Booking:</span>
            <span>Zero Brokerage · Instant Bed Allotment · Phone OTP Protected</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleShareLink}
              className="hover:text-white transition flex items-center gap-1 font-medium"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share PG Link'}</span>
            </button>
            {onEditInDashboard && (
              <button
                onClick={onEditInDashboard}
                className="text-xs bg-indigo-700 hover:bg-indigo-600 text-white px-2.5 py-0.5 rounded transition font-semibold"
              >
                Owner Edit View
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PG Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {property.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                {property.genderType}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-md">{property.address}, {property.city}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${property.contactPhone}`}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Call Warden</span>
            </a>

            <a
              href={`https://wa.me/${property.whatsappNumber}?text=Hi,%20I%20am%20interested%20in%20booking%20a%20bed%20at%20${encodeURIComponent(property.name)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenLookup}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Lookup Booking</span>
            </button>

            {onOpenResidentPortal && (
              <button
                onClick={onOpenResidentPortal}
                className="px-3 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                <span>Resident Helpdesk</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-16/9 bg-slate-900 group">
              <img
                src={galleryPhotos[selectedPhotoIndex].url}
                alt={galleryPhotos[selectedPhotoIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-300 block">
                    Verified Property Photos
                  </span>
                  <p className="text-base font-bold">{galleryPhotos[selectedPhotoIndex].title}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-mono">
                    {selectedPhotoIndex + 1} / {galleryPhotos.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-4 gap-2.5">
              {galleryPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-16/9 border-2 transition ${
                    selectedPhotoIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Key Highlights & Quick Booking Hook */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                {property.area}, {property.city}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {property.tagline}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Availability & Price Strip */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Starting Rent</span>
                <p className="text-2xl font-black text-slate-900 tabular-nums">
                  ₹{property.pricing['3-sharing']?.monthlyRent || 7000}
                  <span className="text-xs text-slate-500 font-normal"> /month</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  ✓ All 3 Meals & WiFi Included
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Live Vacancy</span>
                <p className="text-xl font-bold text-emerald-600 tabular-nums">
                  {availableBeds} <span className="text-xs text-slate-600 font-medium">/ {totalBeds} Beds</span>
                </p>
                <span className="text-[11px] text-slate-400">Real-time status</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5">
              <a
                href="#bed-availability"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm text-center block text-sm"
              >
                View Live Beds & Book Online
              </a>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${property.contactPhone}`}
                  className="py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-center transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{property.contactPhone}</span>
                </a>
                <a
                  href={`https://wa.me/${property.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl text-center transition border border-emerald-200 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="block text-xs font-bold text-slate-900">Zero</span>
                <span className="text-[10px] text-slate-500">Brokerage</span>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="block text-xs font-bold text-slate-900">30 Days</span>
                <span className="text-[10px] text-slate-500">Notice Period</span>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="block text-xs font-bold text-slate-900">100%</span>
                <span className="text-[10px] text-slate-500">Deposit Refund</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & SHARING CATEGORIES */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                Transparent Monthly Rates
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Room Sharing & Pricing Plans
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              * Rent includes 3 meals daily, electricity, water, high-speed WiFi and daily cleaning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['1-sharing', '2-sharing', '3-sharing', '4-sharing'] as const).map(type => {
              const cfg = property.pricing[type];
              if (!cfg) return null;
              const isPopular = type === '2-sharing';

              return (
                <div
                  key={type}
                  className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between ${
                    isPopular
                      ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600/20 relative'
                      : 'border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900 capitalize">
                        {type.replace('-', ' ')}
                      </h4>
                      {cfg.acAvailable && (
                        <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded border border-sky-200">
                          AC Option
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-2xl font-black text-slate-900 tabular-nums">
                        ₹{cfg.monthlyRent.toLocaleString('en-IN')}
                        <span className="text-xs text-slate-500 font-normal"> /mo</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                        ₹{cfg.advanceDeposit.toLocaleString('en-IN')} Security Deposit
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                      {cfg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>3 Times Food & WiFi</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <a
                      href="#bed-availability"
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-center block transition ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      Check Bed Vacancies
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE FLOOR, ROOM & BED AVAILABILITY VISUALIZER */}
        <section id="bed-availability" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                Live Inventory Engine
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Floor & Bed Availability Visualizer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any green bed to reserve instantly online. Double-booking prevented.
              </p>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Held</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span>Occupied</span>
              </div>
            </div>
          </div>

          {/* Floor Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => setSelectedFloorId(floor.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap shrink-0 ${
                  activeFloorId === floor.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {floor.name}
              </button>
            ))}
          </div>

          {/* Rooms Grid for Selected Floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentFloorRooms.map(room => {
              const roomBeds = beds.filter(b => b.roomId === room.id);
              const pricing = property.pricing[room.sharingType];
              const rent = (pricing?.monthlyRent || 7000) + (room.isAC ? (pricing?.acExtraMonthly || 0) : 0);

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition"
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
                      <p className="text-xs text-slate-500 capitalize mt-0.5">
                        {room.sharingType.replace('-', ' ')} · Attached Bath
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 tabular-nums">
                        ₹{rent.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-slate-400">per bed / mo</span>
                    </div>
                  </div>

                  {/* Bed Slots */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Beds in this Room ({roomBeds.length})
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {roomBeds.map(bed => {
                        const isAvail = bed.status === 'available';
                        const isHeld = bed.status === 'held';
                        const isOcc = bed.status === 'occupied';

                        return (
                          <button
                            key={bed.id}
                            type="button"
                            disabled={!isAvail}
                            onClick={() => handleSelectBed(bed)}
                            className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                              isAvail
                                ? 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer shadow-xs group'
                                : isHeld
                                ? 'bg-amber-50/60 border-amber-200 cursor-not-allowed opacity-80'
                                : 'bg-slate-100/70 border-slate-200 cursor-not-allowed opacity-75'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {bed.bedLabel}
                              </span>
                              <BedDouble
                                className={`w-3.5 h-3.5 ${
                                  isAvail ? 'text-emerald-600' : isHeld ? 'text-amber-600' : 'text-slate-400'
                                }`}
                              />
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              {isAvail && (
                                <span className="text-emerald-700 font-bold group-hover:underline">
                                  Book Now →
                                </span>
                              )}
                              {isHeld && (
                                <span className="text-amber-700 font-semibold">
                                  Held (Reserved)
                                </span>
                              )}
                              {isOcc && (
                                <span className="text-slate-500 font-medium">
                                  Occupied
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 24/7 AMENITIES GRID */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
              Everything Included
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Hostel Facilities & Amenities
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3 hover:border-slate-300 transition"
              >
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  {idx % 4 === 0 && <Wifi className="w-4 h-4" />}
                  {idx % 4 === 1 && <Utensils className="w-4 h-4" />}
                  {idx % 4 === 2 && <Sparkles className="w-4 h-4" />}
                  {idx % 4 === 3 && <Shield className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{fac}</h4>
                  <span className="text-[11px] text-slate-400">Included in rent</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7-DAY FOOD MENU TIMETABLE */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
              Hygienic Homely Meals
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Weekly Meal Menu (Breakfast, Lunch & Dinner)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prepared fresh by experienced North & South Indian cooks with unlimited servings.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-32">Day</th>
                    <th className="p-3.5">Breakfast (7:30 AM - 10:00 AM)</th>
                    <th className="p-3.5">Lunch (12:30 PM - 3:00 PM)</th>
                    <th className="p-3.5">Dinner (7:30 PM - 10:30 PM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {property.mealPlan.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{m.day}</td>
                      <td className="p-3.5">{m.breakfast}</td>
                      <td className="p-3.5">{m.lunch}</td>
                      <td className="p-3.5 font-medium text-slate-800">{m.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* HOUSE RULES & LOCATION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Rules */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                Safety & Code of Conduct
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Hostel Rules & Policies
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600">
              {property.houseRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              Notice Period: <strong>{property.noticePeriodDays} Days</strong> required prior to vacating. Gate closing: <strong>{property.gateClosingTime}</strong>.
            </div>
          </div>

          {/* Location & Contact Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                Visit Us & Map Location
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Hostel Address & Directions
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-900 text-sm">{property.name}</p>
              <p>{property.address}</p>
              <p className="text-slate-500">Landmark: {property.landmark}</p>
              <p className="text-slate-500">City & Pincode: {property.city} - {property.pincode}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${property.name} ${property.address} ${property.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs text-center border border-indigo-200 transition flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={`tel:${property.contactPhone}`}
                className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call {property.contactPhone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {selectedBedToBook && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedBedToBook(null);
          }}
          property={property}
          selectedBed={selectedBedToBook}
          rooms={rooms}
          floors={floors}
          onBookingComplete={() => {
            onRefreshData();
          }}
          onViewReceipt={booking => {
            setIsBookingModalOpen(false);
            onViewReceipt(booking);
          }}
        />
      )}
    </div>
  );
};
