import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageSquare, ArrowRight, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface OtpModalProps {
  isOpen: boolean;
  phone: string;
  onSuccess: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  phone,
  onSuccess,
  onClose,
  title = 'Verify Your Mobile Number',
  description = 'We sent a 4-digit verification code to your phone number.'
}) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [activeCode, setActiveCode] = useState<string>('');
  const [showSimulatedSms, setShowSimulatedSms] = useState(true);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen && phone) {
      const generated = storageService.generateOTP(phone);
      setActiveCode(generated.code);
      setShowSimulatedSms(true);
      setCode(['', '', '', '']);
      setError('');
      setTimer(60);
    }
  }, [isOpen, phone]);

  useEffect(() => {
    let interval: any;
    if (timer > 0 && isOpen) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (digit && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    if (newCode.every(d => d.length === 1)) {
      verifyCombined(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAutoFill = () => {
    if (activeCode && activeCode.length === 4) {
      const digits = activeCode.split('');
      setCode(digits);
      verifyCombined(activeCode);
    }
  };

  const verifyCombined = (val: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const ok = storageService.verifyOTP(phone, val);
      if (ok) {
        onSuccess();
      } else {
        setError('Invalid verification code. Please check and try again.');
      }
    }, 400);
  };

  const handleResend = () => {
    const generated = storageService.generateOTP(phone);
    setActiveCode(generated.code);
    setShowSimulatedSms(true);
    setTimer(60);
    setCode(['', '', '', '']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Simulated Live SMS Incoming Notification */}
        {showSimulatedSms && activeCode && (
          <div className="m-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3 shadow-sm animate-bounce-short">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  SMS Received · Just now
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold font-mono">
                  +91 {phone.slice(-10)}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Your PG Builder verification OTP is{' '}
                <strong className="text-indigo-700 font-mono text-sm tracking-widest">{activeCode}</strong>.
              </p>
              <button
                type="button"
                onClick={handleAutoFill}
                className="mt-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 underline flex items-center gap-1"
              >
                <span>Click here to Auto-fill ({activeCode})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="p-6 pt-3 text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {description} <br />
            <span className="font-semibold text-slate-800">{phone}</span>
          </p>

          {/* 4 Digit Inputs */}
          <div className="flex justify-center gap-3 my-6">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold font-mono border-2 border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none transition shadow-sm bg-slate-50 focus:bg-white text-slate-900"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-600 mb-4 bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => verifyCombined(code.join(''))}
            disabled={code.some(d => !d) || isVerifying}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isVerifying ? 'Verifying OTP...' : 'Confirm & Proceed'}</span>
          </button>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Didn&apos;t get the code?</span>
            {timer > 0 ? (
              <span className="font-mono text-slate-400">Resend in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
