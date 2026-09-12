import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { CURRENCIES } from '../../utils/currency';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { depositCash, currency } = useVaultContext();
  const symbol = CURRENCIES[currency]?.symbol || '$';

  const [amount, setAmount] = useState<number>(1000);
  const [description, setDescription] = useState('Monthly Deposit');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    depositCash(Number(amount), description);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-5 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-sans">Add Money to Available</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Increase your unassigned spendable balance.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Deposit Amount ({symbol})
            </label>
            <input
              type="number"
              min={1}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Salary, Client Payout"
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Money</span>
          </button>
        </form>
      </div>
    </div>
  );
};
