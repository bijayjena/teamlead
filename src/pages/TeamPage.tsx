import { MainLayout } from '@/components/layout/MainLayout';
import { TeamCapacity } from '@/components/developers/TeamCapacity';
import { useDevelopers } from '@/hooks/useDevelopers';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AddDeveloperDialog } from '@/components/developers/AddDeveloperDialog';
import { toast } from 'sonner';

const TeamPage = () => {
   const { data: developers = [], isLoading } = useDevelopers();
   const { data: tasks = [] } = useTasks();
   const updateTask = useUpdateTask();

   const handleAssignTask = (taskId: string, developerId: string) => {
     updateTask.mutate(
       { id: taskId, assigneeId: developerId },
       { onSuccess: () => toast.success('Task assigned successfully') }
     );
   };
 
   if (isLoading) {
     return (
       <MainLayout>
         <div className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-2xl font-bold text-foreground">Team Capacity</h1>
               <p className="text-muted-foreground">Monitor workload and availability across your team</p>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
               <Card key={i}>
                 <CardContent className="pt-6">
                   <Skeleton className="h-24 w-full" />
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Capacity</h1>
            <p className="text-muted-foreground">Monitor workload and availability across your team</p>
          </div>
          <AddDeveloperDialog />
        </div>

        {/* Team Capacity Grid */}
         {developers.length > 0 ? (
           <TeamCapacity developers={developers} tasks={tasks} onAssignTask={handleAssignTask} />
         ) : (
           <Card>
             <CardContent className="py-12 text-center">
               <p className="text-muted-foreground">No developers added yet. Click "Add Developer" to get started.</p>
             </CardContent>
           </Card>
         )}
      </div>
    </MainLayout>
  );
};

export default TeamPage;
