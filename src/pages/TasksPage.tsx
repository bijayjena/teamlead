 import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskCapture } from '@/components/tasks/TaskCapture';
import { TaskList } from '@/components/tasks/TaskList';
 import { useTasks, useUpdateTask, useCreateTask } from '@/hooks/useTasks';
 import { useDevelopers } from '@/hooks/useDevelopers';
 import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, TaskStatus } from '@/types';
import { toast } from 'sonner';

const TasksPage = () => {
   const { data: tasks = [], isLoading: tasksLoading } = useTasks();
   const { data: developers = [], isLoading: developersLoading } = useDevelopers();
   const updateTask = useUpdateTask();
   const createTask = useCreateTask();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
 
   const isLoading = tasksLoading || developersLoading;

  const handleTaskCapture = (content: string) => {
    console.log('Captured:', content);
     // Create a basic task from captured content
     createTask.mutate({
       title: content.split('\n')[0] || content,
       description: content,
       effort: 1,
       priority: 'medium',
       skills: [],
       status: 'backlog',
       dependencies: [],
     });
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask.mutate({ id: taskId, status: newStatus });
    toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
  };

  const handleTaskAssign = (taskId: string, developerId: string | null) => {
    const dev = developers.find(d => d.id === developerId);
    updateTask.mutate(
      { id: taskId, assigneeId: developerId || undefined },
      { onSuccess: () => toast.success(dev ? `Assigned to ${dev.name}` : 'Developer unassigned') }
    );
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask.mutate(
      { id: taskId, ...updates },
      { onSuccess: () => toast.success('Task updated') }
    );
  };
 
   if (isLoading) {
     return (
       <MainLayout>
         <div className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
               <p className="text-muted-foreground">Manage and organize your team's work</p>
             </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="space-y-3">
                 <Skeleton className="h-6 w-24" />
                 <Skeleton className="h-32 w-full" />
                 <Skeleton className="h-32 w-full" />
               </div>
             ))}
           </div>
         </div>
       </MainLayout>
     );
   }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">Manage and organize your team's work</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex items-center rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === 'kanban' 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === 'list' 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Capture */}
        <TaskCapture onSubmit={handleTaskCapture} />

        {/* Task Board/List */}
        <TaskList 
          tasks={tasks} 
           developers={developers}
          groupBy={viewMode === 'kanban' ? 'status' : 'none'}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskAssign={handleTaskAssign}
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
    </MainLayout>
  );
};

export default TasksPage;
