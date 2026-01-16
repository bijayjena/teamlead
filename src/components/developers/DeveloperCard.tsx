import { useState } from 'react';
import { Developer } from '@/types';
import { CapacityBar } from '@/components/shared/CapacityBar';
import { SkillBadge } from '@/components/shared/SkillBadge';
import { getCapacityPercentage, getCapacityStatus } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarDays, AlertTriangle, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditDeveloperDialog } from './EditDeveloperDialog';
import { useDeleteDeveloper } from '@/hooks/useDevelopers';

interface DeveloperCardProps {
  developer: Developer;
  compact?: boolean;
}

export const DeveloperCard = ({ developer, compact = false }: DeveloperCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const deleteDeveloper = useDeleteDeveloper();
  const capacityPercentage = getCapacityPercentage(developer);
  const status = getCapacityStatus(capacityPercentage);
  const isOverloaded = capacityPercentage >= 90;
  const hasReducedAvailability = developer.availability < 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {developer.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">{developer.name}</span>
            {isOverloaded && <AlertTriangle className="h-3.5 w-3.5 text-capacity-high shrink-0" />}
          </div>
          <CapacityBar percentage={capacityPercentage} size="sm" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className={cn(
        "transition-all hover:shadow-md",
        isOverloaded && "ring-1 ring-capacity-high/30"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {developer.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{developer.name}</h3>
                  {isOverloaded && (
                    <AlertTriangle className="h-4 w-4 text-capacity-high" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {hasReducedAvailability && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {developer.availability}% available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {developer.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this developer and unassign them from any tasks. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteDeveloper.mutate(developer.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Capacity Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Workload</span>
              <span>{developer.currentLoad}h / {developer.maxCapacity}h</span>
            </div>
            <CapacityBar percentage={capacityPercentage} size="md" />
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5">
            {developer.skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} size="sm" />
            ))}
          </div>
        </CardContent>
      </Card>

      <EditDeveloperDialog developer={developer} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
};
