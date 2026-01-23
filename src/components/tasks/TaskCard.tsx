import { Task, Developer, Priority, SkillTag } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SkillBadge } from '@/components/shared/SkillBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clock, GitBranch, User, AlertTriangle, UserMinus, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCapacityPercentage } from '@/data/mockData';
import { useState } from 'react';
import { Constants } from '@/integrations/supabase/types';

const priorities = Constants.public.Enums.priority;
const allSkills = Constants.public.Enums.skill_tag;

interface TaskCardProps {
  task: Task;
  assignee?: Developer;
  developers?: Developer[];
  onAssign?: (taskId: string, developerId: string | null) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onClick?: () => void;
}

export const TaskCard = ({ task, assignee, developers = [], onAssign, onUpdate, onClick }: TaskCardProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editEffort, setEditEffort] = useState(task.effort);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editSkills, setEditSkills] = useState<SkillTag[]>([...task.skills]);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editingDescription, setEditingDescription] = useState(false);

  const hasDependencies = task.dependencies.length > 0;

  const sortedDevelopers = [...developers].sort((a, b) => {
    const aMatch = a.skills.some(s => task.skills.includes(s)) ? 0 : 1;
    const bMatch = b.skills.some(s => task.skills.includes(s)) ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return getCapacityPercentage(a) - getCapacityPercentage(b);
  });

  const handleAssign = (devId: string | null) => {
    onAssign?.(task.id, devId);
    setPopoverOpen(false);
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(task.title);
    setEditEffort(task.effort);
    setEditPriority(task.priority);
    setEditSkills([...task.skills]);
    setEditDescription(task.description || '');
    setEditing(true);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
  };

  const saveEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;
    onUpdate?.(task.id, {
      title: editTitle.trim(),
      effort: editEffort,
      priority: editPriority,
      skills: editSkills,
      description: editDescription.trim() || undefined,
    });
    setEditing(false);
  };

  const toggleSkill = (skill: SkillTag) => {
    setEditSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const assigneeButton = (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); }}
          className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
        >
          {assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {assignee.avatar || assignee.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-muted">
              <User className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end" onClick={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder="Search developers..." />
          <CommandList>
            <CommandEmpty>No developers found.</CommandEmpty>
            <CommandGroup>
              {assignee && (
                <CommandItem onSelect={() => handleAssign(null)} className="text-muted-foreground">
                  <UserMinus className="h-4 w-4 mr-2" />
                  Unassign
                </CommandItem>
              )}
              {sortedDevelopers.map((dev) => {
                const capacity = getCapacityPercentage(dev);
                const isOverloaded = capacity >= 90;
                const hasMatchingSkill = dev.skills.some(s => task.skills.includes(s));
                const isAssigned = dev.id === task.assigneeId;

                return (
                  <CommandItem
                    key={dev.id}
                    onSelect={() => handleAssign(dev.id)}
                    className={cn(isAssigned && "bg-accent")}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                          {dev.avatar || dev.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{dev.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {capacity}% load
                          {hasMatchingSkill && ' · skill match'}
                        </p>
                      </div>
                      {isOverloaded && (
                        <AlertTriangle className="h-3.5 w-3.5 text-capacity-high shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  if (editing) {
    return (
      <Card className="transition-all ring-2 ring-primary/30" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            className="font-medium"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEditing(e as unknown as React.MouseEvent);
              if (e.key === 'Escape') setEditing(false);
            }}
          />

          {/* Description */}
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add a description..."
            className="text-sm min-h-[60px] resize-none"
            rows={2}
          />

          {/* Priority & Effort row */}
          <div className="flex items-center gap-2">
            <Select value={editPriority} onValueChange={(v) => setEditPriority(v as Priority)}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p} className="text-xs capitalize">{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                value={editEffort}
                onChange={(e) => setEditEffort(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-8 text-xs"
              />
              <span className="text-xs text-muted-foreground">h</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5">
            {allSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium capitalize border transition-colors",
                  editSkills.includes(skill)
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-border"
                )}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-7 px-2 text-xs">
              <X className="h-3 w-3 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={saveEditing} className="h-7 px-2 text-xs" disabled={!editTitle.trim()}>
              <Check className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md cursor-pointer group",
        task.status === 'done' && "opacity-60"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-medium text-foreground leading-tight">{task.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            {onUpdate && (
              <button
                type="button"
                onClick={startEditing}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {editingDescription ? (
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="text-sm min-h-[60px] resize-none mb-1.5"
              autoFocus
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setEditingDescription(false);
                  setEditDescription(task.description || '');
                }
              }}
            />
            <div className="flex items-center justify-end gap-1.5">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={(e) => {
                e.stopPropagation();
                setEditingDescription(false);
                setEditDescription(task.description || '');
              }}>
                <X className="h-3 w-3 mr-1" /> Cancel
              </Button>
              <Button size="sm" className="h-6 px-2 text-xs" onClick={(e) => {
                e.stopPropagation();
                onUpdate?.(task.id, { description: editDescription.trim() || undefined });
                setEditingDescription(false);
              }}>
                <Check className="h-3 w-3 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <p
            className={cn(
              "text-sm mb-3 line-clamp-2 rounded px-1 -mx-1 transition-colors",
              onUpdate ? "cursor-pointer hover:bg-muted/50" : "",
              task.description ? "text-muted-foreground" : "text-muted-foreground/50 italic"
            )}
            onClick={(e) => {
              if (!onUpdate) return;
              e.stopPropagation();
              setEditDescription(task.description || '');
              setEditingDescription(true);
            }}
          >
            {task.description || (onUpdate ? "Add description..." : "")}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.effort}h
            </span>
            {hasDependencies && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                {task.dependencies.length}
              </span>
            )}
          </div>

          {onAssign ? assigneeButton : (
            assignee ? (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {assignee.avatar}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-muted">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
