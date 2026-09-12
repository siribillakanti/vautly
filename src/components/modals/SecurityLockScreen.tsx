import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';

export const SecurityLockScreen: React.FC = () => {
  const { isAppLocked, unlockApp, user, appPin } = useVaultContext();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isAppLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = unlockApp(nextPin);
          if (!success) {
            setError(true);
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white p-6 font-sans">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Logo & Lock Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
            V
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Vautly Locked</h2>
            <p className="text-xs text-zinc-400 mt-1">Enter your 4-digit PIN to continue</p>
          </div>
        </div>

        {/* User Identity */}
        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 w-fit mx-auto">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{user.name} ({user.upiId})</span>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-4 py-3">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/50'
                  : 'border-zinc-700 bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-400 animate-bounce">
            Incorrect PIN. Default demo PIN is <code className="font-mono text-white">1234</code>.
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-xl font-bold text-white transition-all shadow-sm active:scale-95 border border-zinc-800/80"
            >
              {num}
            </button>
          ))}
          <div className="h-14" />
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-xl font-bold text-white transition-all shadow-sm active:scale-95 border border-zinc-800/80"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 transition-all border border-zinc-800/80"
          >
            ⌫
          </button>
        </div>

        <p className="text-[11px] text-zinc-500">
          Vautly Security Layer • UI Demo Lock
        </p>
      </div>
    </div>
  );
};
