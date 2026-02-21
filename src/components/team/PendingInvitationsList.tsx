import { TeamInvitation, useCancelInvitation } from '@/hooks/useTeams';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, X, Copy, Check } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

interface PendingInvitationsListProps {
  invitations: TeamInvitation[];
}

export const PendingInvitationsList = ({ invitations }: PendingInvitationsListProps) => {
  const cancelInvitation = useCancelInvitation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (invitation: TeamInvitation) => {
    const link = `${window.location.origin}/invite/${invitation.token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(invitation.id);
    toast.success('Invitation link copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');

  if (pendingInvitations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No pending invitations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {pendingInvitations.map((invitation) => (
        <Card key={invitation.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{invitation.email}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {invitation.role.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires {formatDistanceToNow(invitation.expiresAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyLink(invitation)}
                className="gap-1.5"
              >
                {copiedId === invitation.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cancelInvitation.mutate(invitation.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
