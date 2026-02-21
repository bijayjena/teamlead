import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateTasksFromText } from '@/lib/geminiService';
import { toast } from 'sonner';

interface TaskCaptureProps {
  onTasksGenerated: (tasks: any[]) => void;
}

export const TaskCapture = ({ onTasksGenerated }: TaskCaptureProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateTasksFromText(content.trim());

      if (result?.tasks && result.tasks.length > 0) {
        onTasksGenerated(result.tasks);
        toast.success(`Generated ${result.tasks.length} task${result.tasks.length > 1 ? 's' : ''}`);
        setContent('');
        setIsExpanded(false);
      } else {
        toast.error('No tasks could be extracted from the content');
      }
    } catch (error: any) {
      console.error('Error generating tasks:', error);
      toast.error(error.message || 'Failed to generate tasks');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setContent('');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full rounded-lg border-2 border-dashed border-border bg-card/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">AI Quick Capture — describe your work and let AI create tasks...</span>
          <span className="ml-auto text-xs">⌘K</span>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your work and AI will create tasks...

Example:
We need to build a user authentication system with OAuth support. It should include login, signup, and password reset. High priority. Also need to fix the dashboard performance issues and setup monitoring for production."
        className="min-h-[150px] resize-none border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        disabled={isGenerating}
      />
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">⌘↵</kbd> to generate • 
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-1">Esc</kbd> to cancel
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsExpanded(false);
              setContent('');
            }}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isGenerating}
            className="gap-1.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Generate Tasks
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
