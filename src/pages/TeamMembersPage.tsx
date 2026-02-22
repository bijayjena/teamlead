import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTeams, useTeamMembers, useTeamInvitations, useActiveTeam } from '@/hooks/useTeams';
import { InviteTeamMemberDialog } from '@/components/team/InviteTeamMemberDialog';
import { TeamMembersList } from '@/components/team/TeamMembersList';
import { PendingInvitationsList } from '@/components/team/PendingInvitationsList';
import { TeamSelector } from '@/components/team/TeamSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Mail } from 'lucide-react';

const TeamMembersPage = () => {
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: activeTeam, isLoading: activeTeamLoading } = useActiveTeam();

  const currentTeamId = activeTeam?.id;
  const currentTeam = activeTeam;

  const { data: members = [], isLoading: membersLoading } = useTeamMembers(currentTeamId);
  const { data: invitations = [], isLoading: invitationsLoading } = useTeamInvitations(currentTeamId);

  const isLoading = teamsLoading || activeTeamLoading || membersLoading || invitationsLoading;

  if (teamsLoading || activeTeamLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (teams.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">Manage your team and invitations</p>
          </div>
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <div>
                <p className="text-lg font-medium text-foreground mb-2">No teams yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first team to start collaborating
                </p>
              </div>
              <TeamSelector />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!currentTeam) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">Select a team to manage</p>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <TeamSelector />
            </CardContent>
          </Card>
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
            <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">
              Manage members and invitations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TeamSelector />
            {currentTeamId && currentTeam.isOwner && (
              <InviteTeamMemberDialog teamId={currentTeamId} />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-semibold text-foreground">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Invitations</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {invitations.filter((i) => i.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2">
              <Mail className="h-4 w-4" />
              Invitations ({invitations.filter((i) => i.status === 'pending').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <TeamMembersList
                members={members}
                teamId={currentTeamId!}
                ownerId={currentTeam?.ownerId || ''}
              />
            )}
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <PendingInvitationsList invitations={invitations} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TeamMembersPage;
