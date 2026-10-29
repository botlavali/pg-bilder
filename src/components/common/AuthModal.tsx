import React, { useState } from 'react';
import {
  X,
  Shield,
  Building2,
  User,
  CheckCircle2,
  ArrowRight,
  Lock,
  Phone,
  Mail,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserAccount } from '../../types/pg';
import { storageService } from '../../services/storageService';
import { OtpModal } from './OtpModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (user: UserAccount) => void;
  defaultMode?: 'login' | 'register_owner' | 'register_customer';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register_owner' | 'register_customer'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  if (!isOpen) return null;

  const allUsers = storageService.getAllUsers();

  const handleQuickSwitch = (u: UserAccount) => {
    storageService.setUser(u);
    onUserChanged(u);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');

    const found = allUsers.find(
      u =>
        u.email.toLowerCase() === clean ||
        u.phone.replace(/\D/g, '').includes(cleanPhone) ||
        u.name.toLowerCase() === clean
    );

    if (found) {
      storageService.setUser(found);
      onUserChanged(found);
      onClose();
    } else {
      // Auto-fallback: create account for effortless login
      const newUser = storageService.registerUser({
        name: clean.split('@')[0] || 'User',
        email: clean.includes('@') ? clean : `${clean}@pgbuilder.in`,
        phone: phone.trim().length > 5 ? phone : '+91 98450 99999',
        role: 'owner',
        businessName: 'My PG Group'
      });
      onUserChanged(newUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const userData = {
      name,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@pgbuilder.in`,
      phone,
      role: mode === 'register_owner' ? ('owner' as const) : ('customer' as const),
      businessName: mode === 'register_owner' ? businessName || `${name}'s Hostel` : undefined,
      password: password || 'pass123'
    };

    setPendingUserData(userData);
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (pendingUserData) {
      const created = storageService.registerUser(pendingUserData);
      onUserChanged(created);
      setIsOtpOpen(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                Authentication &amp; Role Management
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'login' && 'Sign in to PG Builder'}
                {mode === 'register_owner' && 'Register as PG Owner (Create Website)'}
                {mode === 'register_customer' && 'Register as Resident / Guest'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Demo Switcher Strip - specifically requested: "admin defarent owner defarent custemor defarent" */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                  Quick Switch Test Profiles (Role Separation)
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold font-mono">
                  Current: {currentUser.role.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Admin */}
                <button
                  type="button"
                  onClick={() => {
                    const admin = allUsers.find(u => u.role === 'admin') || allUsers[0];
                    handleQuickSwitch(admin);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Lead Admin</span>
                  </div>
                  <p className={`text-[10px] leading-tight ${currentUser.role === 'admin' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    Vali Botla (Manages all PG websites)
                  </p>
                </button>

                {/* PG Owner */}
                <button
                  type="button"
                  onClick={() => {
                    const owner = allUsers.find(u => u.role === 'owner') || allUsers[1];
                    handleQuickSwitch(owner);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                    currentUser.role === 'owner'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>PG Owner</span>
                  </div>
                  <p className={`text-[10px] leading-tight ${currentUser.role === 'owner' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    Rajesh Kumar (Only sees SV PG for Gents)
                  </p>
                </button>

                {/* Resident / Customer */}
                <button
                  type="button"
                  onClick={() => {
                    const cust = allUsers.find(u => u.role === 'customer') || allUsers[2];
                    handleQuickSwitch(cust);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                    currentUser.role === 'customer'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Resident</span>
                  </div>
                  <p className={`text-[10px] leading-tight ${currentUser.role === 'customer' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    Karthik Reddy (Books bed &amp; views receipts)
                  </p>
                </button>
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 px-4 border-b-2 transition ${
                  mode === 'login'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register_owner')}
                className={`py-2 px-4 border-b-2 transition ${
                  mode === 'register_owner'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Register as Owner (Create PG)
              </button>
              <button
                type="button"
                onClick={() => setMode('register_customer')}
                className={`py-2 px-4 border-b-2 transition ${
                  mode === 'register_customer'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Resident Sign Up
              </button>
            </div>

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rajesh.svpg@gmail.com or 9845012345"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
                >
                  Sign In
                </button>
              </form>
            )}

            {/* REGISTER AS OWNER */}
            {mode === 'register_owner' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                  <span className="font-bold">PG Owner Access: </span>
                  Register here to get your isolated PG management portal, launch your branded website, and manage your rooms, beds, and rent collections.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Gowda"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (for OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hostel / Business Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gowda Luxury PG"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="suresh@gowdapg.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Verify Phone via OTP &amp; Register</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* REGISTER AS RESIDENT */}
            {mode === 'register_customer' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                  <span className="font-bold">Resident Account: </span>
                  Register to track your booking, view assigned room &amp; bed, download rent receipts, and submit check-out vacating notices.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Verma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (for SMS &amp; OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 99887 76655"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="ankit@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Verify Phone via OTP &amp; Register</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={isOtpOpen}
        phone={phone}
        onSuccess={handleOtpSuccess}
        onClose={() => setIsOtpOpen(false)}
        title="Verify Your Phone Number"
        description="We've sent a 4-digit verification code to complete your registration."
      />
    </>
  );
};
