import { useState, useEffect } from 'react';
import { Developer, SkillTag } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SkillBadge } from '@/components/shared/SkillBadge';
import { useUpdateDeveloper } from '@/hooks/useDevelopers';

const ALL_SKILLS: SkillTag[] = ['frontend', 'backend', 'infra', 'mobile', 'design', 'qa', 'devops'];

interface EditDeveloperDialogProps {
  developer: Developer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditDeveloperDialog = ({ developer, open, onOpenChange }: EditDeveloperDialogProps) => {
  const [name, setName] = useState(developer.name);
  const [skills, setSkills] = useState<SkillTag[]>(developer.skills);
  const [maxCapacity, setMaxCapacity] = useState(developer.maxCapacity);
  const [availability, setAvailability] = useState(developer.availability);

  const updateDeveloper = useUpdateDeveloper();

  useEffect(() => {
    setName(developer.name);
    setSkills(developer.skills);
    setMaxCapacity(developer.maxCapacity);
    setAvailability(developer.availability);
  }, [developer]);

  const toggleSkill = (skill: SkillTag) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || skills.length === 0) return;

    updateDeveloper.mutate(
      { id: developer.id, name: name.trim(), skills, maxCapacity, availability },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Developer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((skill) => (
                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                  className={skills.includes(skill) ? 'opacity-100' : 'opacity-40'}>
                  <SkillBadge skill={skill} size="sm" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Max Capacity: {maxCapacity}h</Label>
            <Slider value={[maxCapacity]} onValueChange={([v]) => setMaxCapacity(v)} min={8} max={80} step={1} />
          </div>

          <div className="space-y-2">
            <Label>Availability: {availability}%</Label>
            <Slider value={[availability]} onValueChange={([v]) => setAvailability(v)} min={0} max={100} step={5} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateDeveloper.isPending || !name.trim() || skills.length === 0}>
              {updateDeveloper.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
