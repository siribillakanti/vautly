import React, { useState } from 'react';
import { VaultProvider, useVaultContext } from './context/VaultContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/views/HomeScreen';
import { PayScreen } from './components/views/PayScreen';
import { VaultsScreen } from './components/views/VaultsScreen';
import { TransactionsScreen } from './components/views/TransactionsScreen';
import { ProfileScreen } from './components/views/ProfileScreen';
import { CurrencyModal } from './components/modals/CurrencyModal';
import { CreateVaultModal } from './components/modals/CreateVaultModal';
import { VaultDetailModal } from './components/modals/VaultDetailModal';
import { DepositModal } from './components/modals/DepositModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { QRScannerModal } from './components/modals/QRScannerModal';
import { RequestMoneyModal } from './components/modals/RequestMoneyModal';
import { MyQRModal } from './components/modals/MyQRModal';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { SecurityLockScreen } from './components/modals/SecurityLockScreen';
import { Vault } from './types/vault';

const MainAppContent: React.FC = () => {
  const {
    theme,
    activeTab,
    isPaymentOpen,
    setIsPaymentOpen,
    isQRScannerOpen,
    setIsQRScannerOpen,
    isRequestMoneyOpen,
    setIsRequestMoneyOpen,
    isMyQROpen,
    setIsMyQROpen,
    selectedTxDetail,
    setSelectedTxDetail,
  } = useVaultContext();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'dark bg-zinc-950 text-white' : 'bg-[#F8FAFC] text-gray-900'
      } font-sans selection:bg-emerald-500 selection:text-white pb-24 md:pb-12`}
    >
      {/* Security App Lock Screen Overlay */}
      <SecurityLockScreen />

      {/* Top Navbar */}
      <Navbar
        onOpenCreateVault={() => setIsCreateVaultOpen(true)}
        onOpenCurrencyModal={() => setIsCurrencyOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeScreen
            onOpenDeposit={() => setIsDepositOpen(true)}
            onOpenCreateVault={() => setIsCreateVaultOpen(true)}
            onSelectVault={(v) => setSelectedVault(v)}
          />
        )}

        {activeTab === 'pay' && <PayScreen />}

        {activeTab === 'vaults' && (
          <VaultsScreen
            onOpenCreateVault={() => setIsCreateVaultOpen(true)}
            onSelectVault={(v) => setSelectedVault(v)}
          />
        )}

        {activeTab === 'transactions' && <TransactionsScreen />}

        {activeTab === 'profile' && (
          <ProfileScreen onOpenCurrencyModal={() => setIsCurrencyOpen(true)} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200/60 dark:border-zinc-800/80 py-8 text-center text-xs text-gray-400 dark:text-gray-500 font-sans">
        <p>Vautly • UPI Payments + Goal-Based Vaults • Simulated Demo Platform</p>
      </footer>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      <RequestMoneyModal
        isOpen={isRequestMoneyOpen}
        onClose={() => setIsRequestMoneyOpen(false)}
      />

      <MyQRModal
        isOpen={isMyQROpen}
        onClose={() => setIsMyQROpen(false)}
      />

      <TransactionDetailModal
        transaction={selectedTxDetail}
        onClose={() => setSelectedTxDetail(null)}
      />

      <CurrencyModal
        isOpen={isCurrencyOpen}
        onClose={() => setIsCurrencyOpen(false)}
      />

      <CreateVaultModal
        isOpen={isCreateVaultOpen}
        onClose={() => setIsCreateVaultOpen(false)}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
      />

      <VaultDetailModal
        vault={selectedVault}
        onClose={() => setSelectedVault(null)}
      />
    </div>
  );
};

export function App() {
  return (
    <VaultProvider>
      <MainAppContent />
    </VaultProvider>
  );
}

export default App;
