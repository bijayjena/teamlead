# AI Features Documentation

This document describes all the AI-powered features implemented in teamlead using Google's Gemini API.

## Setup

The application uses the Gemini API key stored in the environment variable:
```
VITE_GEMINI_TEAMLEAD_KEY=your_api_key_here
```

All AI features are powered by the `gemini-2.0-flash-exp` model through the Gemini API.

## Features

### 1. AI Task Generation from Quick Capture

**Location:** Tasks Page - Quick Capture Component

**Description:** Converts natural language descriptions into structured, actionable tasks.

**How it works:**
- Users describe their work in plain English
- AI extracts multiple tasks with:
  - Title
  - Description
  - Priority (low, medium, high, critical)
  - Required skills (frontend, backend, infra, mobile, design, qa, devops)
- Tasks are automatically created in the backlog

**Example Input:**
```
We need to build a user authentication system with OAuth support. 
It should include login, signup, and password reset. High priority. 
Also need to fix the dashboard performance issues and setup monitoring for production.
```

**Example Output:**
- Task 1: "Implement OAuth authentication system" (high priority, backend, frontend)
- Task 2: "Fix dashboard performance issues" (high priority, frontend)
- Task 3: "Setup production monitoring" (medium priority, devops, infra)

**Code:** `src/components/tasks/TaskCapture.tsx`, `src/lib/geminiService.ts::generateTasksFromText()`

---

### 2. AI Task Generation from Meeting Notes

**Location:** Meeting Notes Page

**Description:** Automatically extracts actionable tasks from meeting notes.

**How it works:**
- After saving meeting notes, click "Generate Tasks"
- AI analyzes the meeting content and identifies action items
- Users can review, select, and create tasks from the suggestions
- Each task includes title, description, priority, and required skills

**Use Case:**
- Capture meeting discussions in real-time
- Let AI identify all action items
- Quickly convert decisions into trackable tasks

**Code:** `src/pages/MeetingNotesPage.tsx`, `src/lib/geminiService.ts::generateTasksFromText()`

---

### 3. AI Milestone Risk Analysis

**Location:** Stakeholders Page - Milestone Cards

**Description:** Provides intelligent risk assessment for project milestones.

**How it works:**
- Click "AI Risk Analysis" on any milestone card
- AI analyzes:
  - Timeline (days until target date)
  - Task completion progress
  - High-priority pending tasks
  - Current task statuses
- Generates a concise risk assessment with:
  - Timeline risk level (on track, at risk, critical)
  - Key blockers or concerns
  - Actionable recommendations

**Example Output:**
```
Timeline Risk: At Risk

With 15 days remaining and only 40% completion, this milestone is at risk. 
The 3 high-priority tasks still in backlog are concerning, particularly the 
"API integration" which blocks other work. 

Recommendation: Prioritize the API integration task immediately and consider 
adding resources to the frontend tasks to accelerate progress.
```

**Code:** `src/components/stakeholders/RiskAnalysisButton.tsx`, `src/lib/geminiService.ts::generateMilestoneRiskAnalysis()`

---

### 4. AI Task Recommendations for Developers

**Location:** Team Page - Developer Cards

**Description:** Intelligently recommends which tasks to assign to each developer.

**How it works:**
- Click "AI Recommendations" on any developer card
- AI considers:
  - Developer's skills and expertise
  - Available capacity (hours)
  - Task priorities
  - Skill requirements
  - Workload balance
- Suggests up to 3 optimal task assignments with reasoning
- One-click assignment from recommendations

**Example Output:**
```
Recommended Tasks for Sarah:

1. "Implement user dashboard UI"
   Reason: Perfect match for Sarah's frontend and design skills. 
   Medium priority task fits within her 8h available capacity.

2. "Add responsive mobile layout"
   Reason: Leverages Sarah's mobile and frontend expertise. 
   Can be completed alongside the dashboard work.
```

**Code:** `src/components/developers/TaskRecommendations.tsx`, `src/lib/geminiService.ts::generateTaskRecommendations()`

---

## Technical Implementation

### Gemini Service (`src/lib/geminiService.ts`)

The centralized service handles all AI interactions:

```typescript
// Task generation from text
generateTasksFromText(content: string, context?: string): Promise<TaskGenerationResponse>

// Milestone risk analysis
generateMilestoneRiskAnalysis(
  milestoneName: string,
  tasks: Array<{title, status, priority}>,
  targetDate: Date
): Promise<string>

// Task recommendations for developers
generateTaskRecommendations(
  developerSkills: SkillTag[],
  availableCapacity: number,
  tasks: Array<{id, title, skills, effort, priority}>
): Promise<{taskId: string, reason: string}[]>
```

### API Configuration

- **Model:** `gemini-2.0-flash-exp`
- **Temperature:** 0.7 (balanced creativity and consistency)
- **Max Tokens:** 256-2048 (depending on feature)
- **Response Format:** JSON with structured data

### Error Handling

All AI features include:
- Loading states with spinners
- Error messages with user-friendly descriptions
- Graceful fallbacks
- Toast notifications for success/failure

## Best Practices

1. **Task Generation:**
   - Provide clear, detailed descriptions
   - Include priorities and skill requirements in natural language
   - Mention deadlines or urgency when relevant

2. **Meeting Notes:**
   - Write comprehensive notes with action items
   - Use clear language about who should do what
   - Include context about priorities

3. **Risk Analysis:**
   - Keep milestone task lists up to date
   - Update task statuses regularly
   - Review AI recommendations and add manual notes

4. **Task Recommendations:**
   - Keep developer skills and capacity current
   - Review AI reasoning before assigning
   - Use as a starting point, not absolute truth

## Future Enhancements

Potential AI features to add:
- Sprint planning assistance
- Automatic task effort estimation
- Dependency detection and suggestions
- Team velocity predictions
- Burndown chart analysis
- Smart task prioritization
- Meeting summary generation
- Automated status reports
