import React, { useState } from 'react';
import {
  QrCode,
  Send,
  ArrowDownLeft,
  AtSign,
  Users,
  Search,
  CheckCircle2,
  Store,
  Coffee,
  Laptop,
  ChevronRight,
} from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';

export const PayScreen: React.FC = () => {
  const {
    contacts,
    openPaymentWithRecipient,
    setIsPaymentOpen,
    setIsQRScannerOpen,
    setIsRequestMoneyOpen,
    setIsMyQROpen,
    currency,
  } = useVaultContext();

  const [inputUpiId, setInputUpiId] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  const filteredContacts = contacts.filter((c) => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.upiId.toLowerCase().includes(q);
  });

  const handlePayInputUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUpiId.trim()) return;
    openPaymentWithRecipient(inputUpiId.split('@')[0] || 'Recipient', inputUpiId.trim());
    setInputUpiId('');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
          Payments Hub
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Scan QR codes, send peer-to-peer payments, or request money using UPI IDs
        </p>
      </div>

      {/* 1. HERO SCAN & PAY BANNER */}
      <div
        onClick={() => setIsQRScannerOpen(true)}
        className="group cursor-pointer rounded-3xl bg-gradient-to-r from-zinc-900 via-gray-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 p-6 sm:p-8 text-white shadow-xl flex items-center justify-between border border-zinc-700/80 hover:border-emerald-500 transition-all"
      >
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full inline-block">
            Primary Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans group-hover:text-emerald-400 transition-colors">
            Scan any QR to Pay
          </h2>
          <p className="text-xs text-zinc-400 max-w-md">
            Point your camera at merchant QR codes or select demo store samples for instant payment processing.
          </p>
        </div>

        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
          <QrCode className="h-10 w-10" />
        </div>
      </div>

      {/* 2. DIRECT PAY UPI ID INPUT BAR */}
      <div className="rounded-3xl bg-white dark:bg-zinc-800/90 p-5 sm:p-6 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-sans">
          Pay any UPI ID
        </label>

        <form onSubmit={handlePayInputUpi} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Enter UPI ID (e.g. rahul@vautly, merchant@upi)"
              value={inputUpiId}
              onChange={(e) => setInputUpiId(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span>Verify & Pay</span>
          </button>
        </form>
      </div>

      {/* 3. QUICK TILES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setIsPaymentOpen(true)}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left space-y-3 group"
        >
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">Send Money</h4>
            <p className="text-[10px] text-gray-400">Transfer to friends</p>
          </div>
        </button>

        <button
          onClick={() => setIsRequestMoneyOpen(true)}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left space-y-3 group"
        >
          <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">Request Money</h4>
            <p className="text-[10px] text-gray-400">Collect payment link</p>
          </div>
        </button>

        <button
          onClick={() => setIsQRScannerOpen(true)}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left space-y-3 group"
        >
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">Scan QR</h4>
            <p className="text-[10px] text-gray-400">Camera scanner</p>
          </div>
        </button>

        <button
          onClick={() => setIsMyQROpen(true)}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left space-y-3 group"
        >
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">My QR Code</h4>
            <p className="text-[10px] text-gray-400">Receive payment</p>
          </div>
        </button>
      </div>

      {/* 4. RECENT PEOPLE & CONTACTS GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
              Recent People & Payees
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tap any contact to initiate an instant payment flow
            </p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search people or UPI..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredContacts.map((c) => (
            <div
              key={c.id}
              onClick={() => openPaymentWithRecipient(c.name, c.upiId)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-emerald-100 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-zinc-600/50 overflow-hidden">
                  {c.isMerchant ? c.avatar : c.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-sans">
                    {c.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono block">{c.upiId}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                Pay
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
