import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { UserPlus } from 'lucide-react';
import { SkillTag } from '@/types';
import { useCreateDeveloper } from '@/hooks/useDevelopers';
import { SkillBadge } from '@/components/shared/SkillBadge';

const ALL_SKILLS: SkillTag[] = ['frontend', 'backend', 'infra', 'mobile', 'design', 'qa', 'devops'];

export const AddDeveloperDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<SkillTag[]>([]);
  const [maxCapacity, setMaxCapacity] = useState(40);
  const [availability, setAvailability] = useState(100);

  const createDeveloper = useCreateDeveloper();

  const toggleSkill = (skill: SkillTag) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    createDeveloper.mutate(
      {
        name: name.trim(),
        skills: selectedSkills,
        maxCapacity,
        currentLoad: 0,
        availability,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setName('');
    setSelectedSkills([]);
    setMaxCapacity(40);
    setAvailability(100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Developer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Developer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter developer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`transition-opacity ${
                    selectedSkills.includes(skill) ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <SkillBadge skill={skill} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Max Capacity (hours/sprint)</Label>
              <span className="text-sm text-muted-foreground">{maxCapacity}h</span>
            </div>
            <Slider
              value={[maxCapacity]}
              onValueChange={([value]) => setMaxCapacity(value)}
              min={8}
              max={80}
              step={4}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Availability</Label>
              <span className="text-sm text-muted-foreground">{availability}%</span>
            </div>
            <Slider
              value={[availability]}
              onValueChange={([value]) => setAvailability(value)}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDeveloper.isPending || !name.trim()}>
              {createDeveloper.isPending ? 'Adding...' : 'Add Developer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
