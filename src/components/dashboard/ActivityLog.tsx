import React from 'react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';
import { History, ArrowRightLeft, ArrowDownLeft } from 'lucide-react';

export const ActivityLog: React.FC = () => {
  const { transactions, currency } = useVaultContext();

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-800/90 p-6 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-sans">
            Recent Activity
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          {transactions.length} records
        </span>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-2.5">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-700/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'deposit'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {tx.type === 'deposit' ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRightLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">
                    {tx.description}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <span className="font-bold text-gray-900 dark:text-white font-mono">
                {formatMoney(tx.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          No recent activity recorded yet.
        </p>
      )}
    </div>
  );
};
