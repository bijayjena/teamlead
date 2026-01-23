 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 import { Task, TaskStatus, Priority, SkillTag } from '@/types';
 import { toast } from 'sonner';
 
 type DbTask = {
   id: string;
   user_id: string;
   title: string;
   description: string | null;
   effort: number;
   priority: string;
   skills: string[];
   status: string;
   assignee_id: string | null;
   parent_id: string | null;
   dependencies: string[];
   created_at: string;
   updated_at: string;
 };
 
 const mapDbTaskToTask = (dbTask: DbTask): Task => ({
   id: dbTask.id,
   title: dbTask.title,
   description: dbTask.description || undefined,
   effort: dbTask.effort,
   priority: dbTask.priority as Priority,
   skills: dbTask.skills as SkillTag[],
   status: dbTask.status as TaskStatus,
   assigneeId: dbTask.assignee_id || undefined,
   parentId: dbTask.parent_id || undefined,
   dependencies: dbTask.dependencies,
   createdAt: new Date(dbTask.created_at),
   updatedAt: new Date(dbTask.updated_at),
 });
 
 export const useTasks = () => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ['tasks', user?.id],
     queryFn: async (): Promise<Task[]> => {
       if (!user) return [];
       
       const { data, error } = await supabase
         .from('tasks')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       return (data as DbTask[]).map(mapDbTaskToTask);
     },
     enabled: !!user,
   });
 };
 
 export const useCreateTask = () => {
   const queryClient = useQueryClient();
   const { user } = useAuth();
 
   return useMutation({
     mutationFn: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
       if (!user) throw new Error('User not authenticated');
 
       const { data, error } = await supabase
         .from('tasks')
         .insert({
           user_id: user.id,
           title: task.title,
           description: task.description,
           effort: task.effort,
           priority: task.priority,
           skills: task.skills,
           status: task.status,
           assignee_id: task.assigneeId,
           parent_id: task.parentId,
           dependencies: task.dependencies,
         })
         .select()
         .single();
 
       if (error) throw error;
       return mapDbTaskToTask(data as DbTask);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tasks'] });
       toast.success('Task created');
     },
     onError: (error) => {
       toast.error(`Failed to create task: ${error.message}`);
     },
   });
 };
 
 export const useUpdateTask = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
       const dbUpdates: Record<string, unknown> = {};
       if (updates.title !== undefined) dbUpdates.title = updates.title;
       if (updates.description !== undefined) dbUpdates.description = updates.description;
       if (updates.effort !== undefined) dbUpdates.effort = updates.effort;
       if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
       if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
       if (updates.status !== undefined) dbUpdates.status = updates.status;
       if ('assigneeId' in updates) dbUpdates.assignee_id = updates.assigneeId || null;
       if (updates.parentId !== undefined) dbUpdates.parent_id = updates.parentId;
       if (updates.dependencies !== undefined) dbUpdates.dependencies = updates.dependencies;
 
       const { data, error } = await supabase
         .from('tasks')
         .update(dbUpdates)
         .eq('id', id)
         .select()
         .single();
 
       if (error) throw error;
       return mapDbTaskToTask(data as DbTask);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tasks'] });
     },
     onError: (error) => {
       toast.error(`Failed to update task: ${error.message}`);
     },
   });
 };
 
 export const useDeleteTask = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase
         .from('tasks')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tasks'] });
       toast.success('Task deleted');
     },
     onError: (error) => {
       toast.error(`Failed to delete task: ${error.message}`);
     },
   });
 };