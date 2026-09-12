import React, { useState } from 'react';
import { X, QrCode, Camera, Upload, Sparkles, Store, Coffee, Laptop, ShoppingBag } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { openPaymentWithRecipient } = useVaultContext();
  const [activeTab, setActiveTab] = useState<'camera' | 'samples'>('camera');
  const [simulatedScanning, setSimulatedScanning] = useState(false);

  if (!isOpen) return null;

  const sampleQRs = [
    { name: 'ABC General Store', upiId: 'abcstore@upi', icon: Store, amount: 450, category: 'Groceries & Essentials' },
    { name: 'Coffee House Cafe', upiId: 'coffeehouse@upi', icon: Coffee, amount: 240, category: 'Food & Dining' },
    { name: 'Tech Accessories Hub', upiId: 'techhub@upi', icon: Laptop, amount: 1290, category: 'Electronics' },
    { name: 'City Supermarket', upiId: 'citysuper@upi', icon: ShoppingBag, amount: 890, category: 'Shopping' },
  ];

  const handleTriggerScan = (name: string, upiId: string, prefilledAmt?: number) => {
    setSimulatedScanning(true);
    setTimeout(() => {
      setSimulatedScanning(false);
      onClose();
      openPaymentWithRecipient(name, upiId, prefilledAmt);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-sans">Scan & Pay QR</h2>
              <p className="text-[11px] text-zinc-400">Point at any UPI QR code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-semibold text-zinc-400">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 border-b-2 text-center transition-all ${
              activeTab === 'camera'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-800/40'
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            Live Camera Simulation
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-3 border-b-2 text-center transition-all ${
              activeTab === 'samples'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-800/40'
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            Sample QRs (Demo)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              {/* Simulated Camera Viewfinder */}
              <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden border-2 border-zinc-700 bg-black flex items-center justify-center shadow-inner">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Laser Scanning Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-[pulse_2s_infinite]" />

                {/* Viewfinder Target Frame Corners */}
                <div className="absolute inset-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                </div>

                <div className="z-10 flex flex-col items-center space-y-2 p-4">
                  <Camera className="h-10 w-10 text-emerald-400/80 animate-pulse" />
                  <span className="text-xs text-zinc-400 font-medium">
                    {simulatedScanning ? 'Detecting Merchant Details...' : 'Align QR Code within frame'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Click any preset merchant below to simulate scanning a real-world payment QR code:
              </p>

              {/* Quick Scan Action Pills */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleTriggerScan('ABC General Store', 'abcstore@upi', 450)}
                  className="p-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-left transition-all group"
                >
                  <span className="text-lg block mb-1">🛍️</span>
                  <div className="font-bold text-xs text-white group-hover:text-emerald-400">ABC Store</div>
                  <span className="text-[10px] text-zinc-400 block font-mono">abcstore@upi</span>
                </button>

                <button
                  onClick={() => handleTriggerScan('Coffee House', 'coffeehouse@upi', 200)}
                  className="p-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-left transition-all group"
                >
                  <span className="text-lg block mb-1">☕</span>
                  <div className="font-bold text-xs text-white group-hover:text-emerald-400">Coffee House</div>
                  <span className="text-[10px] text-zinc-400 block font-mono">coffeehouse@upi</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-3">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                Tap to simulate instant QR payment scan:
              </span>

              {sampleQRs.map((qr) => {
                const IconComponent = qr.icon;
                return (
                  <button
                    key={qr.upiId}
                    onClick={() => handleTriggerScan(qr.name, qr.upiId, qr.amount)}
                    className="w-full p-4 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/70 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 font-sans">
                          {qr.name}
                        </h4>
                        <span className="text-xs text-zinc-400 font-mono block">{qr.upiId}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 block font-mono">
                        Scan QR
                      </span>
                      <span className="text-[10px] text-zinc-500">{qr.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
