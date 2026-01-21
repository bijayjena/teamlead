export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type SkillTag = 'frontend' | 'backend' | 'infra' | 'mobile' | 'design' | 'qa' | 'devops';

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  effort: number; // in hours or story points
  priority: Priority;
  skills: SkillTag[];
  status: TaskStatus;
  assigneeId?: string;
  parentId?: string;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Developer {
  id: string;
  name: string;
  avatar?: string;
  skills: SkillTag[];
  maxCapacity: number; // hours per sprint
  currentLoad: number; // hours assigned
  availability: number; // 0-100% (for leave, partial days)
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  targetDate: Date;
  taskIds: string[];
  progress: number; // 0-100
  riskNotes?: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  taskIds: string[];
}
