import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { generateMilestoneRiskAnalysis } from '@/lib/geminiService';
import { toast } from 'sonner';
import { Milestone, Task } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RiskAnalysisButtonProps {
  milestone: Milestone;
  tasks: Task[];
}

export const RiskAnalysisButton = ({ milestone, tasks }: RiskAnalysisButtonProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const milestoneTasks = tasks.filter(t => milestone.taskIds.includes(t.id));
      
      if (milestoneTasks.length === 0) {
        toast.error('No tasks associated with this milestone');
        return;
      }

      const taskData = milestoneTasks.map(t => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
      }));

      const result = await generateMilestoneRiskAnalysis(
        milestone.name,
        taskData,
        milestone.targetDate
      );

      setAnalysis(result);
      setShowDialog(true);
    } catch (error: any) {
      console.error('Risk analysis error:', error);
      toast.error(error.message || 'Failed to generate risk analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="gap-1.5"
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">AI Risk Analysis</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Risk Analysis: {milestone.name}
            </DialogTitle>
          </DialogHeader>
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="text-sm leading-relaxed whitespace-pre-wrap">
              {analysis}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
