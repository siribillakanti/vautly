import React from 'react';
import {
  QrCode,
  Send,
  ArrowDownLeft,
  AtSign,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';
import { VaultCard } from '../dashboard/VaultCard';

interface HomeScreenProps {
  onOpenDeposit: () => void;
  onOpenCreateVault: () => void;
  onSelectVault: (vault: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenDeposit,
  onOpenCreateVault,
  onSelectVault,
}) => {
  const {
    user,
    availableBalance,
    totalReserved,
    totalBalance,
    currency,
    vaults,
    transactions,
    setActiveTab,
    setIsPaymentOpen,
    setIsQRScannerOpen,
    setIsRequestMoneyOpen,
    setIsMyQROpen,
    setSelectedTxDetail,
    openPaymentWithRecipient,
  } = useVaultContext();

  const activeVaults = vaults.filter((v) => !v.isArchived);

  // Pick top insight rule
  const topVaultWithTarget = activeVaults.find((v) => v.targetAmount && v.reservedAmount < v.targetAmount);
  let insightText = "Your financial reserves are healthy and ready for seamless UPI spending.";
  if (topVaultWithTarget && topVaultWithTarget.targetAmount) {
    const rem = topVaultWithTarget.targetAmount - topVaultWithTarget.reservedAmount;
    const pct = Math.round((topVaultWithTarget.reservedAmount / topVaultWithTarget.targetAmount) * 100);
    insightText = `Your ${topVaultWithTarget.title} Vault is ${pct}% complete. You need ${formatMoney(rem, currency)} more to reach your goal.`;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
            Good morning, {user.name} 👋
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            UPI ID: <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{user.upiId}</span>
          </p>
        </div>

        <button
          onClick={() => setIsMyQROpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all shadow-sm"
        >
          <QrCode className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">My QR Code</span>
        </button>
      </div>

      {/* 1. HERO BALANCE HUD (Primary focus: Available Balance ₹12,450) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Available Balance */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-xl shadow-emerald-600/15 relative overflow-hidden flex flex-col justify-between space-y-6">
          {/* Subtle background glow circle */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/90 font-sans flex items-center gap-1.5">
                <Wallet className="h-4 w-4" /> Available Balance
              </span>
              <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                Ready to Spend via UPI
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans mt-2">
              {formatMoney(availableBalance, currency)}
            </div>

            <p className="text-xs text-emerald-100/80 mt-2 font-medium">
              Unassigned spendable funds. Ready for instant QR & UPI payment transfers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <QrCode className="h-4 w-4 text-emerald-600" />
              <span>Scan & Pay Now</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="px-4 py-2.5 rounded-2xl bg-emerald-800/40 hover:bg-emerald-800/60 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Money</span>
            </button>
          </div>
        </div>

        {/* Combined Reserves & Total Net Worth */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="rounded-3xl bg-white dark:bg-zinc-800/90 p-5 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Reserved in Vaults
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                {activeVaults.length} Active Goal Vaults
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              {formatMoney(totalReserved, currency)}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Earmarked goal savings available for payment allocation.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-zinc-800/90 p-5 border border-gray-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Net Worth
              </span>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                Available + Vaults
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              {formatMoney(totalBalance, currency)}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Combined financial position in Vautly.
            </p>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY QUICK PAYMENT ACTIONS */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Action 1: Scan QR */}
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Scan QR
              </span>
              <span className="text-[10px] text-gray-400">Instant merchant pay</span>
            </div>
          </button>

          {/* Action 2: Send Money */}
          <button
            onClick={() => {
              setIsPaymentOpen(true);
            }}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Send Money
              </span>
              <span className="text-[10px] text-gray-400">Peer-to-peer transfer</span>
            </div>
          </button>

          {/* Action 3: Request */}
          <button
            onClick={() => setIsRequestMoneyOpen(true)}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Request
              </span>
              <span className="text-[10px] text-gray-400">Ask money from contact</span>
            </div>
          </button>

          {/* Action 4: Pay UPI ID */}
          <button
            onClick={() => {
              setIsPaymentOpen(true);
            }}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-purple-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AtSign className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block group-hover:text-purple-600 dark:group-hover:text-purple-400">
                Pay UPI ID
              </span>
              <span className="text-[10px] text-gray-400">Direct VPA payment</span>
            </div>
          </button>

          {/* Action 5: Contacts */}
          <button
            onClick={() => setActiveTab('pay')}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-pink-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block group-hover:text-pink-600 dark:group-hover:text-pink-400">
                Contacts
              </span>
              <span className="text-[10px] text-gray-400">Saved payee list</span>
            </div>
          </button>

          {/* Action 6: My QR */}
          <button
            onClick={() => setIsMyQROpen(true)}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-200/80 dark:border-zinc-700/80 hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400">
                My QR
              </span>
              <span className="text-[10px] text-gray-400">Show to receive pay</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. SMART VAULT INSIGHTS BANNER */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 block font-sans">
            Smart Vault Insight
          </span>
          <p className="text-emerald-700 dark:text-emerald-300 mt-0.5 leading-relaxed">
            {insightText}
          </p>
        </div>
      </div>

      {/* 4. YOUR VAULTS SUMMARY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              Your Goal Vaults
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Goal-based money allocations inside your payment app
            </p>
          </div>

          <button
            onClick={() => setActiveTab('vaults')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Vaults</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeVaults.slice(0, 3).map((vault) => (
            <VaultCard key={vault.id} vault={vault} onSelect={onSelectVault} />
          ))}
        </div>
      </div>

      {/* 5. RECENT TRANSACTIONS PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              Recent Transactions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live activity & payment records
            </p>
          </div>

          <button
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Activity</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {transactions.slice(0, 4).map((tx) => {
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
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
                      isSent
                        ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                        : isReceived
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}
                  >
                    {isSent ? '↓' : isReceived ? '↑' : '⇄'}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-900 dark:text-white block font-sans">
                      {tx.recipientName || tx.senderName || tx.description}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="font-mono">{tx.paymentSource || tx.toTitle || tx.fromTitle || 'UPI'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className={`font-bold text-sm block ${isSent ? 'text-red-500' : isReceived ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                    {isSent ? '-' : isReceived ? '+' : ''}{formatMoney(tx.amount, currency)}
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">{tx.txId}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
