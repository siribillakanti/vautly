export type CurrencyCode =
  | 'INR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'AED'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export type VaultCategory = 'essential' | 'lifestyle' | 'growth' | 'dream';

export interface Vault {
  id: string;
  title: string;
  icon: string;
  color: string;
  reservedAmount: number;
  targetAmount?: number;
  targetDate?: string;
  notes?: string;
  category: VaultCategory;
  isArchived: boolean;
  createdAt: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'sent' | 'received' | 'request';

export interface Transaction {
  id: string;
  txId: string;
  vaultId?: string;
  vaultTitle?: string;
  amount: number;
  type: TransactionType;
  fromTitle?: string;
  toTitle?: string;
  recipientName?: string;
  recipientUpiId?: string;
  senderName?: string;
  senderUpiId?: string;
  paymentSource?: string; // 'Vautly Balance' or Vault title
  paymentSourceId?: string; // 'available' or vault ID
  description: string;
  note?: string;
  timestamp: string;
  status: 'successful' | 'pending' | 'failed';
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  avatar: string;
  phone?: string;
  isMerchant?: boolean;
  recent?: boolean;
}

export type ActiveTab = 'home' | 'pay' | 'vaults' | 'transactions' | 'profile';

export type ThemeMode = 'light' | 'dark';

