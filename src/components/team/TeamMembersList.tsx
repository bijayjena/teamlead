import { TeamMember, useRemoveTeamMember } from '@/hooks/useTeams';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserMinus, Crown, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TeamMembersListProps {
  members: TeamMember[];
  teamId: string;
  ownerId: string;
}

const roleIcons = {
  admin: Crown,
  team_lead: Shield,
  developer: User,
};

const roleLabels = {
  admin: 'Admin',
  team_lead: 'Team Lead',
  developer: 'Developer',
};

const roleColors = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
  team_lead: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  developer: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

export const TeamMembersList = ({ members, teamId, ownerId }: TeamMembersListProps) => {
  const { user } = useAuth();
  const removeMember = useRemoveTeamMember();
  const isOwner = user?.id === ownerId;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const RoleIcon = roleIcons[member.role];
        const isCurrentUser = member.userId === user?.id;
        const isMemberOwner = member.userId === ownerId;

        return (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.profile?.displayName
                      ? getInitials(member.profile.displayName)
                      : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">
                      {member.profile?.displayName || 'Unknown User'}
                    </p>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                    {isMemberOwner && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Crown className="h-3 w-3" />
                        Owner
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs gap-1 ${roleColors[member.role]}`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {roleLabels[member.role]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {isOwner && !isMemberOwner && !isCurrentUser && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.profile?.displayName} from the team?
                        They will lose access to all team resources.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          removeMember.mutate({ teamId, userId: member.userId })
                        }
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        );
      })}

      {members.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No team members yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Invite colleagues to collaborate on tasks
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
