import { MainLayout } from '@/components/layout/MainLayout';
import { StakeholderView } from '@/components/stakeholders/StakeholderView';
import { AddMilestoneDialog } from '@/components/stakeholders/AddMilestoneDialog';
import { useMilestones } from '@/hooks/useMilestones';
import { useTasks } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const StakeholdersPage = () => {
   const { data: milestones = [], isLoading: milestonesLoading } = useMilestones();
   const { data: tasks = [], isLoading: tasksLoading } = useTasks();
 
   const isLoading = milestonesLoading || tasksLoading;
 
   if (isLoading) {
     return (
       <MainLayout>
         <div className="space-y-6">
           <div>
             <h1 className="text-2xl font-bold text-foreground">Reports</h1>
             <p className="text-muted-foreground">Stakeholder-friendly progress views and exports</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
               <Card key={i}>
                 <CardContent className="pt-6">
                   <Skeleton className="h-32 w-full" />
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
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Stakeholder-friendly progress views and exports</p>
          </div>
          <AddMilestoneDialog tasks={tasks} />
        </div>

        {/* Stakeholder View */}
         {milestones.length > 0 ? (
           <StakeholderView milestones={milestones} tasks={tasks} />
         ) : (
           <Card>
             <CardContent className="py-12 text-center">
               <p className="text-muted-foreground">No milestones created yet.</p>
             </CardContent>
           </Card>
         )}
      </div>
    </MainLayout>
  );
};

export default StakeholdersPage;
