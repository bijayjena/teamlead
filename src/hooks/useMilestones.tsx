 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 import { Milestone } from '@/types';
 import { toast } from 'sonner';
 
 type DbMilestone = {
   id: string;
   user_id: string;
   name: string;
   description: string | null;
   target_date: string;
   task_ids: string[];
   progress: number;
   risk_notes: string | null;
   created_at: string;
   updated_at: string;
 };
 
 const mapDbMilestoneToMilestone = (dbMilestone: DbMilestone): Milestone => ({
   id: dbMilestone.id,
   name: dbMilestone.name,
   description: dbMilestone.description || undefined,
   targetDate: new Date(dbMilestone.target_date),
   taskIds: dbMilestone.task_ids,
   progress: dbMilestone.progress,
   riskNotes: dbMilestone.risk_notes || undefined,
 });
 
 export const useMilestones = () => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ['milestones', user?.id],
     queryFn: async (): Promise<Milestone[]> => {
       if (!user) return [];
       
       const { data, error } = await supabase
         .from('milestones')
         .select('*')
         .order('target_date', { ascending: true });
 
       if (error) throw error;
       return (data as DbMilestone[]).map(mapDbMilestoneToMilestone);
     },
     enabled: !!user,
   });
 };
 
 export const useCreateMilestone = () => {
   const queryClient = useQueryClient();
   const { user } = useAuth();
 
   return useMutation({
     mutationFn: async (milestone: Omit<Milestone, 'id'>) => {
       if (!user) throw new Error('User not authenticated');
 
       const { data, error } = await supabase
         .from('milestones')
         .insert({
           user_id: user.id,
           name: milestone.name,
           description: milestone.description,
           target_date: milestone.targetDate.toISOString(),
           task_ids: milestone.taskIds,
           progress: milestone.progress,
           risk_notes: milestone.riskNotes,
         })
         .select()
         .single();
 
       if (error) throw error;
       return mapDbMilestoneToMilestone(data as DbMilestone);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['milestones'] });
       toast.success('Milestone created');
     },
     onError: (error) => {
       toast.error(`Failed to create milestone: ${error.message}`);
     },
   });
 };
 
 export const useUpdateMilestone = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, ...updates }: Partial<Milestone> & { id: string }) => {
       const dbUpdates: Record<string, unknown> = {};
       if (updates.name !== undefined) dbUpdates.name = updates.name;
       if (updates.description !== undefined) dbUpdates.description = updates.description;
       if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate.toISOString();
       if (updates.taskIds !== undefined) dbUpdates.task_ids = updates.taskIds;
       if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
       if (updates.riskNotes !== undefined) dbUpdates.risk_notes = updates.riskNotes;
 
       const { data, error } = await supabase
         .from('milestones')
         .update(dbUpdates)
         .eq('id', id)
         .select()
         .single();
 
       if (error) throw error;
       return mapDbMilestoneToMilestone(data as DbMilestone);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['milestones'] });
       toast.success('Milestone updated');
     },
     onError: (error) => {
       toast.error(`Failed to update milestone: ${error.message}`);
     },
   });
 };
 
 export const useDeleteMilestone = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase
         .from('milestones')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['milestones'] });
       toast.success('Milestone deleted');
     },
     onError: (error) => {
       toast.error(`Failed to delete milestone: ${error.message}`);
     },
   });
 };