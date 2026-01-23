import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { Task } from '@/types';
import { useCreateMilestone } from '@/hooks/useMilestones';

interface AddMilestoneDialogProps {
  tasks: Task[];
}

export const AddMilestoneDialog = ({ tasks }: AddMilestoneDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [riskNotes, setRiskNotes] = useState('');

  const createMilestone = useCreateMilestone();

  const resetForm = () => {
    setName('');
    setDescription('');
    setTargetDate('');
    setSelectedTaskIds([]);
    setRiskNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetDate) return;

    const doneTasks = selectedTaskIds.filter(id => tasks.find(t => t.id === id)?.status === 'done');
    const progress = selectedTaskIds.length > 0 ? Math.round((doneTasks.length / selectedTaskIds.length) * 100) : 0;

    createMilestone.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        targetDate: new Date(targetDate),
        taskIds: selectedTaskIds,
        progress,
        riskNotes: riskNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          resetForm();
          setOpen(false);
        },
      }
    );
  };

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milestone-name">Name</Label>
            <Input
              id="milestone-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MVP Launch"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-desc">Description</Label>
            <Textarea
              id="milestone-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-date">Target Date</Label>
            <Input
              id="milestone-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Linked Tasks ({selectedTaskIds.length} selected)</Label>
            <ScrollArea className="h-40 rounded-md border border-border p-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks available</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <label
                      key={task.id}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedTaskIds.includes(task.id)}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                      <span className="text-sm truncate">{task.title}</span>
                      <span className="text-xs text-muted-foreground capitalize ml-auto shrink-0">
                        {task.status}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-risk">Risk Notes</Label>
            <Textarea
              id="milestone-risk"
              value={riskNotes}
              onChange={(e) => setRiskNotes(e.target.value)}
              placeholder="Any known risks or blockers..."
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !targetDate || createMilestone.isPending}>
              {createMilestone.isPending ? 'Creating...' : 'Create Milestone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
