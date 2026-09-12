import React, { useState } from 'react';
import { ArrowRightLeft, Check } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';

export const TransferBar: React.FC = () => {
  const { vaults, availableBalance, currency, transferMoney } = useVaultContext();

  const [amount, setAmount] = useState<number>(100);
  const [fromId, setFromId] = useState<string>('available');
  const [toId, setToId] = useState<string>(vaults[0]?.id || 'available');
  const [success, setSuccess] = useState(false);

  const activeVaults = vaults.filter((v) => !v.isArchived);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || fromId === toId) return;

    transferMoney(fromId, toId, Number(amount));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-800/90 p-5 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-sans">
          Transfer Money
        </h3>
      </div>

      <form onSubmit={handleTransfer} className="flex flex-col sm:flex-row items-center gap-3">
        {/* Amount Input */}
        <div className="w-full sm:w-36">
          <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
            Amount
          </label>
          <input
            type="number"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* From Select */}
        <div className="w-full sm:flex-1">
          <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
            From
          </label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
          >
            <option value="available">
              Available Balance ({formatMoney(availableBalance, currency)})
            </option>
            {activeVaults.map((v) => (
              <option key={v.id} value={v.id}>
                {v.icon} {v.title} ({formatMoney(v.reservedAmount, currency)})
              </option>
            ))}
          </select>
        </div>

        {/* To Select */}
        <div className="w-full sm:flex-1">
          <label className="block text-[10px] uppercase font-medium text-gray-400 mb-1">
            To
          </label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
          >
            <option value="available">Available Balance</option>
            {activeVaults.map((v) => (
              <option key={v.id} value={v.id}>
                {v.icon} {v.title}
              </option>
            ))}
          </select>
        </div>

        {/* Transfer Action Button */}
        <div className="w-full sm:w-auto sm:self-end">
          <button
            type="submit"
            disabled={fromId === toId}
            className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              success
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
            }`}
          >
            {success ? (
              <>
                <Check className="h-3.5 w-3.5" /> Transferred!
              </>
            ) : (
              <span>Transfer Money</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
