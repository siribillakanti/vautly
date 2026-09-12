export const formatCurrency = (amount: number, compact: boolean = false): string => {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 1,
      notation: 'compact',
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (val: number): string => {
  return `${Math.min(100, Math.max(0, Math.round(val)))}%`;
};

export const getDaysRemaining = (targetDateStr?: string): number | null => {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  if (isNaN(diff)) return null;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
