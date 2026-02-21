import { Milestone, Task } from '@/types';
import { MilestoneCard } from './MilestoneCard';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Share2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { exportToExcel, exportToCSV, generateShareableReport } from '@/lib/exportUtils';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface StakeholderViewProps {
  milestones: Milestone[];
  tasks: Task[];
}

export const StakeholderView = ({ milestones, tasks }: StakeholderViewProps) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  const handleExportExcel = async () => {
    setIsExporting('excel');
    try {
      exportToExcel({ tasks, milestones });
      toast({
        title: 'Excel exported',
        description: 'Your progress report has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not generate Excel file.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting('csv');
    try {
      exportToCSV({ tasks, milestones });
      toast({
        title: 'CSV exported',
        description: 'Your task list has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not generate CSV file.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleShareLink = async () => {
    setIsExporting('share');
    try {
      await generateShareableReport(tasks, milestones);
      toast({
        title: 'Copied to clipboard',
        description: 'Share the progress summary with your team.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy report to clipboard.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Progress Report</h2>
          <p className="text-sm text-muted-foreground">High-level view for stakeholders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportExcel}
            disabled={isExporting !== null}
          >
            {isExporting === 'excel' ? (
              <Check className="h-4 w-4 animate-pulse" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportCSV}
            disabled={isExporting !== null}
          >
            {isExporting === 'csv' ? (
              <Check className="h-4 w-4 animate-pulse" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleShareLink}
            disabled={isExporting !== null}
          >
            {isExporting === 'share' ? (
              <Check className="h-4 w-4 animate-pulse" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            Share Link
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground mt-1">Overall Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-capacity-low">{completedTasks}</p>
              <p className="text-sm text-muted-foreground mt-1">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{inProgressTasks}</p>
              <p className="text-sm text-muted-foreground mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{totalTasks - completedTasks - inProgressTasks}</p>
              <p className="text-sm text-muted-foreground mt-1">Remaining</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} tasks={tasks} />
          ))}
        </div>
      </div>
    </div>
  );
};
