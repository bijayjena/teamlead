# teamlead - Features Documentation

## Overview

teamlead is a comprehensive team management and task tracking application with AI-powered features.

## Core Features

### 1. Task Management
- **Kanban Board**: Drag-and-drop across 5 columns (Backlog, To Do, In Progress, Review, Done)
- **Task Creation**: Manual creation with full details or AI-powered generation
- **Task Assignment**: Assign to team members with skill matching
- **Priority Levels**: Low, Medium, High, Critical
- **Effort Tracking**: Hours/story points per task
- **Dependencies**: Link related tasks

### 2. AI Features

#### AI Task Generation
- Convert natural language to structured tasks
- Extract multiple tasks from descriptions
- Automatic priority and skill assignment
- Available in Quick Capture and Meeting Notes

#### Meeting Notes Analysis
- Capture notes with time tracking
- AI extracts actionable tasks
- Review and select before creation

#### Milestone Risk Analysis
- AI analyzes progress and timeline
- Identifies blockers and concerns
- Provides actionable recommendations
- Risk levels: on track, at risk, critical

#### Smart Task Recommendations
- AI suggests optimal task assignments
- Considers skills, capacity, and priorities
- Provides reasoning for recommendations
- One-click assignment

### 3. Team Management

#### Multi-Team Support
- Create and join multiple teams
- Active team switching
- Team ownership and membership
- Role-based access (Admin, Team Lead, Developer)

#### Invitation System
- Email-based invitations with tokens
- 7-day expiration
- Role selection during invitation
- Email verification on acceptance

#### Member Management
- View all team members
- Remove members (owner only)
- Role badges and indicators
- Team statistics

#### Notifications
- Real-time invitation notifications
- Bell icon with badge count
- Quick view/decline actions

### 4. Team Capacity
- Developer workload tracking
- Capacity visualization
- Skill management
- Overload warnings
- Team-wide statistics

### 5. Reports & Analytics
- Milestone tracking with progress
- Overall project progress
- Task completion statistics
- Export to Excel/CSV
- Shareable reports

## Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **State**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Auth**: Supabase Auth

## Security

- Row Level Security (RLS) on all tables
- Token-based invitations
- Email verification
- Role-based permissions
- Owner-only actions protected

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_GEMINI_TEAMLEAD_KEY=your_gemini_api_key
```

## Getting Started

1. Clone repository
2. Install dependencies: `npm install`
3. Setup environment variables
4. Run migrations: `supabase db push`
5. Start dev server: `npm run dev`

## Documentation

- [AI Features](./AI_FEATURES.md) - Detailed AI capabilities
- [Setup Guide](./SETUP.md) - Installation and configuration
- [UI Guide](./UI_GUIDE.md) - Design system and components
