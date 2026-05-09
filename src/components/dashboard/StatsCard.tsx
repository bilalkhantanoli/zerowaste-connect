import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'primary' | 'accent' | 'success' | 'urgent';
}

const colorConfig = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent-foreground',
  success: 'bg-success/10 text-success',
  urgent: 'bg-urgent/10 text-urgent',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'primary',
}: StatsCardProps) {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            {trend && (
              <div
                className={cn(
                  'mt-2 flex items-center gap-1 text-sm font-medium',
                  isPositiveTrend ? 'text-success' : 'text-urgent',
                )}
              >
                {isPositiveTrend ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
                <span className="font-normal text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-3', colorConfig[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
