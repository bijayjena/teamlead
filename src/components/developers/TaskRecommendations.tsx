import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { generateTaskRecommendations } from '@/lib/geminiService';
import { toast } from 'sonner';
import { Developer, Task } from '@/types';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { SkillBadge } from '@/components/shared/SkillBadge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskRecommendationsProps {
  developer: Developer;
  availableTasks: Task[];
  onAssignTask?: (taskId: string, developerId: string) => void;
}

interface Recommendation {
  task: Task;
  reason: string;
}

export const TaskRecommendations = ({ developer, availableTasks, onAssignTask }: TaskRecommendationsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const handleGetRecommendations = async () => {
    setIsAnalyzing(true);
    try {
      // Filter unassigned tasks
      const unassignedTasks = availableTasks.filter(t => !t.assigneeId && t.status !== 'done');
      
      if (unassignedTasks.length === 0) {
        toast.info('No unassigned tasks available');
        return;
      }

      const availableCapacity = developer.maxCapacity - developer.currentLoad;
      
      if (availableCapacity <= 0) {
        toast.info(`${developer.name} is at full capacity`);
        return;
      }

      const taskData = unassignedTasks.map(t => ({
        id: t.id,
        title: t.title,
        skills: t.skills,
        effort: t.effort,
        priority: t.priority,
      }));

      const result = await generateTaskRecommendations(
        developer.skills,
        availableCapacity,
        taskData
      );

      const recs = result
        .map(rec => ({
          task: unassignedTasks.find(t => t.id === rec.taskId),
          reason: rec.reason,
        }))
        .filter(rec => rec.task) as Recommendation[];

      if (recs.length === 0) {
        toast.info('No suitable task recommendations found');
        return;
      }

      setRecommendations(recs);
      setShowDialog(true);
    } catch (error: any) {
      console.error('Task recommendation error:', error);
      toast.error(error.message || 'Failed to generate recommendations');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAssign = (taskId: string) => {
    if (onAssignTask) {
      onAssignTask(taskId, developer.id);
      setShowDialog(false);
      toast.success('Task assigned successfully');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGetRecommendations}
        disabled={isAnalyzing}
        className="gap-1.5"
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        AI Recommendations
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Task Recommendations for {developer.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-3">
            <div className="space-y-3">
              {recommendations.map(({ task, reason }) => (
                <Card key={task.id} className="border-primary/20">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <PriorityBadge priority={task.priority} />
                          <span className="text-xs text-muted-foreground">{task.effort}h</span>
                          {task.skills.map(skill => (
                            <SkillBadge key={skill} skill={skill} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{reason}</p>
                      </div>
                    </div>
                    {onAssignTask && (
                      <Button
                        size="sm"
                        onClick={() => handleAssign(task.id)}
                        className="w-full"
                      >
                        Assign to {developer.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
