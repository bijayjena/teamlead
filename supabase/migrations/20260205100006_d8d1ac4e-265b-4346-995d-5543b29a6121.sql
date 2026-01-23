-- Create enums for task management
CREATE TYPE public.priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.skill_tag AS ENUM ('frontend', 'backend', 'infra', 'mobile', 'design', 'qa', 'devops');
CREATE TYPE public.task_status AS ENUM ('backlog', 'todo', 'in-progress', 'review', 'done');

-- Create developers table
CREATE TABLE public.developers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    skills skill_tag[] NOT NULL DEFAULT '{}',
    max_capacity INTEGER NOT NULL DEFAULT 40,
    current_load INTEGER NOT NULL DEFAULT 0,
    availability INTEGER NOT NULL DEFAULT 100 CHECK (availability >= 0 AND availability <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    effort INTEGER NOT NULL DEFAULT 1,
    priority priority NOT NULL DEFAULT 'medium',
    skills skill_tag[] NOT NULL DEFAULT '{}',
    status task_status NOT NULL DEFAULT 'backlog',
    assignee_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    dependencies UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    task_ids UUID[] NOT NULL DEFAULT '{}',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    risk_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Developers RLS policies
CREATE POLICY "Users can view their own developers"
ON public.developers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own developers"
ON public.developers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own developers"
ON public.developers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own developers"
ON public.developers FOR DELETE
USING (auth.uid() = user_id);

-- Tasks RLS policies
CREATE POLICY "Users can view their own tasks"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);

-- Milestones RLS policies
CREATE POLICY "Users can view their own milestones"
ON public.milestones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
ON public.milestones FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
ON public.milestones FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
ON public.milestones FOR DELETE
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_developers_updated_at
BEFORE UPDATE ON public.developers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON public.milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();