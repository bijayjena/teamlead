
CREATE TABLE public.meeting_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Meeting',
  content TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meeting notes" ON public.meeting_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own meeting notes" ON public.meeting_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meeting notes" ON public.meeting_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meeting notes" ON public.meeting_notes FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_meeting_notes_updated_at
  BEFORE UPDATE ON public.meeting_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
