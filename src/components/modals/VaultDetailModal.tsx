import React, { useState } from 'react';
import { X, ArrowRightLeft, Archive, Trash2 } from 'lucide-react';
import { Vault } from '../../types/vault';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';

interface VaultDetailModalProps {
  vault: Vault | null;
  onClose: () => void;
}

export const VaultDetailModal: React.FC<VaultDetailModalProps> = ({
  vault,
  onClose,
}) => {
  const { currency, availableBalance, transferMoney, archiveVault, deleteVault } = useVaultContext();

  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [direction, setDirection] = useState<'add' | 'withdraw'>('add');

  if (!vault) return null;

  const target = vault.targetAmount || 0;
  const percentage = target > 0 ? Math.min(100, Math.round((vault.reservedAmount / target) * 100)) : 100;

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustAmount <= 0) return;

    if (direction === 'add') {
      if (availableBalance < adjustAmount) return;
      transferMoney('available', vault.id, Number(adjustAmount));
    } else {
      if (vault.reservedAmount < adjustAmount) return;
      transferMoney(vault.id, 'available', Number(adjustAmount));
    }
  };

  const handleArchive = () => {
    archiveVault(vault.id);
    onClose();
  };

  const handleDelete = () => {
    deleteVault(vault.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-6 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-zinc-800 text-2xl border border-gray-200/50 dark:border-zinc-700/50">
              {vault.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans">{vault.title}</h2>
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {vault.category} Vault
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Saved & Goal Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/50">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
              Saved Amount
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatMoney(vault.reservedAmount, currency)}
            </span>
          </div>

          {target > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                Target Goal
              </span>
              <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {formatMoney(target, currency)}
              </span>
            </div>
          )}
        </div>

        {/* Minimal Progress Bar */}
        {target > 0 && (
          <div className="space-y-1.5">
            <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: vault.color || '#3B82F6',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>{percentage}% achieved</span>
              {vault.reservedAmount < target && (
                <span>{formatMoney(target - vault.reservedAmount, currency)} remaining</span>
              )}
            </div>
          </div>
        )}

        {/* Quick Add / Withdraw Form */}
        <form onSubmit={handleAdjust} className="space-y-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Adjust Reserved Money
            </span>
            <div className="flex rounded-xl bg-gray-100 dark:bg-zinc-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setDirection('add')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  direction === 'add'
                    ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Add Money
              </button>
              <button
                type="button"
                onClick={() => setDirection('withdraw')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  direction === 'withdraw'
                    ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Withdraw
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              required
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(Number(e.target.value))}
              className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Confirm</span>
            </button>
          </div>
        </form>

        {/* Archive & Delete Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs">
          <button
            onClick={handleArchive}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Archive className="h-3.5 w-3.5" /> Archive Vault
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-600 dark:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Vault
          </button>
        </div>
      </div>
    </div>
  );
};
