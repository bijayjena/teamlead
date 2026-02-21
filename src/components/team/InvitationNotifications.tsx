import { useMyInvitations, useAcceptInvitation, useDeclineInvitation } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InvitationNotifications = () => {
  const { data: invitations = [] } = useMyInvitations();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();
  const navigate = useNavigate();

  if (invitations.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {invitations.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Team Invitations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.map((invitation) => (
          <div key={invitation.id} className="p-2 space-y-2">
            <div>
              <p className="text-sm font-medium">{invitation.teamName}</p>
              <p className="text-xs text-muted-foreground">
                Invited by {invitation.inviterName || 'a team member'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate(`/invite/${invitation.token}`)}
                className="flex-1 gap-1"
              >
                <Check className="h-3 w-3" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => declineInvitation.mutate(invitation.token)}
                className="gap-1"
              >
                <X className="h-3 w-3" />
                Decline
              </Button>
            </div>
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
