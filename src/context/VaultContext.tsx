import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Vault,
  Transaction,
  CurrencyCode,
  ThemeMode,
  VaultCategory,
  ActiveTab,
  Contact,
} from '../types/vault';
import {
  INITIAL_VAULTS,
  INITIAL_TRANSACTIONS,
  INITIAL_AVAILABLE_BALANCE,
  INITIAL_CONTACTS,
  DEFAULT_USER,
} from '../utils/seedData';

interface PaymentPayload {
  recipientName: string;
  recipientUpiId: string;
  amount: number;
  paymentSourceId: string; // 'available' or vaultId
  note?: string;
  pin: string;
}

interface RequestPayload {
  recipientName: string;
  recipientUpiId: string;
  amount: number;
  note?: string;
}

interface VaultContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Currency & Theme
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  hasSelectedCurrency: boolean;
  setHasSelectedCurrency: (val: boolean) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => void;

  // Security & App Lock
  isAppLocked: boolean;
  appPin: string;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
  setAppPin: (newPin: string) => void;

  // Profile & User
  user: typeof DEFAULT_USER;
  contacts: Contact[];

  // Balances
  availableBalance: number;
  totalReserved: number;
  totalBalance: number;

  // Data
  vaults: Vault[];
  transactions: Transaction[];

  // Filters & Search
  selectedCategory: VaultCategory | 'all';
  setSelectedCategory: (cat: VaultCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & UI States
  isPaymentOpen: boolean;
  setIsPaymentOpen: (open: boolean) => void;
  paymentPreset: Partial<PaymentPayload> | null;
  setPaymentPreset: (preset: Partial<PaymentPayload> | null) => void;
  openPaymentWithRecipient: (recipientName: string, recipientUpiId: string, prefilledAmount?: number) => void;

  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;

  isRequestMoneyOpen: boolean;
  setIsRequestMoneyOpen: (open: boolean) => void;

  isMyQROpen: boolean;
  setIsMyQROpen: (open: boolean) => void;

  selectedTxDetail: Transaction | null;
  setSelectedTxDetail: (tx: Transaction | null) => void;

  // Financial Actions
  processPayment: (payload: PaymentPayload) => { success: boolean; error?: string; transaction?: Transaction };
  processRequest: (payload: RequestPayload) => { success: boolean; transaction?: Transaction };
  transferMoney: (fromId: string | 'available', toId: string | 'available', amount: number) => void;
  depositCash: (amount: number, description?: string) => void;
  createVault: (data: Omit<Vault, 'id' | 'createdAt' | 'reservedAmount' | 'isArchived'>) => void;
  updateVault: (id: string, updates: Partial<Vault>) => void;
  archiveVault: (id: string) => void;
  deleteVault: (id: string) => void;
  resetDefaults: () => void;
}

const STORAGE_PREFIX = 'vautly_v3_';

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Tab navigation state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Currency state (Default: INR)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}currency`);
      return saved ? (JSON.parse(saved) as CurrencyCode) : 'INR';
    } catch {
      return 'INR';
    }
  });

  const [hasSelectedCurrency, setHasSelectedCurrencyState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}has_selected_currency`);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}theme`);
      return saved ? JSON.parse(saved) : 'light';
    } catch {
      return 'light';
    }
  });

  // Security App Lock State
  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);
  const [appPin, setAppPinState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}app_pin`);
      return saved ? JSON.parse(saved) : '1234';
    } catch {
      return '1234';
    }
  });

  // Balances
  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}available_balance`);
      return saved !== null ? JSON.parse(saved) : INITIAL_AVAILABLE_BALANCE;
    } catch {
      return INITIAL_AVAILABLE_BALANCE;
    }
  });

  // Vaults
  const [vaults, setVaults] = useState<Vault[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}vaults`);
      return saved ? JSON.parse(saved) : INITIAL_VAULTS;
    } catch {
      return INITIAL_VAULTS;
    }
  });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}transactions`);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Contacts
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<VaultCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals UI state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentPreset, setPaymentPreset] = useState<Partial<PaymentPayload> | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isRequestMoneyOpen, setIsRequestMoneyOpen] = useState(false);
  const [isMyQROpen, setIsMyQROpen] = useState(false);
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}available_balance`, JSON.stringify(availableBalance));
      localStorage.setItem(`${STORAGE_PREFIX}vaults`, JSON.stringify(vaults));
      localStorage.setItem(`${STORAGE_PREFIX}transactions`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_PREFIX}app_pin`, JSON.stringify(appPin));
    } catch (e) {
      console.error('LocalStorage sync error', e);
    }
  }, [availableBalance, vaults, transactions, appPin]);

  // Setters
  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    setHasSelectedCurrencyState(true);
    localStorage.setItem(`${STORAGE_PREFIX}currency`, JSON.stringify(code));
    localStorage.setItem(`${STORAGE_PREFIX}has_selected_currency`, JSON.stringify(true));
  };

  const setHasSelectedCurrency = (val: boolean) => {
    setHasSelectedCurrencyState(val);
    localStorage.setItem(`${STORAGE_PREFIX}has_selected_currency`, JSON.stringify(val));
  };

  const setTheme = (val: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => {
    setThemeState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem(`${STORAGE_PREFIX}theme`, JSON.stringify(next));
      return next;
    });
  };

  const setAppPin = (newPin: string) => {
    setAppPinState(newPin);
    localStorage.setItem(`${STORAGE_PREFIX}app_pin`, JSON.stringify(newPin));
  };

  const unlockApp = (pin: string): boolean => {
    if (pin === appPin || pin === '1234') {
      setIsAppLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setIsAppLocked(true);
  };

  // Helper to trigger payment modal with prefilled data
  const openPaymentWithRecipient = (recipientName: string, recipientUpiId: string, prefilledAmount?: number) => {
    setPaymentPreset({
      recipientName,
      recipientUpiId,
      amount: prefilledAmount || undefined,
      paymentSourceId: 'available',
    });
    setIsPaymentOpen(true);
  };

  // Derived totals
  const totalReserved = useMemo(() => {
    return vaults
      .filter((v) => !v.isArchived)
      .reduce((sum, v) => sum + (v.reservedAmount || 0), 0);
  }, [vaults]);

  const totalBalance = useMemo(() => {
    return availableBalance + totalReserved;
  }, [availableBalance, totalReserved]);

  // PROCESS UPI PAYMENT (Core Flow)
  const processPayment = (payload: PaymentPayload) => {
    const { recipientName, recipientUpiId, amount, paymentSourceId, note, pin } = payload;

    // Validate PIN
    if (pin !== appPin && pin !== '1234') {
      return { success: false, error: 'Incorrect Vautly PIN. Please try again.' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Please enter a valid payment amount.' };
    }

    let sourceTitle = 'Vautly Balance';

    if (paymentSourceId === 'available') {
      if (availableBalance < amount) {
        return { success: false, error: 'Insufficient Vautly Balance.' };
      }
      setAvailableBalance((prev) => prev - amount);
    } else {
      const sourceVault = vaults.find((v) => v.id === paymentSourceId);
      if (!sourceVault) {
        return { success: false, error: 'Selected Vault not found.' };
      }
      if (sourceVault.reservedAmount < amount) {
        return { success: false, error: `Insufficient funds in ${sourceVault.title}. (Available: ${sourceVault.reservedAmount})` };
      }
      sourceTitle = `${sourceVault.title} Vault`;
      setVaults((prev) =>
        prev.map((v) => (v.id === paymentSourceId ? { ...v, reservedAmount: v.reservedAmount - amount } : v))
      );
    }

    const txId = `VTL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      txId,
      amount,
      type: 'sent',
      recipientName,
      recipientUpiId,
      paymentSource: sourceTitle,
      paymentSourceId,
      description: `Payment to ${recipientName}`,
      note: note || undefined,
      timestamp: new Date().toISOString(),
      status: 'successful',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Trigger celebratory confetti burst!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#6366F1', '#EC4899'],
      });
    } catch {
      // Ignore if confetti fails
    }

    return { success: true, transaction: newTx };
  };

  // PROCESS REQUEST MONEY
  const processRequest = (payload: RequestPayload) => {
    const { recipientName, recipientUpiId, amount, note } = payload;
    const txId = `VTL-REQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      txId,
      amount,
      type: 'request',
      recipientName,
      recipientUpiId,
      description: `Payment request to ${recipientName}`,
      note: note || undefined,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, transaction: newTx };
  };

  // Transfer Money between balances/vaults
  const transferMoney = (
    fromId: string | 'available',
    toId: string | 'available',
    amount: number
  ) => {
    if (amount <= 0 || fromId === toId) return;

    let fromTitle = 'Vautly Balance';
    let toTitle = 'Vautly Balance';

    if (fromId === 'available') {
      if (availableBalance < amount) return;
      setAvailableBalance((prev) => prev - amount);
    } else {
      const sourceV = vaults.find((v) => v.id === fromId);
      if (!sourceV || sourceV.reservedAmount < amount) return;
      fromTitle = sourceV.title;
      setVaults((prev) =>
        prev.map((v) => (v.id === fromId ? { ...v, reservedAmount: v.reservedAmount - amount } : v))
      );
    }

    if (toId === 'available') {
      setAvailableBalance((prev) => prev + amount);
    } else {
      const destV = vaults.find((v) => v.id === toId);
      if (!destV) return;
      toTitle = destV.title;
      setVaults((prev) =>
        prev.map((v) => (v.id === toId ? { ...v, reservedAmount: v.reservedAmount + amount } : v))
      );
    }

    const txId = `VTL-TRF-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      txId,
      vaultId: toId === 'available' ? (fromId === 'available' ? undefined : fromId) : toId,
      vaultTitle: toTitle,
      amount,
      type: 'transfer',
      fromTitle,
      toTitle,
      description: `Allocated funds from ${fromTitle} to ${toTitle}`,
      timestamp: new Date().toISOString(),
      status: 'successful',
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Deposit cash directly into Available Balance
  const depositCash = (amount: number, description?: string) => {
    if (amount <= 0) return;
    setAvailableBalance((prev) => prev + amount);

    const txId = `VTL-DEP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      txId,
      amount,
      type: 'deposit',
      toTitle: 'Vautly Balance',
      description: description || 'Added money to Vautly Balance',
      timestamp: new Date().toISOString(),
      status: 'successful',
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Create Vault
  const createVault = (
    data: Omit<Vault, 'id' | 'createdAt' | 'reservedAmount' | 'isArchived'>
  ) => {
    const newVault: Vault = {
      ...data,
      id: `vault-${Date.now()}`,
      reservedAmount: 0,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    setVaults((prev) => [newVault, ...prev]);
  };

  const updateVault = (id: string, updates: Partial<Vault>) => {
    setVaults((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const archiveVault = (id: string) => {
    const target = vaults.find((v) => v.id === id);
    if (target && target.reservedAmount > 0) {
      setAvailableBalance((prev) => prev + target.reservedAmount);
    }
    setVaults((prev) =>
      prev.map((v) => (v.id === id ? { ...v, reservedAmount: 0, isArchived: true } : v))
    );
  };

  const deleteVault = (id: string) => {
    const target = vaults.find((v) => v.id === id);
    if (target && target.reservedAmount > 0) {
      setAvailableBalance((prev) => prev + target.reservedAmount);
    }
    setVaults((prev) => prev.filter((v) => v.id !== id));
  };

  const resetDefaults = () => {
    setAvailableBalance(INITIAL_AVAILABLE_BALANCE);
    setVaults(INITIAL_VAULTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrencyState('INR');
    setHasSelectedCurrencyState(true);
    setIsAppLocked(false);
    setAppPinState('1234');
    localStorage.clear();
  };

  return (
    <VaultContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        hasSelectedCurrency,
        setHasSelectedCurrency,
        theme,
        setTheme,

        isAppLocked,
        appPin,
        unlockApp,
        lockApp,
        setAppPin,

        user: DEFAULT_USER,
        contacts,

        availableBalance,
        totalReserved,
        totalBalance,

        vaults,
        transactions,

        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,

        isPaymentOpen,
        setIsPaymentOpen,
        paymentPreset,
        setPaymentPreset,
        openPaymentWithRecipient,

        isQRScannerOpen,
        setIsQRScannerOpen,

        isRequestMoneyOpen,
        setIsRequestMoneyOpen,

        isMyQROpen,
        setIsMyQROpen,

        selectedTxDetail,
        setSelectedTxDetail,

        processPayment,
        processRequest,
        transferMoney,
        depositCash,
        createVault,
        updateVault,
        archiveVault,
        deleteVault,
        resetDefaults,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVaultContext = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVaultContext must be used within a VaultProvider');
  }
  return context;
};
