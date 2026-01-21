import { Task, Developer, Milestone, SkillTag, Priority, TaskStatus } from '@/types';

export const mockDevelopers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Sarah Chen',
    avatar: 'SC',
    skills: ['frontend', 'design'],
    maxCapacity: 40,
    currentLoad: 28,
    availability: 100,
  },
  {
    id: 'dev-2',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    skills: ['backend', 'infra'],
    maxCapacity: 40,
    currentLoad: 38,
    availability: 100,
  },
  {
    id: 'dev-3',
    name: 'Emily Park',
    avatar: 'EP',
    skills: ['frontend', 'mobile'],
    maxCapacity: 40,
    currentLoad: 22,
    availability: 80,
  },
  {
    id: 'dev-4',
    name: 'Alex Rivera',
    avatar: 'AR',
    skills: ['backend', 'devops'],
    maxCapacity: 40,
    currentLoad: 35,
    availability: 100,
  },
  {
    id: 'dev-5',
    name: 'Jordan Kim',
    avatar: 'JK',
    skills: ['qa', 'frontend'],
    maxCapacity: 40,
    currentLoad: 15,
    availability: 100,
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'User authentication flow',
    description: 'Implement OAuth2 login with Google and GitHub',
    effort: 8,
    priority: 'high',
    skills: ['backend', 'frontend'],
    status: 'in-progress',
    assigneeId: 'dev-2',
    dependencies: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'task-2',
    title: 'Dashboard UI components',
    description: 'Create reusable chart and card components',
    effort: 6,
    priority: 'high',
    skills: ['frontend', 'design'],
    status: 'in-progress',
    assigneeId: 'dev-1',
    dependencies: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'task-3',
    title: 'API rate limiting',
    description: 'Implement Redis-based rate limiting for public endpoints',
    effort: 5,
    priority: 'medium',
    skills: ['backend', 'infra'],
    status: 'todo',
    assigneeId: 'dev-4',
    dependencies: ['task-1'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'task-4',
    title: 'Mobile responsive layouts',
    description: 'Ensure all pages work on mobile devices',
    effort: 4,
    priority: 'medium',
    skills: ['frontend', 'mobile'],
    status: 'todo',
    assigneeId: 'dev-3',
    dependencies: ['task-2'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'task-5',
    title: 'E2E test suite',
    description: 'Write Playwright tests for critical user flows',
    effort: 6,
    priority: 'low',
    skills: ['qa', 'frontend'],
    status: 'backlog',
    dependencies: ['task-1', 'task-2'],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'task-6',
    title: 'Database schema optimization',
    description: 'Add indexes and optimize slow queries',
    effort: 4,
    priority: 'medium',
    skills: ['backend', 'infra'],
    status: 'review',
    assigneeId: 'dev-2',
    dependencies: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'task-7',
    title: 'User settings page',
    description: 'Profile, notifications, and preferences',
    effort: 5,
    priority: 'low',
    skills: ['frontend'],
    status: 'backlog',
    dependencies: ['task-1'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'task-8',
    title: 'CI/CD pipeline setup',
    description: 'GitHub Actions for testing and deployment',
    effort: 3,
    priority: 'high',
    skills: ['devops', 'infra'],
    status: 'done',
    assigneeId: 'dev-4',
    dependencies: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    name: 'Alpha Release',
    description: 'Core features complete for internal testing',
    targetDate: new Date('2024-02-15'),
    taskIds: ['task-1', 'task-2', 'task-6', 'task-8'],
    progress: 65,
    riskNotes: 'Auth integration taking longer than expected',
  },
  {
    id: 'milestone-2',
    name: 'Beta Release',
    description: 'Feature complete for external beta testers',
    targetDate: new Date('2024-03-01'),
    taskIds: ['task-3', 'task-4', 'task-5'],
    progress: 20,
  },
  {
    id: 'milestone-3',
    name: 'Production Launch',
    description: 'Full public release',
    targetDate: new Date('2024-03-15'),
    taskIds: ['task-7'],
    progress: 0,
  },
];

export const getCapacityPercentage = (developer: Developer): number => {
  const effectiveCapacity = developer.maxCapacity * (developer.availability / 100);
  return Math.round((developer.currentLoad / effectiveCapacity) * 100);
};

export const getCapacityStatus = (percentage: number): 'low' | 'medium' | 'high' => {
  if (percentage < 70) return 'low';
  if (percentage < 90) return 'medium';
  return 'high';
};

export const getSkillColor = (skill: SkillTag): string => {
  const colors: Record<SkillTag, string> = {
    frontend: 'bg-chart-1/20 text-chart-1',
    backend: 'bg-chart-2/20 text-chart-2',
    infra: 'bg-chart-3/20 text-chart-3',
    mobile: 'bg-chart-4/20 text-chart-4',
    design: 'bg-primary/20 text-primary',
    qa: 'bg-chart-5/20 text-chart-5',
    devops: 'bg-muted/40 text-muted-foreground',
  };
  return colors[skill];
};

export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    low: 'bg-capacity-low/20 text-capacity-low',
    medium: 'bg-capacity-medium/20 text-capacity-medium',
    high: 'bg-capacity-high/20 text-capacity-high',
    critical: 'bg-destructive/20 text-destructive',
  };
  return colors[priority];
};

export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    backlog: 'bg-muted/40 text-muted-foreground',
    todo: 'bg-chart-3/20 text-chart-3',
    'in-progress': 'bg-primary/20 text-primary',
    review: 'bg-chart-1/20 text-chart-1',
    done: 'bg-capacity-low/20 text-capacity-low',
  };
  return colors[status];
};
