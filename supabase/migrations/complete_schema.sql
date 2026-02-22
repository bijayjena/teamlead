-- ============================================================================
-- teamlead - Complete Database Schema
-- ============================================================================
-- This file contains the complete database schema for the teamlead application.
-- Run this in your Supabase SQL editor to set up the database.
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'team_lead', 'developer');

-- Task priority levels
CREATE TYPE public.priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Skill tags for tasks and developers
CREATE TYPE public.skill_tag AS ENUM (
  'frontend',
  'backend',
  'infra',
  'mobile',
  'design',
  'qa',
  'devops'
);

-- Task status
CREATE TYPE public.task_status AS ENUM (
  'backlog',
  'todo',
  'in-progress',
  'review',
  'done'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- User profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'team_lead',
    UNIQUE (user_id, role)
);

-- User settings (active team, preferences)
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    active_team_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teams
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'developer',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (team_id, user_id)
);

-- Team invitations
CREATE TABLE public.team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'developer',
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Developers (team capacity management)
CREATE TABLE public.developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    skills skill_tag[] NOT NULL DEFAULT '{}',
    max_capacity INTEGER NOT NULL DEFAULT 40,
    current_load INTEGER NOT NULL DEFAULT 0,
    availability INTEGER NOT NULL DEFAULT 100 CHECK (availability >= 0 AND availability <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    effort INTEGER NOT NULL DEFAULT 1,
    priority priority NOT NULL DEFAULT 'medium',
    skills skill_tag[] NOT NULL DEFAULT '{}',
    status task_status NOT NULL DEFAULT 'backlog',
    assignee_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    dependencies TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Milestones
CREATE TABLE public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    task_ids TEXT[] NOT NULL DEFAULT '{}',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    risk_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Meeting notes
CREATE TABLE public.meeting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Meeting',
    content TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE
USING (auth.uid() = user_id);

-- Teams policies
CREATE POLICY "Users can view teams they own or are members of"
ON public.teams FOR SELECT
USING (
    auth.uid() = owner_id OR
    EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = teams.id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create their own teams"
ON public.teams FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
ON public.teams FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams"
ON public.teams FOR DELETE
USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Users can view team members of their teams"
ON public.team_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_members.team_id AND (
            owner_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.team_id = teams.id AND tm.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Team owners can add members"
ON public.team_members FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Team owners can update members"
ON public.team_members FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Team owners can remove members"
ON public.team_members FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_id AND owner_id = auth.uid()
    )
);

-- Team invitations policies
CREATE POLICY "Users can view invitations for their teams"
ON public.team_invitations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_id AND owner_id = auth.uid()
    ) OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Team owners can create invitations"
ON public.team_invitations FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Team owners can update invitations"
ON public.team_invitations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Invited users can update their invitation status"
ON public.team_invitations FOR UPDATE
USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND
    status = 'pending'
);

-- Developers policies
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

-- Tasks policies
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

-- Milestones policies
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

-- Meeting notes policies
CREATE POLICY "Users can view their own meeting notes"
ON public.meeting_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meeting notes"
ON public.meeting_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meeting notes"
ON public.meeting_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meeting notes"
ON public.meeting_notes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Function to check roles (security definer to prevent recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to get user's teams (owned + member of)
CREATE OR REPLACE FUNCTION public.get_user_teams(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    owner_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    role TEXT,
    is_owner BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    -- Teams owned by user
    SELECT 
        t.id,
        t.name,
        t.owner_id,
        t.created_at,
        t.updated_at,
        'owner'::TEXT as role,
        true as is_owner
    FROM public.teams t
    WHERE t.owner_id = user_uuid
    
    UNION
    
    -- Teams where user is a member
    SELECT 
        t.id,
        t.name,
        t.owner_id,
        t.created_at,
        t.updated_at,
        tm.role::TEXT as role,
        false as is_owner
    FROM public.teams t
    INNER JOIN public.team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = user_uuid
    
    ORDER BY created_at DESC;
END;
$$;

-- Function to create team and set as active
CREATE OR REPLACE FUNCTION public.create_team_and_set_active(
    team_name TEXT,
    user_uuid UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_team_id UUID;
    result JSON;
BEGIN
    -- Create the team
    INSERT INTO public.teams (owner_id, name)
    VALUES (user_uuid, team_name)
    RETURNING id INTO new_team_id;
    
    -- Create or update user settings to set active team
    INSERT INTO public.user_settings (user_id, active_team_id)
    VALUES (user_uuid, new_team_id)
    ON CONFLICT (user_id) 
    DO UPDATE SET active_team_id = new_team_id, updated_at = now();
    
    -- Return the team info
    SELECT json_build_object(
        'success', true,
        'team_id', new_team_id,
        'team_name', team_name
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Function to switch active team
CREATE OR REPLACE FUNCTION public.switch_active_team(
    team_uuid UUID,
    user_uuid UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    -- Check if user has access to this team
    SELECT EXISTS (
        SELECT 1 FROM public.teams WHERE id = team_uuid AND owner_id = user_uuid
        UNION
        SELECT 1 FROM public.team_members WHERE team_id = team_uuid AND user_id = user_uuid
    ) INTO has_access;
    
    IF NOT has_access THEN
        RETURN json_build_object('success', false, 'error', 'No access to this team');
    END IF;
    
    -- Update active team
    INSERT INTO public.user_settings (user_id, active_team_id)
    VALUES (user_uuid, team_uuid)
    ON CONFLICT (user_id) 
    DO UPDATE SET active_team_id = team_uuid, updated_at = now();
    
    RETURN json_build_object('success', true, 'team_id', team_uuid);
END;
$$;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    invitation_record RECORD;
    result JSON;
BEGIN
    -- Get invitation details
    SELECT * INTO invitation_record
    FROM public.team_invitations
    WHERE token = invitation_token
      AND status = 'pending'
      AND expires_at > now()
      AND email = (SELECT email FROM auth.users WHERE id = auth.uid());
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation');
    END IF;
    
    -- Add user to team
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (invitation_record.team_id, auth.uid(), invitation_record.role)
    ON CONFLICT (team_id, user_id) DO NOTHING;
    
    -- Update invitation status
    UPDATE public.team_invitations
    SET status = 'accepted', updated_at = now()
    WHERE id = invitation_record.id;
    
    -- Set as active team if user has no active team
    INSERT INTO public.user_settings (user_id, active_team_id)
    VALUES (auth.uid(), invitation_record.team_id)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        active_team_id = COALESCE(user_settings.active_team_id, invitation_record.team_id),
        updated_at = now();
    
    RETURN json_build_object('success', true, 'team_id', invitation_record.team_id);
END;
$$;

-- Function to decline invitation
CREATE OR REPLACE FUNCTION public.decline_invitation(invitation_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    invitation_record RECORD;
BEGIN
    -- Get invitation details
    SELECT * INTO invitation_record
    FROM public.team_invitations
    WHERE token = invitation_token
      AND status = 'pending'
      AND email = (SELECT email FROM auth.users WHERE id = auth.uid());
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid invitation');
    END IF;
    
    -- Update invitation status
    UPDATE public.team_invitations
    SET status = 'declined', updated_at = now()
    WHERE id = invitation_record.id;
    
    RETURN json_build_object('success', true);
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'team_lead');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_invitations_updated_at
    BEFORE UPDATE ON public.team_invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

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

CREATE TRIGGER update_meeting_notes_updated_at
    BEFORE UPDATE ON public.meeting_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- INDEXES
-- ============================================================================

-- User settings indexes
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_user_settings_active_team_id ON public.user_settings(active_team_id);

-- Team members indexes
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

-- Team invitations indexes
CREATE INDEX idx_team_invitations_team_id ON public.team_invitations(team_id);
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_team_invitations_token ON public.team_invitations(token);
CREATE INDEX idx_team_invitations_status ON public.team_invitations(status);

-- Tasks indexes
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);

-- Developers indexes
CREATE INDEX idx_developers_user_id ON public.developers(user_id);

-- ============================================================================
-- COMPLETE
-- ============================================================================
-- Schema setup complete!
-- Next steps:
-- 1. Verify all tables are created
-- 2. Test RLS policies
-- 3. Create your first user account
-- ============================================================================
