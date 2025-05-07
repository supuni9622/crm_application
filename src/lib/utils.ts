import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  if (!date) return 'N/A';
  return format(new Date(date), formatStr);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    // Campaign statuses
    'draft': 'bg-muted text-muted-foreground',
    'scheduled': 'bg-warning/20 text-warning',
    'running': 'bg-primary/20 text-primary',
    
    // Transaction & Campaign completion status
    'completed': 'bg-success/20 text-success',
    'refunded': 'bg-error/20 text-error',
    'processing': 'bg-warning/20 text-warning',
    
    // Subscription statuses
    'active': 'bg-success/20 text-success',
    'canceled': 'bg-muted text-muted-foreground',
    'past_due': 'bg-error/20 text-error',
    
    // Default
    'default': 'bg-muted text-muted-foreground',
  };
  
  return statusMap[status] || statusMap.default;
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}