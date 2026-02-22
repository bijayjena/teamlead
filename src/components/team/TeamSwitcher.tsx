import { useAllUserTeams, useUserSettings, useSwitchActiveTeam, useCreateTeamAndSetActive } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Check, Plus, Users, Crown } from 'lucide-react';
import { useState } from 'react';

export const TeamSwitcher = () => {
  const { data: allTeams = [] } = useAllUserTeams();
  const { data: settings } = useUserSettings();
  const switchTeam = useSwitchActiveTeam();
  const createTeam = useCreateTeamAndSetActive();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const activeTeam = allTeams.find((t) => t.id === settings?.active_team_id);

  const handleSwitchTeam = (teamId: string) => {
    if (teamId !== settings?.active_team_id) {
      switchTeam.mutate(teamId);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    await createTeam.mutateAsync(newTeamName.trim());
    setNewTeamName('');
    setCreateDialogOpen(false);
  };

  if (allTeams.length === 0) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </Button>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Your First Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="My Team"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTeam.isPending || !newTeamName.trim()}>
                  {createTeam.isPending ? 'Creating...' : 'Create Team'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate">{activeTeam?.name || 'Select Team'}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px]">
          <DropdownMenuLabel>Switch Team</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allTeams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onClick={() => handleSwitchTeam(team.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {team.isOwner && <Crown className="h-3 w-3 text-yellow-600 shrink-0" />}
                <span className="truncate">{team.name}</span>
              </div>
              {team.id === settings?.active_team_id && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="My Team"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTeam.isPending || !newTeamName.trim()}>
                {createTeam.isPending ? 'Creating...' : 'Create Team'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
