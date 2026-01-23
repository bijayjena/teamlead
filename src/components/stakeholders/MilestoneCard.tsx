import { Milestone as MilestoneType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: MilestoneType;
}

export const MilestoneCard = ({ milestone }: MilestoneCardProps) => {
  const daysUntil = differenceInDays(milestone.targetDate, new Date());
  const isOverdue = isPast(milestone.targetDate) && milestone.progress < 100;
  const isComplete = milestone.progress === 100;

  const getTimeStatus = () => {
    if (isComplete) return { label: 'Complete', color: 'text-capacity-low' };
    if (isOverdue) return { label: 'Overdue', color: 'text-capacity-high' };
    if (daysUntil <= 7) return { label: `${daysUntil} days left`, color: 'text-capacity-medium' };
    return { label: `${daysUntil} days left`, color: 'text-muted-foreground' };
  };

  const timeStatus = getTimeStatus();

  return (
    <Card className={cn(
      "transition-all",
      isOverdue && "ring-1 ring-capacity-high/30",
      isComplete && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-capacity-low" />
            ) : isOverdue ? (
              <AlertTriangle className="h-5 w-5 text-capacity-high" />
            ) : (
              <Calendar className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-base">{milestone.name}</CardTitle>
          </div>
          <span className={cn("text-sm font-medium", timeStatus.color)}>
            {timeStatus.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestone.description && (
          <p className="text-sm text-muted-foreground">{milestone.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{milestone.progress}%</span>
          </div>
          <Progress value={milestone.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Target</span>
          <span className="text-foreground">{format(milestone.targetDate, 'MMM d, yyyy')}</span>
        </div>

        {milestone.riskNotes && (
          <div className="rounded-lg bg-capacity-medium/10 p-3">
            <p className="text-sm text-capacity-medium">
              ⚠️ {milestone.riskNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
