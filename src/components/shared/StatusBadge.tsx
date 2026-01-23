import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types';
import { getStatusColor } from '@/data/mockData';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        getStatusColor(status)
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
