import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  difference?: number;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  difference,
  className,
  loading = false
}: StatCardProps) {
  const isPositive = difference && difference > 0;
  const isNegative = difference && difference < 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-md bg-primary/10 p-1.5 text-primary dark:bg-primary/20">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {(description || difference !== undefined) && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1">
            {difference !== undefined && (
              <Badge variant={isPositive ? "success" : isNegative ? "destructive" : "outline"}>
                {isPositive && '+'}
                {difference.toFixed(1)}%
              </Badge>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded-md bg-muted" />
      </CardContent>
    </Card>
  );
}