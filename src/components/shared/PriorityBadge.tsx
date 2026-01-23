import { cn } from '@/lib/utils';
import { Priority } from '@/types';
import { getPriorityColor } from '@/data/mockData';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize",
        getPriorityColor(priority)
      )}
    >
      {priority}
    </span>
  );
};
