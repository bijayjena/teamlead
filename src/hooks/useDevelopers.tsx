 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 import { Developer, SkillTag } from '@/types';
 import { toast } from 'sonner';
 
 type DbDeveloper = {
   id: string;
   user_id: string;
   name: string;
   avatar: string | null;
   skills: string[];
   max_capacity: number;
   current_load: number;
   availability: number;
   created_at: string;
   updated_at: string;
 };
 
 const mapDbDeveloperToDeveloper = (dbDev: DbDeveloper): Developer => ({
   id: dbDev.id,
   name: dbDev.name,
   avatar: dbDev.avatar || undefined,
   skills: dbDev.skills as SkillTag[],
   maxCapacity: dbDev.max_capacity,
   currentLoad: dbDev.current_load,
   availability: dbDev.availability,
 });
 
 export const useDevelopers = () => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ['developers', user?.id],
     queryFn: async (): Promise<Developer[]> => {
       if (!user) return [];
       
       const { data, error } = await supabase
         .from('developers')
         .select('*')
         .order('name', { ascending: true });
 
       if (error) throw error;
       return (data as DbDeveloper[]).map(mapDbDeveloperToDeveloper);
     },
     enabled: !!user,
   });
 };
 
 export const useCreateDeveloper = () => {
   const queryClient = useQueryClient();
   const { user } = useAuth();
 
   return useMutation({
     mutationFn: async (developer: Omit<Developer, 'id'>) => {
       if (!user) throw new Error('User not authenticated');
 
       const { data, error } = await supabase
         .from('developers')
         .insert({
           user_id: user.id,
           name: developer.name,
           avatar: developer.avatar,
           skills: developer.skills,
           max_capacity: developer.maxCapacity,
           current_load: developer.currentLoad,
           availability: developer.availability,
         })
         .select()
         .single();
 
       if (error) throw error;
       return mapDbDeveloperToDeveloper(data as DbDeveloper);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['developers'] });
       toast.success('Developer added');
     },
     onError: (error) => {
       toast.error(`Failed to add developer: ${error.message}`);
     },
   });
 };
 
 export const useUpdateDeveloper = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, ...updates }: Partial<Developer> & { id: string }) => {
       const dbUpdates: Record<string, unknown> = {};
       if (updates.name !== undefined) dbUpdates.name = updates.name;
       if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
       if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
       if (updates.maxCapacity !== undefined) dbUpdates.max_capacity = updates.maxCapacity;
       if (updates.currentLoad !== undefined) dbUpdates.current_load = updates.currentLoad;
       if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
 
       const { data, error } = await supabase
         .from('developers')
         .update(dbUpdates)
         .eq('id', id)
         .select()
         .single();
 
       if (error) throw error;
       return mapDbDeveloperToDeveloper(data as DbDeveloper);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['developers'] });
       toast.success('Developer updated');
     },
     onError: (error) => {
       toast.error(`Failed to update developer: ${error.message}`);
     },
   });
 };
 
 export const useDeleteDeveloper = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase
         .from('developers')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['developers'] });
       toast.success('Developer removed');
     },
     onError: (error) => {
       toast.error(`Failed to remove developer: ${error.message}`);
     },
   });
 };