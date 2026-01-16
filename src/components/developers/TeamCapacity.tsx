import { Developer } from '@/types';
import { DeveloperCard } from './DeveloperCard';
import { getCapacityPercentage } from '@/data/mockData';
import { Users, AlertTriangle, TrendingUp } from 'lucide-react';

interface TeamCapacityProps {
  developers: Developer[];
}

export const TeamCapacity = ({ developers }: TeamCapacityProps) => {
  const overloadedCount = developers.filter(
    (dev) => getCapacityPercentage(dev) >= 90
  ).length;
  
  const averageLoad = Math.round(
    developers.reduce((sum, dev) => sum + getCapacityPercentage(dev), 0) / developers.length
  );

  const availableCapacity = developers.reduce((sum, dev) => {
    const effectiveMax = dev.maxCapacity * (dev.availability / 100);
    return sum + (effectiveMax - dev.currentLoad);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-semibold text-foreground">{developers.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-capacity-medium/10">
              <TrendingUp className="h-5 w-5 text-capacity-medium" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Load</p>
              <p className="text-2xl font-semibold text-foreground">{averageLoad}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-capacity-high/10">
              <AlertTriangle className="h-5 w-5 text-capacity-high" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overloaded</p>
              <p className="text-2xl font-semibold text-foreground">{overloadedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {developers.map((developer) => (
          <DeveloperCard key={developer.id} developer={developer} />
        ))}
      </div>
    </div>
  );
};
