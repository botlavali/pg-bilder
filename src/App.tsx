import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PlatformLanding } from './components/landing/PlatformLanding';
import { PublicPgWebsite } from './components/pg-public/PublicPgWebsite';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { CreatePgModal } from './components/owner/CreatePgModal';
import { LookupModal } from './components/booking/LookupModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { AuthModal } from './components/common/AuthModal';
import { ResidentPortalModal } from './components/booking/ResidentPortalModal';
import { storageService } from './services/storageService';
import { testFirestoreConnection } from './services/firebase';
import {
  PGProperty,
  Floor,
  Room,
  Bed,
  Booking,
  PaymentTransaction,
  ReminderNotification,
  UserAccount
} from './types/pg';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'public_pg' | 'owner_dashboard'>('landing');
  const [activeSlug, setActiveSlug] = useState<string>('sv-pg-for-gents');

  // Multi-User & Tenant State
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => storageService.getUser());

  // Multi-Tenant Data States
  const [properties, setProperties] = useState<PGProperty[]>([]);
  const [activeProperty, setActiveProperty] = useState<PGProperty | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [reminders, setReminders] = useState<ReminderNotification[]>([]);

  // Modals
  const [isCreatePgOpen, setIsCreatePgOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isResidentPortalOpen, setIsResidentPortalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    isOpen: boolean;
    booking?: Booking;
    payment?: PaymentTransaction;
    property?: PGProperty;
  }>({ isOpen: false });

  // Load and refresh data from storageService with strict tenant scoping
  const refreshData = useCallback(() => {
    // Role-based tenant filtering
    const accessibleProps = storageService.getPropertiesForUser(currentUser);
    setProperties(accessibleProps);

    const allProps = storageService.getAllProperties();
    let currentProp: PGProperty | undefined;

    // If activeSlug is set, prioritize property matching that slug
    if (activeSlug) {
      currentProp = allProps.find(p => p.slug.toLowerCase() === activeSlug.toLowerCase());
    }

    // Otherwise use accessible property or active property ID
    if (!currentProp) {
      const activeId = storageService.getActivePgId();
      currentProp = accessibleProps.find(p => p.id === activeId) || accessibleProps[0] || allProps[0];
    }

    if (currentProp) {
      setActiveProperty(currentProp);
      setFloors(storageService.getFloorsByPgId(currentProp.id));
      setRooms(storageService.getRoomsByPgId(currentProp.id));
      setBeds(storageService.getBedsByPgId(currentProp.id));
      setBookings(storageService.getBookingsByPgId(currentProp.id));
      setPayments(storageService.getPaymentsByPgId(currentProp.id));
      setReminders(storageService.getRemindersByPgId(currentProp.id));
    }
  }, [activeSlug, currentUser]);

  // Initial mount: inspect path (e.g. /pg/:slug) & test Firestore connection
  useEffect(() => {
    testFirestoreConnection().catch(err => console.warn('Firestore connectivity test:', err));
    const path = window.location.pathname;
    if (path.startsWith('/pg/')) {
      const slug = path.replace('/pg/', '').trim();
      if (slug) {
        setActiveSlug(slug);
        setCurrentView('public_pg');
      }
    }
    refreshData();
  }, [refreshData]);

  const handleNavigate = (view: 'landing' | 'public_pg' | 'owner_dashboard', slug?: string) => {
    setCurrentView(view);
    if (slug) {
      setActiveSlug(slug);
      const allProps = storageService.getAllProperties();
      const matched = allProps.find(p => p.slug.toLowerCase() === slug.toLowerCase());
      if (matched) {
        storageService.setActivePgId(matched.id);
        setActiveProperty(matched);
        setFloors(storageService.getFloorsByPgId(matched.id));
        setRooms(storageService.getRoomsByPgId(matched.id));
        setBeds(storageService.getBedsByPgId(matched.id));
        setBookings(storageService.getBookingsByPgId(matched.id));
        setPayments(storageService.getPaymentsByPgId(matched.id));
        setReminders(storageService.getRemindersByPgId(matched.id));
      }
      try {
        window.history.pushState({}, '', `/pg/${slug}`);
      } catch (e) {
        // ignore history state errors in sandbox
      }
    } else if (view === 'landing') {
      try {
        window.history.pushState({}, '', '/');
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSelectPropertyInDashboard = (prop: PGProperty) => {
    storageService.setActivePgId(prop.id);
    setActiveProperty(prop);
    setActiveSlug(prop.slug);
    setFloors(storageService.getFloorsByPgId(prop.id));
    setRooms(storageService.getRoomsByPgId(prop.id));
    setBeds(storageService.getBedsByPgId(prop.id));
    setBookings(storageService.getBookingsByPgId(prop.id));
    setPayments(storageService.getPaymentsByPgId(prop.id));
    setReminders(storageService.getRemindersByPgId(prop.id));
  };

  const handlePgCreated = (newProp: PGProperty) => {
    refreshData();
    handleNavigate('public_pg', newProp.slug);
  };

  const handleOpenReceipt = (booking?: Booking, payment?: PaymentTransaction) => {
    setReceiptData({
      isOpen: true,
      booking,
      payment,
      property: activeProperty || undefined
    });
  };

  const handleUserChanged = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    // If owner has no properties yet, prompt to create website
    const ownerProps = storageService.getPropertiesForUser(newUser);
    if (newUser.role === 'owner' && ownerProps.length === 0) {
      setIsCreatePgOpen(true);
    }
    refreshData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Universal Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        activePg={activeProperty || undefined}
        currentUser={currentUser}
        onOpenCreatePg={() => setIsCreatePgOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenResidentPortal={() => setIsResidentPortalOpen(true)}
      />

      {/* Main Dynamic View */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <PlatformLanding
            properties={storageService.getAllProperties()}
            onOpenCreatePg={() => setIsCreatePgOpen(true)}
            onNavigateToPg={slug => handleNavigate('public_pg', slug)}
            onOpenOwnerDashboard={pgId => {
              if (pgId) {
                const match = storageService.getAllProperties().find(p => p.id === pgId);
                if (match) handleSelectPropertyInDashboard(match);
              }
              handleNavigate('owner_dashboard');
            }}
            onOpenLookup={() => setIsLookupOpen(true)}
          />
        )}

        {currentView === 'public_pg' && activeProperty && (
          <PublicPgWebsite
            property={activeProperty}
            floors={floors}
            rooms={rooms}
            beds={beds}
            onOpenLookup={() => setIsLookupOpen(true)}
            onOpenResidentPortal={() => setIsResidentPortalOpen(true)}
            onViewReceipt={booking => handleOpenReceipt(booking)}
            onRefreshData={refreshData}
            onEditInDashboard={() => handleNavigate('owner_dashboard')}
          />
        )}

        {currentView === 'owner_dashboard' && activeProperty && (
          <OwnerDashboard
            properties={properties}
            activeProperty={activeProperty}
            onSelectProperty={handleSelectPropertyInDashboard}
            floors={floors}
            rooms={rooms}
            beds={beds}
            bookings={bookings}
            payments={payments}
            reminders={reminders}
            currentUser={currentUser}
            onOpenCreatePg={() => setIsCreatePgOpen(true)}
            onViewPublicPg={slug => handleNavigate('public_pg', slug)}
            onViewReceipt={(b, p) => handleOpenReceipt(b, p)}
            onRefreshData={refreshData}
          />
        )}
      </div>

      {/* Universal Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCreatePg={() => setIsCreatePgOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Global Modals */}
      <CreatePgModal
        isOpen={isCreatePgOpen}
        onClose={() => setIsCreatePgOpen(false)}
        onCreated={handlePgCreated}
      />

      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onViewReceipt={booking => handleOpenReceipt(booking)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={handleUserChanged}
      />

      <ResidentPortalModal
        isOpen={isResidentPortalOpen}
        onClose={() => setIsResidentPortalOpen(false)}
        currentUser={currentUser}
        onViewReceipt={booking => handleOpenReceipt(booking)}
        onRefreshData={refreshData}
      />

      <ReceiptModal
        isOpen={receiptData.isOpen}
        onClose={() => setReceiptData({ isOpen: false })}
        booking={receiptData.booking}
        payment={receiptData.payment}
        property={receiptData.property}
      />
    </div>
  );
}
