// Currency formatting for Nepali Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('NPR', 'Rs.');
}

// Date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Date and time formatting
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Relative time formatting
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
}

// Account number display with masking option
export function formatAccountNumber(accountNumber: string, masked = false): string {
  if (masked && accountNumber.length > 8) {
    return `${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}`;
  }
  return accountNumber;
}

// Transaction type display
export function getTransactionTypeDisplay(type: string): { label: string; isCredit: boolean } {
  switch (type) {
    case 'DEPOSIT':
      return { label: 'Deposit', isCredit: true };
    case 'WITHDRAW':
      return { label: 'Withdrawal', isCredit: false };
    case 'TRANSFER_DEBIT':
      return { label: 'Transfer Out', isCredit: false };
    case 'TRANSFER_CREDIT':
      return { label: 'Transfer In', isCredit: true };
    default:
      return { label: type, isCredit: false };
  }
}
