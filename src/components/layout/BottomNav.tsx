import React from 'react';
import { Home, Send, ShieldCheck, History, User, QrCode } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsQRScannerOpen } = useVaultContext();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pay', label: 'Pay', icon: Send },
    { id: 'vaults', label: 'Vaults', icon: ShieldCheck },
    { id: 'transactions', label: 'Activity', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-t border-gray-200/80 dark:border-zinc-800 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.id === 'pay') {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab('pay')}
                className="flex flex-col items-center justify-center relative -top-3"
              >
                <div className={`h-13 w-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                  isActive
                    ? 'bg-emerald-600 text-white scale-105 shadow-emerald-500/30'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                }`}>
                  <Send className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  Pay
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
