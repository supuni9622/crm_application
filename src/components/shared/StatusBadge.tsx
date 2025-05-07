import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'completed' | 'refunded' | 'processing' | 'draft' | 'scheduled' | 'running' | 'active' | 'cancelled' | 'past_due';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success', label?: string }> = {
    // Campaign statuses
    'draft': { variant: 'outline', label: 'Draft' },
    'scheduled': { variant: 'secondary', label: 'Scheduled' },
    'running': { variant: 'default', label: 'Running' },
    'completed': { variant: 'success', label: 'Completed' },
    
    // Transaction statuses
    'processing': { variant: 'secondary', label: 'Processing' },
    'refunded': { variant: 'destructive', label: 'Refunded' },
    
    // Subscription statuses
    'active': { variant: 'success', label: 'Active' },
    'cancelled': { variant: 'outline', label: 'Cancelled' },
    'past_due': { variant: 'destructive', label: 'Past Due' },
  };
  
  const { variant, label } = statusMap[status.toLowerCase()] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {label}
    </Badge>
  );
}