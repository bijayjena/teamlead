import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MeetingNote {
  id: string;
  title: string;
  content: string | null;
  startTime: Date;
  endTime: Date | null;
  createdAt: Date;
}

type DbMeetingNote = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  start_time: string;
  end_time: string | null;
  created_at: string;
  updated_at: string;
};

const mapDb = (d: DbMeetingNote): MeetingNote => ({
  id: d.id,
  title: d.title,
  content: d.content,
  startTime: new Date(d.start_time),
  endTime: d.end_time ? new Date(d.end_time) : null,
  createdAt: new Date(d.created_at),
});

export const useMeetingNotes = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['meeting_notes', user?.id],
    queryFn: async (): Promise<MeetingNote[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meeting_notes')
        .select('*')
        .order('start_time', { ascending: false });
      if (error) throw error;
      return (data as DbMeetingNote[]).map(mapDb);
    },
    enabled: !!user,
  });
};

export const useCreateMeetingNote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (note: { title: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('meeting_notes')
        .insert({ user_id: user.id, title: note.title })
        .select()
        .single();
      if (error) throw error;
      return mapDb(data as DbMeetingNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting_notes'] });
    },
    onError: (e) => toast.error(`Failed to create note: ${e.message}`),
  });
};

export const useSaveMeetingNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { data, error } = await supabase
        .from('meeting_notes')
        .update({ title, content, end_time: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapDb(data as DbMeetingNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting_notes'] });
      toast.success('Meeting note saved');
    },
    onError: (e) => toast.error(`Failed to save: ${e.message}`),
  });
};

export const useDeleteMeetingNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('meeting_notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting_notes'] });
      toast.success('Meeting note deleted');
    },
    onError: (e) => toast.error(`Failed to delete: ${e.message}`),
  });
};
