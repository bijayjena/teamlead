import { cn } from '@/lib/utils';
import { getCapacityStatus } from '@/data/mockData';

interface CapacityBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const CapacityBar = ({ percentage, size = 'md', showLabel = true }: CapacityBarProps) => {
  const status = getCapacityStatus(percentage);
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const statusColors = {
    low: 'bg-capacity-low',
    medium: 'bg-capacity-medium',
    high: 'bg-capacity-high',
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={cn("flex-1 rounded-full bg-capacity-empty/40 overflow-hidden", heights[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            statusColors[status]
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          "text-sm font-medium tabular-nums min-w-[3rem] text-right",
          status === 'low' && "text-capacity-low",
          status === 'medium' && "text-capacity-medium",
          status === 'high' && "text-capacity-high"
        )}>
          {percentage}%
        </span>
      )}
    </div>
  );
};
