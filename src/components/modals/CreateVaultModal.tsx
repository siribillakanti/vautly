import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { VaultCategory } from '../../types/vault';
import { CURRENCIES } from '../../utils/currency';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateVaultModal: React.FC<CreateVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createVault, currency } = useVaultContext();
  const symbol = CURRENCIES[currency]?.symbol || '$';

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('💻');
  const [color, setColor] = useState('#3B82F6');
  const [category, setCategory] = useState<VaultCategory>('lifestyle');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const iconPresets = ['💻', '✈️', '🐶', '🚗', '🎓', '🏠', '🍕', '💡', '🎮', '⌚', '🎨', '🚀'];
  const colorPresets = [
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#6366F1', // Indigo
    '#06B6D4', // Cyan
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createVault({
      title,
      icon,
      color,
      category,
      targetAmount: targetAmount ? Number(targetAmount) : undefined,
      notes: notes || undefined,
    });

    setTitle('');
    setTargetAmount('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-5 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-sans">Create Vault</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Set aside money for a specific purpose.
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
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Vault Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Laptop, Vacation, Emergency Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Icon Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconPresets.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`h-9 w-9 text-lg rounded-xl flex items-center justify-center border transition-all ${
                    icon === emoji
                      ? 'bg-gray-200 dark:bg-zinc-700 border-gray-400 dark:border-zinc-500'
                      : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 border-gray-900 dark:border-white shadow-sm' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Category & Goal Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VaultCategory)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="essential">Essential</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="growth">Growth</option>
                <option value="dream">Dream</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Goal Amount ({symbol})
              </label>
              <input
                type="number"
                min={1}
                placeholder="Optional, e.g. 5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Short description or goal note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Create Vault</span>
          </button>
        </form>
      </div>
    </div>
  );
};
