import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, QrCode } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';

interface MyQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyQRModal: React.FC<MyQRModalProps> = ({ isOpen, onClose }) => {
  const { user } = useVaultContext();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 text-center space-y-5 text-gray-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400"
        >
          <X className="h-5 w-5" />
        </button>

        {/* User Badge Header */}
        <div className="pt-2">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-800">
            {user.name[0]}
          </div>
          <h3 className="text-lg font-bold font-sans mt-2">{user.name}</h3>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full inline-block mt-1">
            {user.upiId}
          </span>
        </div>

        {/* High Precision QR Visual Card */}
        <div className="p-5 rounded-3xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200/80 dark:border-zinc-700/80 space-y-3 shadow-inner">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mx-auto w-56 h-56 flex flex-col items-center justify-center relative group">
            {/* Simulated Clean QR Code Graphic */}
            <div className="grid grid-cols-5 gap-1.5 w-44 h-44 p-2 bg-gray-900 rounded-xl relative">
              {/* Corner position markers */}
              <div className="col-span-2 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <div className="w-full h-full bg-gray-900 rounded-sm p-1">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
              </div>
              <div className="col-span-1 bg-transparent" />
              <div className="col-span-2 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <div className="w-full h-full bg-gray-900 rounded-sm p-1">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
              </div>

              <div className="col-span-5 flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  V
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <div className="w-full h-full bg-gray-900 rounded-sm p-1">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
              </div>
              <div className="col-span-3 bg-white/20 rounded-lg flex items-center justify-center text-[10px] text-white font-mono">
                VAUTLY
              </div>
            </div>

            <p className="text-[10px] text-gray-400 font-medium mt-2">Scan with any UPI app</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
          </button>

          <button
            onClick={() => alert('Personal QR ready for sharing.')}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Share2 className="h-4 w-4" />
            <span>Share QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
