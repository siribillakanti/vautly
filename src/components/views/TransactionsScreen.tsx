import React, { useState } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Search, Filter } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';
import { Transaction } from '../../types/vault';

export const TransactionsScreen: React.FC = () => {
  const { transactions, currency, setSelectedTxDetail } = useVaultContext();
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received' | 'transfer'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics derived metrics
  const totalSent = transactions
    .filter((t) => t.type === 'sent' && t.status === 'successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t) => t.type === 'received' && t.status === 'successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransferred = transactions
    .filter((t) => t.type === 'transfer' && t.status === 'successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTxs = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.txId.toLowerCase().includes(q) ||
        tx.recipientName?.toLowerCase().includes(q) ||
        tx.senderName?.toLowerCase().includes(q) ||
        tx.paymentSource?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
          Transaction Activity
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Detailed log of payments, money requests, transfers, and receipts
        </p>
      </div>

      {/* 1. ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
            Total Money Sent
          </span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-sans">
            {formatMoney(totalSent, currency)}
          </div>
          <p className="text-[11px] text-gray-400">UPI payments & outgoing transfers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
            Total Money Received
          </span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-sans">
            {formatMoney(totalReceived, currency)}
          </div>
          <p className="text-[11px] text-gray-400">Peer-to-peer incoming transfers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
            Allocated to Vaults
          </span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-sans">
            {formatMoney(totalTransferred, currency)}
          </div>
          <p className="text-[11px] text-gray-400">Goal reserve additions</p>
        </div>
      </div>

      {/* 2. SPENDING CATEGORIES ANALYTICS BAR */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-sans">
          Spending Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <span className="text-gray-400 block text-[10px]">Groceries & Dining</span>
            <span className="font-bold text-gray-900 dark:text-white font-mono mt-0.5 block">{formatMoney(650, currency)}</span>
            <div className="w-full h-1.5 rounded-full bg-emerald-500 mt-2" />
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <span className="text-gray-400 block text-[10px]">Travel & Vacation</span>
            <span className="font-bold text-gray-900 dark:text-white font-mono mt-0.5 block">{formatMoney(350, currency)}</span>
            <div className="w-full h-1.5 rounded-full bg-pink-500 mt-2" />
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <span className="text-gray-400 block text-[10px]">Tech & Gear</span>
            <span className="font-bold text-gray-900 dark:text-white font-mono mt-0.5 block">{formatMoney(750, currency)}</span>
            <div className="w-full h-1.5 rounded-full bg-blue-500 mt-2" />
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <span className="text-gray-400 block text-[10px]">Pet & General</span>
            <span className="font-bold text-gray-900 dark:text-white font-mono mt-0.5 block">{formatMoney(200, currency)}</span>
            <div className="w-full h-1.5 rounded-full bg-amber-500 mt-2" />
          </div>
        </div>
      </div>

      {/* 3. TRANSACTIONS LIST & FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Activity' },
              { id: 'sent', label: 'Paid / Sent' },
              { id: 'received', label: 'Received' },
              { id: 'transfer', label: 'Vault Transfers' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterType === f.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Transactions Items */}
        {filteredTxs.length > 0 ? (
          <div className="space-y-2.5">
            {filteredTxs.map((tx) => {
              const isSent = tx.type === 'sent';
              const isReceived = tx.type === 'received';
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxDetail(tx)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-gray-300 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        isSent
                          ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                          : isReceived
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {isSent ? <ArrowUpRight className="h-5 w-5" /> : isReceived ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowRightLeft className="h-5 w-5" />}
                    </div>

                    <div>
                      <span className="font-bold text-xs text-gray-900 dark:text-white block font-sans">
                        {tx.description}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span className="font-mono">{tx.txId}</span>
                        <span>•</span>
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className={`font-bold text-sm block ${isSent ? 'text-red-500' : isReceived ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                      {isSent ? '-' : isReceived ? '+' : ''}{formatMoney(tx.amount, currency)}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                      ✓ {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-800/50 border border-gray-200/80 dark:border-zinc-700/80 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No transaction records found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
