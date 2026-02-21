-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'developer',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (team_id, user_id)
);

-- Create team_invitations table
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
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (team_id, email, status) -- Prevent duplicate pending invitations
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
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

-- RLS Policies for team_members
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

-- RLS Policies for team_invitations
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

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_invitations_updated_at
    BEFORE UPDATE ON public.team_invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create a default team for new users
CREATE OR REPLACE FUNCTION public.create_default_team()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
    INSERT INTO public.teams (owner_id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'My Team') || '''s Team');
    
    RETURN NEW;
END;
$;

-- Trigger to create default team on user creation
CREATE TRIGGER on_user_create_default_team
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_default_team();

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
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
    
    RETURN json_build_object('success', true, 'team_id', invitation_record.team_id);
END;
$;

-- Function to decline invitation
CREATE OR REPLACE FUNCTION public.decline_invitation(invitation_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
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
$;

-- Create indexes for performance
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_invitations_team_id ON public.team_invitations(team_id);
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_team_invitations_token ON public.team_invitations(token);
CREATE INDEX idx_team_invitations_status ON public.team_invitations(status);
