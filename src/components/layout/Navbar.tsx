import React from 'react';
import { Plus, Sun, Moon, Globe, Lock, QrCode, Home, Send, ShieldCheck, History, User } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { CURRENCIES } from '../../utils/currency';

interface NavbarProps {
  onOpenCreateVault: () => void;
  onOpenCurrencyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateVault,
  onOpenCurrencyModal,
}) => {
  const { currency, theme, setTheme, activeTab, setActiveTab, lockApp, setIsQRScannerOpen, user } = useVaultContext();
  const currentConfig = CURRENCIES[currency] || CURRENCIES.INR;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pay', label: 'Pay', icon: Send },
    { id: 'vaults', label: 'Vaults', icon: ShieldCheck },
    { id: 'transactions', label: 'Activity', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white font-sans block leading-none">
                Vautly
              </span>
              <span className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                UPI + Vaults
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-zinc-800/60 p-1 rounded-2xl border border-gray-200/50 dark:border-zinc-700/50">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Scan QR Desktop Button */}
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60 transition-all shadow-sm"
          >
            <QrCode className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Scan & Pay</span>
          </button>

          {/* Currency Pill Selector */}
          <button
            onClick={onOpenCurrencyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-xs font-medium transition-all shadow-sm"
            title="Change Currency"
          >
            <Globe className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span>{currentConfig.symbol} {currentConfig.code}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-gray-600" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* App Lock Button */}
          <button
            onClick={lockApp}
            className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
            title="Lock Vautly"
          >
            <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </button>

          {/* Create Vault Button */}
          <button
            onClick={onOpenCreateVault}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Vault</span>
          </button>
        </div>
      </div>
    </header>
  );
};
