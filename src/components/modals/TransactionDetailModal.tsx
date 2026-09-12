import React from 'react';
import { X, CheckCircle2, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, ShieldCheck, Share2 } from 'lucide-react';
import { Transaction } from '../../types/vault';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney } from '../../utils/currency';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const { currency } = useVaultContext();

  if (!transaction) return null;

  const isSent = transaction.type === 'sent';
  const isReceived = transaction.type === 'received';
  const isTransfer = transaction.type === 'transfer';
  const isDeposit = transaction.type === 'deposit';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 space-y-6 text-gray-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Transaction Header */}
        <div className="text-center space-y-2 pt-2">
          <div
            className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${
              isSent
                ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                : isReceived
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
            }`}
          >
            {isSent ? <ArrowUpRight className="h-7 w-7" /> : isReceived ? <ArrowDownLeft className="h-7 w-7" /> : <ArrowRightLeft className="h-7 w-7" />}
          </div>

          <div className="text-3xl font-extrabold font-sans">
            {isSent ? '-' : isReceived ? '+' : ''}{formatMoney(transaction.amount, currency)}
          </div>

          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            {transaction.description}
          </p>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" /> Successful
          </span>
        </div>

        {/* Receipt Details Breakdown */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/60 text-xs space-y-3 font-mono">
          <div className="flex justify-between border-b border-gray-200/60 dark:border-zinc-700/60 pb-2">
            <span className="text-gray-400">Transaction Ref</span>
            <span className="font-bold text-gray-900 dark:text-white">{transaction.txId}</span>
          </div>

          {transaction.recipientUpiId && (
            <div className="flex justify-between">
              <span className="text-gray-400">Paid To</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 font-sans">
                {transaction.recipientName} ({transaction.recipientUpiId})
              </span>
            </div>
          )}

          {transaction.senderUpiId && (
            <div className="flex justify-between">
              <span className="text-gray-400">Received From</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 font-sans">
                {transaction.senderName} ({transaction.senderUpiId})
              </span>
            </div>
          )}

          {transaction.paymentSource && (
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Source</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-sans">
                {transaction.paymentSource}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-400">Date & Time</span>
            <span className="text-gray-700 dark:text-gray-300">
              {new Date(transaction.timestamp).toLocaleString()}
            </span>
          </div>

          {transaction.note && (
            <div className="flex justify-between border-t border-gray-200/60 dark:border-zinc-700/60 pt-2">
              <span className="text-gray-400">Note</span>
              <span className="text-gray-700 dark:text-gray-200 italic font-sans">{transaction.note}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert(`Receipt ${transaction.txId} copied.`)}
            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1.5"
          >
            <Share2 className="h-4 w-4" /> Share Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
