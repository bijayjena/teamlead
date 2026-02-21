import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Save, X, Trash2, Clock, FileText, Sparkles, Loader2 } from 'lucide-react';
import { useMeetingNotes, useCreateMeetingNote, useSaveMeetingNote, useDeleteMeetingNote, MeetingNote } from '@/hooks/useMeetingNotes';
import { useCreateTask } from '@/hooks/useTasks';
import { generateTasksFromText } from '@/lib/geminiService';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { SkillBadge } from '@/components/shared/SkillBadge';
import type { Priority, SkillTag } from '@/types';

interface GeneratedTask {
  title: string;
  description?: string;
  priority: Priority;
  skills?: SkillTag[];
  selected: boolean;
}

const MeetingNotesPage = () => {
  const { data: notes = [], isLoading } = useMeetingNotes();
  const createNote = useCreateMeetingNote();
  const saveNote = useSaveMeetingNote();
  const deleteNote = useDeleteMeetingNote();
  const createTask = useCreateTask();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [generating, setGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [showTasksDialog, setShowTasksDialog] = useState(false);
  const [savingTasks, setSavingTasks] = useState(false);

  const handleNewMeeting = async () => {
    const result = await createNote.mutateAsync({ title: 'Untitled Meeting' });
    setActiveNoteId(result.id);
    setEditTitle(result.title);
    setEditContent('');
  };

  const handleOpenNote = (note: MeetingNote) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content || '');
  };

  const handleSave = () => {
    if (!activeNoteId) return;
    saveNote.mutate({ id: activeNoteId, title: editTitle, content: editContent });
  };

  const handleClose = () => {
    setActiveNoteId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleGenerateTasks = async (note: MeetingNote) => {
    if (!note.content) {
      toast.error('This meeting has no content to generate tasks from.');
      return;
    }
    setGenerating(true);
    try {
      const result = await generateTasksFromText(note.content, 'meeting notes');
      
      const tasks: GeneratedTask[] = (result.tasks || []).map((t: any) => ({
        ...t,
        skills: t.skills || [],
        selected: true,
      }));
      
      if (tasks.length === 0) {
        toast.info('No actionable tasks found in these notes.');
        return;
      }
      
      setGeneratedTasks(tasks);
      setShowTasksDialog(true);
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate tasks');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveGeneratedTasks = async () => {
    const selected = generatedTasks.filter((t) => t.selected);
    if (selected.length === 0) return;
    setSavingTasks(true);
    try {
      for (const task of selected) {
        await createTask.mutateAsync({
          title: task.title,
          description: task.description,
          priority: task.priority,
          skills: task.skills || [],
          status: 'backlog',
          effort: 1,
          dependencies: [],
        });
      }
      toast.success(`${selected.length} task(s) created`);
      setShowTasksDialog(false);
      setGeneratedTasks([]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save tasks');
    } finally {
      setSavingTasks(false);
    }
  };

  const toggleTask = (idx: number) => {
    setGeneratedTasks((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, selected: !t.selected } : t))
    );
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meeting Notes</h1>
            <p className="text-muted-foreground text-sm">Capture notes with automatic time tracking</p>
          </div>
          <Button onClick={handleNewMeeting} disabled={createNote.isPending} className="gap-2">
            <Plus className="h-4 w-4" />
            New Meeting
          </Button>
        </div>

        {activeNoteId && activeNote && (
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="gap-1.5 text-xs">
                    <Clock className="h-3 w-3" />
                    Started: {format(activeNote.startTime, 'MMM d, h:mm a')}
                  </Badge>
                  {activeNote.endTime && (
                    <Badge variant="secondary" className="gap-1.5 text-xs">
                      Ended: {format(activeNote.endTime, 'h:mm a')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saveNote.isPending} className="gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save & End
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Meeting title..."
                className="text-lg font-semibold border-0 bg-transparent px-0 focus-visible:ring-0"
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Start typing your meeting notes..."
                className="min-h-[250px] resize-none"
              />
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : notes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No meeting notes yet. Start a new meeting to begin.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`cursor-pointer transition-colors hover:bg-muted/30 ${activeNoteId === note.id ? 'ring-1 ring-primary/40' : ''}`}
                onClick={() => handleOpenNote(note)}
              >
                <CardContent className="flex items-center justify-between py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{note.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(note.startTime, 'MMM d, yyyy h:mm a')}
                      </span>
                      {note.endTime && (
                        <span>
                          — {format(note.endTime, 'h:mm a')}
                          {' '}({Math.round((note.endTime.getTime() - note.startTime.getTime()) / 60000)} min)
                        </span>
                      )}
                      {!note.endTime && <Badge variant="outline" className="text-xs">In Progress</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {note.content && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={generating}
                        onClick={(e) => { e.stopPropagation(); handleGenerateTasks(note); }}
                        className="gap-1.5 text-muted-foreground hover:text-primary"
                      >
                        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        <span className="hidden sm:inline">Generate Tasks</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); deleteNote.mutate(note.id); }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showTasksDialog} onOpenChange={setShowTasksDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generated Tasks
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-3">
            <div className="space-y-3">
              {generatedTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={() => toggleTask(idx)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <PriorityBadge priority={task.priority} />
                      {task.skills?.map((s) => (
                        <SkillBadge key={s} skill={s} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTasksDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveGeneratedTasks}
              disabled={savingTasks || generatedTasks.filter((t) => t.selected).length === 0}
              className="gap-1.5"
            >
              {savingTasks && <Loader2 className="h-4 w-4 animate-spin" />}
              Add {generatedTasks.filter((t) => t.selected).length} Task(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MeetingNotesPage;
