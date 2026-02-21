import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcceptInvitation, useDeclineInvitation } from '@/hooks/useTeams';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const InvitePage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();

  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('team_invitations')
          .select(`
            *,
            teams:team_id (name),
            profiles:invited_by (display_name)
          `)
          .eq('token', token)
          .single();

        if (error) throw error;

        if (data.status !== 'pending') {
          setError('This invitation has already been used or expired');
        } else if (new Date(data.expires_at) < new Date()) {
          setError('This invitation has expired');
        } else {
          setInvitation(data);
        }
      } catch (err: any) {
        setError('Invalid or expired invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    try {
      await acceptInvitation.mutateAsync(token);
      navigate('/team-members');
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleDecline = async () => {
    if (!token) return;
    try {
      await declineInvitation.mutateAsync(token);
      navigate('/');
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Team Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Please sign in or create an account to accept this invitation.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/login')} className="flex-1">
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')} variant="outline" className="flex-1">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitation && user.email !== invitation.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Email Mismatch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                This invitation was sent to <strong>{invitation.email}</strong>, but you're signed in as{' '}
                <strong>{user.email}</strong>. Please sign in with the correct account.
              </AlertDescription>
            </Alert>
            <Button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/login');
              }}
              className="w-full"
            >
              Sign Out and Switch Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Team Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-2">You've been invited to join</p>
            <p className="text-xl font-semibold text-foreground mb-1">
              {invitation.teams?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              by {invitation.profiles?.display_name || 'a team member'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium text-foreground capitalize">
                {invitation.role.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-foreground">{invitation.email}</span>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              By accepting, you'll be able to collaborate on tasks and access team resources.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAccept}
              disabled={acceptInvitation.isPending || declineInvitation.isPending}
              className="flex-1 gap-2"
            >
              {acceptInvitation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Accept Invitation
                </>
              )}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={acceptInvitation.isPending || declineInvitation.isPending}
              variant="outline"
              className="gap-2"
            >
              {declineInvitation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitePage;
