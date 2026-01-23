import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TaskCaptureProps {
  onSubmit: (content: string) => void;
}

export const TaskCapture = ({ onSubmit }: TaskCaptureProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      setIsExpanded(false);
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
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Quick capture — dump tasks, ideas, or notes here...</span>
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
        placeholder="Dump your tasks here...

Example:
- Implement user auth with OAuth
- Fix dashboard performance (high priority)
- Review PR #234
- Setup monitoring (needs: devops)"
        className="min-h-[150px] resize-none border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
      />
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">⌘↵</kbd> to save • 
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
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Capture
          </Button>
        </div>
      </div>
    </div>
  );
};
