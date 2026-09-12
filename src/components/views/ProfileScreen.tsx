import React, { useState } from 'react';
import {
  User,
  QrCode,
  Lock,
  Sun,
  Moon,
  Globe,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { CURRENCIES } from '../../utils/currency';

interface ProfileScreenProps {
  onOpenCurrencyModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenCurrencyModal }) => {
  const {
    user,
    theme,
    setTheme,
    currency,
    lockApp,
    appPin,
    setAppPin,
    resetDefaults,
    setIsMyQROpen,
  } = useVaultContext();

  const [newPinInput, setNewPinInput] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  const currentCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length === 4) {
      setAppPin(newPinInput);
      setPinSaved(true);
      setNewPinInput('');
      setTimeout(() => setPinSaved(false), 2000);
    }
  };

  const handleConfirmReset = () => {
    if (window.confirm('Are you sure you want to reset all Vautly demo state to default seed data?')) {
      resetDefaults();
      alert('Vautly state restored to defaults!');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your Vautly identity, payment preferences & security
        </p>
      </div>

      {/* 1. USER IDENTITY CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-800">
            {user.name[0]}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-sans">
              {user.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full font-semibold">
                {user.upiId}
              </span>
              <span className="text-xs text-gray-400 font-mono">{user.phone}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMyQROpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <QrCode className="h-4 w-4" />
          <span>My QR Code</span>
        </button>
      </div>

      {/* 2. SECURITY & APP LOCK */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white font-sans">
            Security & App Lock
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <div>
            <span className="font-bold text-xs text-gray-900 dark:text-white block">
              Lock Vautly Immediately
            </span>
            <span className="text-[11px] text-gray-400">
              Requires 4-digit Vautly PIN (Current PIN: <strong className="font-mono text-gray-700 dark:text-gray-300">{appPin}</strong>)
            </span>
          </div>

          <button
            onClick={lockApp}
            className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock App Now</span>
          </button>
        </div>

        {/* Change PIN Form */}
        <form onSubmit={handleUpdatePin} className="space-y-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Change 4-Digit Security PIN
          </label>

          <div className="flex gap-3">
            <input
              type="password"
              maxLength={4}
              placeholder="Enter new 4-digit PIN"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
              className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-semibold font-mono text-gray-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={newPinInput.length !== 4}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40"
            >
              {pinSaved ? 'Saved!' : 'Update PIN'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. PREFERENCES */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white font-sans">
          Application Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block">Theme Mode</span>
              <span className="text-[11px] text-gray-400">Currently {theme}</span>
            </div>

            <button
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
          </div>

          {/* Currency */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block">Base Currency</span>
              <span className="text-[11px] text-gray-400">{currentCurrency.symbol} ({currentCurrency.name})</span>
            </div>

            <button
              onClick={onOpenCurrencyModal}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-xs font-semibold"
            >
              <Globe className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. DEMO DATA RESET & DISCLOSURE */}
      <div className="space-y-4">
        <button
          onClick={handleConfirmReset}
          className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All Vautly State to Seed Defaults</span>
        </button>

        <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-zinc-800/60 border border-gray-200/60 dark:border-zinc-700/60 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-3">
          <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Portfolio & Portfolio Demonstration Notice:</strong> Vautly is a simulated UPI digital payment prototype with goal-based Vaults. All balances, transactions, and QR scans are executed in a simulated local state without connecting to real bank accounts or actual UPI payment rails.
          </p>
        </div>
      </div>
    </div>
  );
};
