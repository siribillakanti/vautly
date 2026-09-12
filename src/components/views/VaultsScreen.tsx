import React from 'react';
import { Plus, Sparkles, ShieldCheck, Target, ArrowRightLeft, Send } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';
import { VaultGrid } from '../dashboard/VaultGrid';

interface VaultsScreenProps {
  onOpenCreateVault: () => void;
  onSelectVault: (vault: any) => void;
}

export const VaultsScreen: React.FC<VaultsScreenProps> = ({
  onOpenCreateVault,
  onSelectVault,
}) => {
  const { totalReserved, vaults, currency, setIsPaymentOpen, setPaymentPreset } = useVaultContext();

  const activeVaults = vaults.filter((v) => !v.isArchived);

  // Generate Rule-based Smart Insights
  const insights = activeVaults.map((vault) => {
    const target = vault.targetAmount || 0;
    const current = vault.reservedAmount || 0;
    if (!target) return null;
    const remaining = target - current;
    const pct = Math.round((current / target) * 100);

    let recommendation = '';
    if (pct >= 100) {
      recommendation = `🎉 Goal Achieved! You have fully funded ${vault.title}.`;
    } else {
      const weeksToTarget = Math.ceil(remaining / 500);
      recommendation = `If you contribute ${formatMoney(500, currency)}/week, you will complete ${vault.title} in ~${weeksToTarget} weeks! (${formatMoney(remaining, currency)} remaining)`;
    }

    return {
      id: vault.id,
      title: vault.title,
      pct,
      recommendation,
    };
  }).filter(Boolean);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
            Goal-Based Vaults
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Allocate money inside your payment app for dedicated financial goals
          </p>
        </div>

        <button
          onClick={onOpenCreateVault}
          className="px-4 py-2.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Vault</span>
        </button>
      </div>

      {/* Hero Stats Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100/90 font-sans block mb-1">
            Total Allocated in Vaults
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-sans">
            {formatMoney(totalReserved, currency)}
          </div>
          <p className="text-xs text-blue-100/80 mt-1">
            Across {activeVaults.length} active goal reserves
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100/90 font-sans block mb-1">
            Vaults Integration
          </span>
          <div className="text-xl font-bold font-sans text-white">
            Pay Directly from Vaults
          </div>
          <p className="text-xs text-blue-100/80 mt-1">
            Use any Vault as a payment source during checkout
          </p>
        </div>

        <div className="sm:text-right flex flex-col sm:items-end justify-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-100/90 font-sans block mb-1">
            Quick Pay from Vault
          </span>
          <button
            onClick={() => {
              if (activeVaults.length > 0) {
                setPaymentPreset({ paymentSourceId: activeVaults[0].id });
              }
              setIsPaymentOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Select Vault & Pay</span>
          </button>
        </div>
      </div>

      {/* Smart Insights Carousel / List */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-sans">
              Calculated Vault Forecasts
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.slice(0, 2).map((ins) => (
              <div
                key={ins?.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm flex items-start gap-3 text-xs"
              >
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  {ins?.pct}%
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block font-sans">
                    {ins?.title} Progress
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {ins?.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vault Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
          Your Active Vaults
        </h2>

        <VaultGrid
          onSelectVault={onSelectVault}
          onOpenCreateVault={onOpenCreateVault}
        />
      </div>
    </div>
  );
};
