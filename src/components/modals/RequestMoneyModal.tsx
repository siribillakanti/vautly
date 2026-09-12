import React, { useState } from 'react';
import { X, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { CURRENCIES, formatMoney } from '../../utils/currency';

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({ isOpen, onClose }) => {
  const { currency, contacts, processRequest } = useVaultContext();
  const symbol = CURRENCIES[currency]?.symbol || '₹';

  const [recipientName, setRecipientName] = useState('');
  const [recipientUpiId, setRecipientUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [reqTxId, setReqTxId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!recipientUpiId || numAmt <= 0) return;

    const res = processRequest({
      recipientName: recipientName || recipientUpiId.split('@')[0],
      recipientUpiId,
      amount: numAmt,
      note,
    });

    if (res.success && res.transaction) {
      setReqTxId(res.transaction.txId);
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setRecipientName('');
    setRecipientUpiId('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans">Request Money</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Request payment via UPI</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Request From (UPI ID / Contact)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ananya@vautly"
                value={recipientUpiId}
                onChange={(e) => {
                  setRecipientUpiId(e.target.value);
                  if (!recipientName) setRecipientName(e.target.value.split('@')[0]);
                }}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none"
              />

              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {contacts.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setRecipientName(c.name);
                      setRecipientUpiId(c.upiId);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 shrink-0"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Requested Amount ({symbol})
              </label>
              <input
                type="number"
                min={1}
                required
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-base font-bold text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch split, Event ticket"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Send Payment Request
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Request Sent!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sent request of {formatMoney(Number(amount), currency)} to {recipientName || recipientUpiId}
              </p>
              <p className="text-[11px] font-mono text-gray-400 mt-2">Ref: {reqTxId}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
