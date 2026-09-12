import React from 'react';
import { CurrencyCode } from '../../types/vault';
import { CURRENCIES } from '../../utils/currency';
import { useVaultContext } from '../../context/VaultContext';
import { Globe, Check, X } from 'lucide-react';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({ isOpen, onClose }) => {
  const { currency, setCurrency } = useVaultContext();

  if (!isOpen) return null;

  const currencyList = Object.values(CURRENCIES);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-6 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-900 dark:text-white font-bold">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans">What currency do you use?</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select your preferred currency for Vaultly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {currencyList.map((item) => {
            const isSelected = currency === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-zinc-800/90 shadow-sm'
                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div>
                  <span className="text-xl font-bold font-mono block text-gray-900 dark:text-white">
                    {item.symbol} {item.code}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                    {item.name}
                  </span>
                </div>

                {isSelected && (
                  <div className="h-6 w-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
