import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'admin' | 'team_lead' | 'developer';
  joinedAt: Date;
  profile?: {
    displayName: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'admin' | 'team_lead' | 'developer';
  invitedBy: string;
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  inviterName?: string;
  teamName?: string;
}

type DbTeam = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

type DbTeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    display_name: string;
    user_id: string;
  };
};

type DbTeamInvitation = {
  id: string;
  team_id: string;
  email: string;
  role: string;
  invited_by: string;
  token: string;
  status: string;
  expires_at: string;
  created_at: string;
  teams?: {
    name: string;
  };
  profiles?: {
    display_name: string;
  };
};

const mapTeam = (d: DbTeam): Team => ({
  id: d.id,
  name: d.name,
  ownerId: d.owner_id,
  createdAt: new Date(d.created_at),
  updatedAt: new Date(d.updated_at),
});

const mapTeamMember = (d: DbTeamMember): TeamMember => ({
  id: d.id,
  teamId: d.team_id,
  userId: d.user_id,
  role: d.role as any,
  joinedAt: new Date(d.joined_at),
  profile: d.profiles ? {
    displayName: d.profiles.display_name,
    email: '', // Will be fetched separately if needed
  } : undefined,
});

const mapInvitation = (d: DbTeamInvitation): TeamInvitation => ({
  id: d.id,
  teamId: d.team_id,
  email: d.email,
  role: d.role as any,
  invitedBy: d.invited_by,
  token: d.token,
  status: d.status as any,
  expiresAt: new Date(d.expires_at),
  createdAt: new Date(d.created_at),
  teamName: d.teams?.name,
  inviterName: d.profiles?.display_name,
});

// Get user's teams
export const useTeams = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async (): Promise<Team[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as DbTeam[]).map(mapTeam);
    },
    enabled: !!user,
  });
};

// Get team members
export const useTeamMembers = (teamId?: string) => {
  return useQuery({
    queryKey: ['team_members', teamId],
    queryFn: async (): Promise<TeamMember[]> => {
      if (!teamId) return [];
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles:user_id (
            display_name,
            user_id
          )
        `)
        .eq('team_id', teamId);
      if (error) throw error;
      return (data as any[]).map(mapTeamMember);
    },
    enabled: !!teamId,
  });
};

// Get team invitations
export const useTeamInvitations = (teamId?: string) => {
  return useQuery({
    queryKey: ['team_invitations', teamId],
    queryFn: async (): Promise<TeamInvitation[]> => {
      if (!teamId) return [];
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          teams:team_id (name),
          profiles:invited_by (display_name)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]).map(mapInvitation);
    },
    enabled: !!teamId,
  });
};

// Get user's pending invitations
export const useMyInvitations = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my_invitations', user?.email],
    queryFn: async (): Promise<TeamInvitation[]> => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          teams:team_id (name),
          profiles:invited_by (display_name)
        `)
        .eq('email', user.email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());
      if (error) throw error;
      return (data as any[]).map(mapInvitation);
    },
    enabled: !!user?.email,
  });
};

// Create team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('teams')
        .insert({ owner_id: user.id, name })
        .select()
        .single();
      if (error) throw error;
      return mapTeam(data as DbTeam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
    },
    onError: (e: any) => toast.error(`Failed to create team: ${e.message}`),
  });
};

// Send invitation
export const useSendInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      teamId,
      email,
      role,
    }: {
      teamId: string;
      email: string;
      role: 'admin' | 'team_lead' | 'developer';
    }) => {
      const token = crypto.randomUUID();
      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          email,
          role,
          token,
          invited_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return { ...mapInvitation(data as any), token };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_invitations'] });
      toast.success('Invitation sent successfully');
    },
    onError: (e: any) => toast.error(`Failed to send invitation: ${e.message}`),
  });
};

// Accept invitation
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase.rpc('accept_invitation', {
        invitation_token: token,
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast.success('Invitation accepted! Welcome to the team.');
    },
    onError: (e: any) => toast.error(`Failed to accept invitation: ${e.message}`),
  });
};

// Decline invitation
export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase.rpc('decline_invitation', {
        invitation_token: token,
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_invitations'] });
      toast.success('Invitation declined');
    },
    onError: (e: any) => toast.error(`Failed to decline invitation: ${e.message}`),
  });
};

// Remove team member
export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId }: { teamId: string; userId: string }) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast.success('Team member removed');
    },
    onError: (e: any) => toast.error(`Failed to remove member: ${e.message}`),
  });
};

// Cancel invitation
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_invitations'] });
      toast.success('Invitation cancelled');
    },
    onError: (e: any) => toast.error(`Failed to cancel invitation: ${e.message}`),
  });
};
