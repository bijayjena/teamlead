 import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskCapture } from '@/components/tasks/TaskCapture';
import { TaskList } from '@/components/tasks/TaskList';
import { DeveloperCard } from '@/components/developers/DeveloperCard';
 import { getCapacityPercentage } from '@/data/mockData';
 import { useTasks } from '@/hooks/useTasks';
 import { useDevelopers } from '@/hooks/useDevelopers';
 import { useMilestones } from '@/hooks/useMilestones';
 import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ListTodo, Users, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
   const { data: tasks = [], isLoading: tasksLoading } = useTasks();
   const { data: developers = [], isLoading: developersLoading } = useDevelopers();
   const { data: milestones = [], isLoading: milestonesLoading } = useMilestones();
 
   const isLoading = tasksLoading || developersLoading || milestonesLoading;

  const handleTaskCapture = (content: string) => {
    console.log('Captured:', content);
    // In a real app, this would parse the content and create tasks
  };

  // Stats
   const stats = useMemo(() => {
     const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
     const completedTasks = tasks.filter((t) => t.status === 'done').length;
     const overloadedDevs = developers.filter((d) => getCapacityPercentage(d) >= 90);
     const activeMilestone = milestones[0];
     const activeTasks = tasks
       .filter((t) => t.status === 'in-progress' || t.status === 'todo')
       .slice(0, 4);
 
     return { inProgressTasks, completedTasks, overloadedDevs, activeMilestone, activeTasks };
   }, [tasks, developers, milestones]);
 
   if (isLoading) {
     return (
       <MainLayout>
         <div className="space-y-6">
           <div>
             <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
             <p className="text-muted-foreground">Quick overview of your team's capacity and work</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((i) => (
               <Card key={i}>
                 <CardContent className="pt-6">
                   <Skeleton className="h-16 w-full" />
                 </CardContent>
               </Card>
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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Quick overview of your team's capacity and work</p>
        </div>

        {/* Quick Capture */}
        <TaskCapture onSubmit={handleTaskCapture} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ListTodo className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                   <p className="text-2xl font-semibold text-foreground">{stats.inProgressTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-capacity-low/10">
                  <TrendingUp className="h-5 w-5 text-capacity-low" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                   <p className="text-2xl font-semibold text-foreground">{stats.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-capacity-high/10">
                  <AlertTriangle className="h-5 w-5 text-capacity-high" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overloaded Devs</p>
                   <p className="text-2xl font-semibold text-foreground">{stats.overloadedDevs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                  <Target className="h-5 w-5 text-chart-1" />
                </div>
                <div className="flex-1 min-w-0">
                   {stats.activeMilestone ? (
                     <>
                       <p className="text-sm text-muted-foreground truncate">{stats.activeMilestone.name}</p>
                       <div className="flex items-center gap-2">
                         <Progress value={stats.activeMilestone.progress} className="h-2 flex-1" />
                         <span className="text-sm font-medium text-foreground">{stats.activeMilestone.progress}%</span>
                       </div>
                     </>
                   ) : (
                     <p className="text-sm text-muted-foreground">No milestones</p>
                   )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Capacity - Takes 1 column */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Team Capacity</CardTitle>
                <span className="text-xs text-muted-foreground">
                   {stats.overloadedDevs.length > 0 && (
                     <span className="text-capacity-high">{stats.overloadedDevs.length} at risk</span>
                  )}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
               {developers.length > 0 ? developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} compact />
               )) : (
                 <p className="text-sm text-muted-foreground text-center py-4">No developers added yet</p>
               )}
            </CardContent>
          </Card>

          {/* Active Work - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Active Work</h2>
              <a href="/tasks" className="text-sm text-primary hover:underline">View all →</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {stats.activeTasks.length > 0 ? stats.activeTasks.map((task) => {
                 const assignee = developers.find((d) => d.id === task.assigneeId);
                return (
                  <Card key={task.id} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-foreground text-sm leading-tight">
                          {task.title}
                        </h3>
                        <span className={cn(
                          "shrink-0 px-1.5 py-0.5 rounded text-xs font-medium",
                          task.priority === 'high' && "bg-capacity-high/20 text-capacity-high",
                          task.priority === 'medium' && "bg-capacity-medium/20 text-capacity-medium",
                          task.priority === 'low' && "bg-capacity-low/20 text-capacity-low"
                        )}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{task.effort}h estimated</span>
                        {assignee && <span>{assignee.name}</span>}
                      </div>
                    </CardContent>
                  </Card>
                );
               }) : (
                 <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No active tasks</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
