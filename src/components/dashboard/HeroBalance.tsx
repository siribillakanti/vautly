import React from 'react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';
import { Plus } from 'lucide-react';

interface HeroBalanceProps {
  onOpenDeposit: () => void;
}

export const HeroBalance: React.FC<HeroBalanceProps> = ({ onOpenDeposit }) => {
  const { availableBalance, totalReserved, totalBalance, currency } = useVaultContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. HERO: Available Balance */}
      <div className="rounded-2xl bg-white dark:bg-zinc-800/90 p-6 border border-emerald-500/20 dark:border-emerald-500/30 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans">
              Available Balance
            </span>
            <span className="text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Ready to Spend
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-sans mt-1">
            {formatMoney(availableBalance, currency)}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Money available for daily spending and unassigned funds.
          </p>
        </div>

        <button
          onClick={onOpenDeposit}
          className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-medium text-xs border border-emerald-200/60 dark:border-emerald-800/60 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Money to Available</span>
        </button>
      </div>

      {/* 2. Reserved in Vaults */}
      <div className="rounded-2xl bg-white dark:bg-zinc-800/90 p-6 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-sans">
              Reserved in Vaults
            </span>
            <span className="text-[10px] font-medium bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              Earmarked
            </span>
          </div>

          <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-sans mt-1">
            {formatMoney(totalReserved, currency)}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Total money set aside in your active goal vaults.
          </p>
        </div>
      </div>

      {/* 3. Total Balance */}
      <div className="rounded-2xl bg-white dark:bg-zinc-800/90 p-6 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-sans">
              Total Balance
            </span>
            <span className="text-[10px] font-medium bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              Available + Reserved
            </span>
          </div>

          <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-sans mt-1">
            {formatMoney(totalBalance, currency)}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Your combined net money across all balances.
          </p>
        </div>
      </div>
    </div>
  );
};
