import { Priority, SkillTag } from '@/types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_TEAMLEAD_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeneratedTask {
  title: string;
  description?: string;
  priority: Priority;
  skills?: SkillTag[];
}

interface TaskGenerationResponse {
  tasks: GeneratedTask[];
}

export const generateTasksFromText = async (
  content: string,
  context?: string
): Promise<TaskGenerationResponse> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const prompt = `You are a project management assistant. Extract actionable tasks from the following ${context || 'content'}.

For each task, provide:
- title: Short, clear task title (required)
- description: Brief description of what needs to be done (optional)
- priority: One of: low, medium, high, critical (required)
- skills: Array of required skills from: frontend, backend, infra, mobile, design, qa, devops (optional)

Only extract tasks that are clearly actionable. Be concise and specific.

${context === 'meeting notes' ? `Meeting Notes:\n${content}` : `Content:\n${content}`}

Return ONLY a valid JSON object with this exact structure:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description",
      "priority": "medium",
      "skills": ["frontend", "backend"]
    }
  ]
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from AI');
    }

    // Extract JSON from markdown code blocks if present
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to generate tasks');
  }
};

export const generateMilestoneRiskAnalysis = async (
  milestoneName: string,
  tasks: Array<{ title: string; status: string; priority: string }>,
  targetDate: Date
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const daysUntilTarget = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const highPriorityPending = tasks.filter(t => t.priority === 'high' || t.priority === 'critical').filter(t => t.status !== 'done').length;

  const prompt = `Analyze the risk for this project milestone and provide a brief assessment (2-3 sentences max).

Milestone: ${milestoneName}
Target Date: ${targetDate.toLocaleDateString()} (${daysUntilTarget} days away)
Progress: ${completedTasks}/${totalTasks} tasks completed
High Priority Pending: ${highPriorityPending} tasks

Tasks:
${tasks.map(t => `- [${t.status}] ${t.title} (${t.priority})`).join('\n')}

Provide a concise risk assessment focusing on:
1. Timeline risk (on track, at risk, or critical)
2. Key blockers or concerns
3. One actionable recommendation

Keep it brief and actionable.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from AI');
    }

    return text.trim();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to generate risk analysis');
  }
};

export const generateTaskRecommendations = async (
  developerSkills: SkillTag[],
  availableCapacity: number,
  tasks: Array<{ id: string; title: string; skills: SkillTag[]; effort: number; priority: string }>
): Promise<{ taskId: string; reason: string }[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const prompt = `You are a task assignment assistant. Recommend which tasks to assign to a developer based on their skills and capacity.

Developer Profile:
- Skills: ${developerSkills.join(', ')}
- Available Capacity: ${availableCapacity} hours

Available Tasks:
${tasks.map((t, i) => `${i + 1}. ${t.title}
   - Skills needed: ${t.skills.join(', ') || 'none specified'}
   - Effort: ${t.effort}h
   - Priority: ${t.priority}`).join('\n\n')}

Return ONLY a valid JSON array with recommended task assignments (max 3 tasks):
[
  {
    "taskIndex": 0,
    "reason": "Brief reason for recommendation"
  }
]

Consider:
1. Skill match
2. Priority
3. Capacity constraints
4. Workload balance`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from AI');
    }

    // Extract JSON from markdown code blocks if present
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const recommendations = JSON.parse(jsonText);
    
    return recommendations.map((rec: any) => ({
      taskId: tasks[rec.taskIndex]?.id,
      reason: rec.reason,
    })).filter((rec: any) => rec.taskId);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to generate recommendations');
  }
};
