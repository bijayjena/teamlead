import { cn } from '@/lib/utils';
import { SkillTag } from '@/types';
import { getSkillColor } from '@/data/mockData';

interface SkillBadgeProps {
  skill: SkillTag;
  size?: 'sm' | 'md';
}

export const SkillBadge = ({ skill, size = 'md' }: SkillBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium capitalize",
        getSkillColor(skill),
        size === 'sm' ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs"
      )}
    >
      {skill}
    </span>
  );
};
