import * as XLSX from 'xlsx';
import { Task, Milestone, Developer } from '@/types';

interface ExportData {
  tasks: Task[];
  milestones: Milestone[];
  developers?: Developer[];
}

// Format date for export
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Generate task summary data for export
const generateTaskSummary = (tasks: Task[]) => {
  return tasks.map((task) => ({
    'Task ID': task.id,
    'Title': task.title,
    'Description': task.description || '',
    'Status': task.status.replace('-', ' ').toUpperCase(),
    'Priority': task.priority.toUpperCase(),
    'Effort (hrs)': task.effort,
    'Skills': task.skills.join(', '),
    'Created': formatDate(task.createdAt),
    'Updated': formatDate(task.updatedAt),
  }));
};

// Generate milestone summary data for export
const generateMilestoneSummary = (milestones: Milestone[], tasks: Task[]) => {
  return milestones.map((milestone) => {
    const milestoneTasks = tasks.filter((t) => milestone.taskIds.includes(t.id));
    const completedTasks = milestoneTasks.filter((t) => t.status === 'done').length;
    
    return {
      'Milestone': milestone.name,
      'Description': milestone.description || '',
      'Target Date': formatDate(milestone.targetDate),
      'Progress': `${milestone.progress}%`,
      'Tasks Completed': `${completedTasks}/${milestoneTasks.length}`,
      'Risk Notes': milestone.riskNotes || 'None',
    };
  });
};

// Generate overall progress summary
const generateProgressSummary = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const backlog = tasks.filter((t) => t.status === 'backlog').length;

  return [
    { 'Metric': 'Total Tasks', 'Value': total },
    { 'Metric': 'Completed', 'Value': completed },
    { 'Metric': 'In Progress', 'Value': inProgress },
    { 'Metric': 'In Review', 'Value': review },
    { 'Metric': 'To Do', 'Value': todo },
    { 'Metric': 'Backlog', 'Value': backlog },
    { 'Metric': 'Overall Progress', 'Value': `${Math.round((completed / total) * 100)}%` },
  ];
};

// Export to Excel (.xlsx)
export const exportToExcel = ({ tasks, milestones }: ExportData, filename = 'progress-report') => {
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = generateProgressSummary(tasks);
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Milestones sheet
  const milestoneData = generateMilestoneSummary(milestones, tasks);
  const milestoneSheet = XLSX.utils.json_to_sheet(milestoneData);
  milestoneSheet['!cols'] = [
    { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(workbook, milestoneSheet, 'Milestones');

  // Tasks sheet
  const taskData = generateTaskSummary(tasks);
  const taskSheet = XLSX.utils.json_to_sheet(taskData);
  taskSheet['!cols'] = [
    { wch: 12 }, { wch: 35 }, { wch: 50 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
    { wch: 25 }, { wch: 15 }, { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(workbook, taskSheet, 'Tasks');

  // Generate file and trigger download
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filename}-${timestamp}.xlsx`);
};

// Export to CSV
export const exportToCSV = ({ tasks, milestones }: ExportData, filename = 'progress-report') => {
  const taskData = generateTaskSummary(tasks);
  const worksheet = XLSX.utils.json_to_sheet(taskData);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Generate shareable link (copies formatted text to clipboard)
export const generateShareableReport = async (tasks: Task[], milestones: Milestone[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const progress = Math.round((completed / total) * 100);

  const report = `
📊 Progress Report - ${new Date().toLocaleDateString()}

Overall Progress: ${progress}%
✅ Completed: ${completed}
🔄 In Progress: ${inProgress}
📋 Remaining: ${total - completed - inProgress}

📌 Milestones:
${milestones.map((m) => `  • ${m.name}: ${m.progress}% complete (Target: ${formatDate(m.targetDate)})`).join('\n')}
`.trim();

  await navigator.clipboard.writeText(report);
  return report;
};
