import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Wallet, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { formatMoney, CURRENCIES } from '../../utils/currency';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const {
    availableBalance,
    vaults,
    currency,
    processPayment,
    paymentPreset,
    setPaymentPreset,
    contacts,
  } = useVaultContext();

  const symbol = CURRENCIES[currency]?.symbol || '₹';

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [recipientUpiId, setRecipientUpiId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [paymentSourceId, setPaymentSourceId] = useState<string>('available');
  const [note, setNote] = useState('');

  // Flow Step: 'details' | 'pin' | 'processing' | 'success'
  const [step, setStep] = useState<'details' | 'pin' | 'processing' | 'success'>('details');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdTxId, setCreatedTxId] = useState<string>('');

  const activeVaults = vaults.filter((v) => !v.isArchived && v.reservedAmount > 0);

  // Initialize or preset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setPin('');
      setErrorMessage(null);
      if (paymentPreset) {
        if (paymentPreset.recipientName) setRecipientName(paymentPreset.recipientName);
        if (paymentPreset.recipientUpiId) setRecipientUpiId(paymentPreset.recipientUpiId);
        if (paymentPreset.amount) setAmount(paymentPreset.amount.toString());
        if (paymentPreset.paymentSourceId) setPaymentSourceId(paymentPreset.paymentSourceId);
      } else {
        setRecipientName('');
        setRecipientUpiId('');
        setAmount('');
        setPaymentSourceId('available');
      }
    }
  }, [isOpen, paymentPreset]);

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;

  // Selected source check
  const selectedVault = paymentSourceId !== 'available' ? vaults.find((v) => v.id === paymentSourceId) : null;
  const maxAvailable = selectedVault ? selectedVault.reservedAmount : availableBalance;
  const isInsufficient = numAmount > 0 && numAmount > maxAvailable;

  const handleSelectContact = (c: typeof contacts[0]) => {
    setRecipientName(c.name);
    setRecipientUpiId(c.upiId);
  };

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!recipientUpiId.trim()) {
      setErrorMessage('Please enter a valid UPI ID or select a contact.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMessage('Please enter a valid payment amount.');
      return;
    }
    if (isInsufficient) {
      setErrorMessage(`Insufficient funds in selected source. Available: ${formatMoney(maxAvailable, currency)}`);
      return;
    }

    setStep('pin');
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirmPin = () => {
    if (pin.length !== 4) return;
    setStep('processing');
    setErrorMessage(null);

    setTimeout(() => {
      const res = processPayment({
        recipientName: recipientName || recipientUpiId.split('@')[0] || 'Recipient',
        recipientUpiId,
        amount: numAmount,
        paymentSourceId,
        note,
        pin,
      });

      if (res.success && res.transaction) {
        setCreatedTxId(res.transaction.txId);
        setStep('success');
      } else {
        setStep('pin');
        setPin('');
        setErrorMessage(res.error || 'Payment failed. Please check PIN.');
      }
    }, 800);
  };

  const handleClose = () => {
    setPaymentPreset(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-gray-900 dark:text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans tracking-tight">
                {step === 'success' ? 'Payment Successful' : step === 'pin' ? 'Enter Vautly PIN' : 'Send Payment'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {step === 'success' ? 'Transaction complete' : step === 'pin' ? '4-digit payment PIN' : 'UPI Instant Money Transfer'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-200/60 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: PAYMENT DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPin} className="space-y-5">
              {/* Recipient UPI ID / Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Payee / UPI ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul@vautly, abcstore@upi"
                    value={recipientUpiId}
                    onChange={(e) => {
                      setRecipientUpiId(e.target.value);
                      if (!recipientName) setRecipientName(e.target.value.split('@')[0]);
                    }}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Quick Select Recent Contacts */}
                <div className="mt-3">
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 block mb-2">
                    Or select from Recent People:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {contacts.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectContact(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition-all ${
                          recipientUpiId === c.upiId
                            ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <span className="text-base">{c.isMerchant ? c.avatar : '👤'}</span>
                        <div className="text-left">
                          <div className="font-semibold leading-none">{c.name}</div>
                          <div className="text-[9px] text-gray-400">{c.upiId}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Amount ({symbol})
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-2xl font-bold text-gray-400">{symbol}</span>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-2xl font-bold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex gap-2 mt-2">
                  {[100, 500, 1000, 2000].map((quickAmt) => (
                    <button
                      key={quickAmt}
                      type="button"
                      onClick={() => setAmount(quickAmt.toString())}
                      className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      +{symbol}{quickAmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* PAYMENT SOURCE SELECTION (Key Vautly feature!) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Choose Payment Source
                  </label>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Vault-Integrated Payment
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {/* Option 1: Vautly Balance */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentSourceId === 'available'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentSource"
                        value="available"
                        checked={paymentSourceId === 'available'}
                        onChange={() => setPaymentSourceId('available')}
                        className="accent-emerald-600 h-4 w-4"
                      />
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-gray-900 dark:text-white block">
                          Vautly Main Balance
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          Unassigned ready funds
                        </span>
                      </div>
                    </div>

                    <span className="font-bold text-xs text-gray-900 dark:text-white font-mono">
                      {formatMoney(availableBalance, currency)}
                    </span>
                  </label>

                  {/* Option 2+: Eligible Vaults */}
                  {activeVaults.map((vault) => (
                    <label
                      key={vault.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentSourceId === vault.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                          : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentSource"
                          value={vault.id}
                          checked={paymentSourceId === vault.id}
                          onChange={() => setPaymentSourceId(vault.id)}
                          className="accent-blue-600 h-4 w-4"
                        />
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-200 dark:bg-zinc-700 text-sm">
                          {vault.icon}
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-gray-900 dark:text-white block">
                            {vault.title} Vault
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            Goal reserve money
                          </span>
                        </div>
                      </div>

                      <span className="font-bold text-xs text-gray-900 dark:text-white font-mono">
                        {formatMoney(vault.reservedAmount, currency)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Add a Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner split, Rent, Shopping"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isInsufficient}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Proceed to Pay {numAmount > 0 ? formatMoney(numAmount, currency) : ''}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PIN VERIFICATION KEYPAD */}
          {step === 'pin' && (
            <div className="space-y-6 text-center py-2">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest block">
                  Paying {formatMoney(numAmount, currency)} to
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-sans">
                  {recipientName || recipientUpiId}
                </h3>
                <p className="text-xs font-mono text-gray-400">{recipientUpiId}</p>
              </div>

              {/* PIN Indicator Dots */}
              <div className="flex justify-center items-center gap-4 py-4">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                      pin.length > idx
                        ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm'
                        : 'border-gray-300 dark:border-zinc-600 bg-transparent'
                    }`}
                  />
                ))}
              </div>

              {/* Error badge if wrong pin */}
              {errorMessage && (
                <p className="text-xs font-semibold text-red-500 dark:text-red-400 animate-bounce">
                  {errorMessage}
                </p>
              )}

              <p className="text-[11px] text-gray-400 italic">
                Demo PIN: <strong className="text-gray-600 dark:text-gray-200 font-mono">1234</strong>
              </p>

              {/* Simulated Keypad */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num)}
                    className="h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-lg font-bold text-gray-900 dark:text-white transition-all active:scale-95 shadow-sm"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-500 dark:text-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-lg font-bold text-gray-900 dark:text-white transition-all active:scale-95 shadow-sm"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  ⌫
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmPin}
                disabled={pin.length !== 4}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Payment
              </button>
            </div>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <RefreshCw className="h-12 w-12 text-emerald-500 animate-spin" />
              <h3 className="text-base font-bold font-sans">Processing UPI Payment...</h3>
              <p className="text-xs text-gray-400">Verifying security token and updating balances</p>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-6">
              {/* Checkmark Animation */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                  Payment Successful
                </span>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-sans mt-1">
                  {formatMoney(numAmount, currency)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Sent to <strong className="text-gray-800 dark:text-gray-200">{recipientName}</strong> ({recipientUpiId})
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/70 border border-gray-100 dark:border-zinc-700/60 text-xs space-y-2.5 text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{createdTxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Source</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {paymentSourceId === 'available' ? 'Vautly Balance' : selectedVault?.title + ' Vault'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Timestamp</span>
                  <span className="text-gray-600 dark:text-gray-300">{new Date().toLocaleTimeString()}</span>
                </div>
                {note && (
                  <div className="flex justify-between border-t border-gray-200/60 dark:border-zinc-700/60 pt-2">
                    <span className="text-gray-400">Note</span>
                    <span className="text-gray-700 dark:text-gray-200 italic font-sans">{note}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-md transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
