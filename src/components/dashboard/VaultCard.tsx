import React from 'react';
import { Vault } from '../../types/vault';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';
import { ArrowRightLeft } from 'lucide-react';

interface VaultCardProps {
  vault: Vault;
  onSelect: (vault: Vault) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, onSelect }) => {
  const { currency } = useVaultContext();

  const target = vault.targetAmount || 0;
  const percentage = target > 0 ? Math.min(100, Math.round((vault.reservedAmount / target) * 100)) : 100;

  return (
    <div
      onClick={() => onSelect(vault)}
      className="group relative rounded-2xl bg-white dark:bg-zinc-800/90 p-6 border border-gray-200/80 dark:border-zinc-700/80 hover:border-gray-300 dark:hover:border-zinc-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-700 text-2xl border border-gray-200/50 dark:border-zinc-600/50">
              {vault.icon || '💰'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-tight font-sans">
                {vault.title}
              </h3>
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {vault.category}
              </span>
            </div>
          </div>
        </div>

        {/* Notes if present */}
        {vault.notes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-4 italic">
            {vault.notes}
          </p>
        )}

        {/* Saved Amount vs Goal Amount */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
              Saved
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
              {formatMoney(vault.reservedAmount, currency)}
            </span>
          </div>

          {target > 0 && (
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
                Goal
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {formatMoney(target, currency)}
              </span>
            </div>
          )}
        </div>

        {/* Minimal Thin Progress Bar */}
        {target > 0 && (
          <div className="space-y-1.5 mt-3">
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: vault.color || '#3B82F6',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 font-medium">
              <span>{percentage}% complete</span>
              {vault.reservedAmount < target && (
                <span>{formatMoney(target - vault.reservedAmount, currency)} remaining</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Manage Action */}
      <div className="pt-2 border-t border-gray-100 dark:border-zinc-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        <span className="font-medium">View & Adjust</span>
        <ArrowRightLeft className="h-3.5 w-3.5" />
      </div>
    </div>
  );
};
