import { useTeams, useSwitchTeam, useActiveTeam } from '@/hooks/useTeams';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Crown, Users } from 'lucide-react';
import { CreateTeamDialog } from './CreateTeamDialog';
import { Button } from '@/components/ui/button';

export const TeamSelector = () => {
  const { data: teams = [], isLoading } = useTeams();
  const { data: activeTeam } = useActiveTeam();
  const switchTeam = useSwitchTeam();

  const handleTeamChange = (teamId: string) => {
    switchTeam.mutate(teamId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-48 animate-pulse bg-muted rounded-md" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <CreateTeamDialog
        trigger={
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Create Your First Team
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={activeTeam?.id || teams[0]?.id}
        onValueChange={handleTeamChange}
        disabled={switchTeam.isPending}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                <span>{team.name}</span>
                {team.isOwner ? (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Crown className="h-3 w-3" />
                    Owner
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {team.role}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CreateTeamDialog />
    </div>
  );
};
